/**
 * 🤖 BEDROCK SERVICE - ENHANCED VERSION
 * Servicio unificado para interactuar con Amazon Bedrock
 * Con retry logic, circuit breaker y mejor error handling
 */
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelWithResponseStreamCommand,
} from '@aws-sdk/client-bedrock-runtime';

class BedrockService {
  constructor() {
    const bearerToken = import.meta.env.VITE_AWS_BEARER_TOKEN_BEDROCK;

    this.client = new BedrockRuntimeClient({
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      ...(bearerToken && {
        credentials: {
          accessKeyId: 'BEARER_TOKEN',
          secretAccessKey: bearerToken,
        },
      }),
    });

    this.models = {
      'claude-3.5': 'anthropic.claude-3-5-sonnet-20240620-v1:0',
      'claude-3': 'anthropic.claude-3-sonnet-20240229-v1:0',
      'llama-3.2': 'meta.llama3-2-90b-instruct-v1:0',
      'nova-pro': 'amazon.nova-pro-v1:0',
      'nova-lite': 'amazon.nova-lite-v1:0',
    };

    // Circuit breaker config
    this.circuitBreaker = {
      failures: 0,
      maxFailures: 3,
      timeout: 60000, // 1 minuto
      resetTime: null,
      isOpen: false,
    };

    // Retry config
    this.retryConfig = {
      maxRetries: 3,
      baseDelay: 1000, // 1 segundo
      maxDelay: 10000, // 10 segundos
    };
  }

  /**
   * Circuit breaker check
   */
  checkCircuitBreaker() {
    if (this.circuitBreaker.isOpen) {
      const now = Date.now();
      if (now > this.circuitBreaker.resetTime) {
        // Reset circuit breaker
        this.circuitBreaker.isOpen = false;
        this.circuitBreaker.failures = 0;
        console.log('🔄 Circuit breaker reset');
      } else {
        throw new Error('Circuit breaker is open. Service temporarily unavailable.');
      }
    }
  }

  /**
   * Record failure
   */
  recordFailure() {
    this.circuitBreaker.failures++;
    if (this.circuitBreaker.failures >= this.circuitBreaker.maxFailures) {
      this.circuitBreaker.isOpen = true;
      this.circuitBreaker.resetTime = Date.now() + this.circuitBreaker.timeout;
      console.error('⚠️ Circuit breaker opened after', this.circuitBreaker.failures, 'failures');
    }
  }

  /**
   * Record success
   */
  recordSuccess() {
    this.circuitBreaker.failures = 0;
  }

  /**
   * Retry with exponential backoff
   */
  async retryWithBackoff(fn, retries = this.retryConfig.maxRetries) {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await fn();
        this.recordSuccess();
        return result;
      } catch (error) {
        // Don't retry on auth errors
        if (error.name === 'UnauthorizedException' || error.name === 'AccessDeniedException') {
          throw error;
        }

        if (i === retries - 1) {
          this.recordFailure();
          throw error;
        }

        // Exponential backoff
        const delay = Math.min(
          this.retryConfig.baseDelay * Math.pow(2, i),
          this.retryConfig.maxDelay
        );

        console.log(`⏳ Retry ${i + 1}/${retries} after ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Chat con Claude/Llama (con retry y circuit breaker)
   */
  async chat(messages, model = 'claude-3.5', options = {}) {
    this.checkCircuitBreaker();

    const { temperature = 0.7, maxTokens = 4096, stream = false } = options;
    const modelId = this.models[model] || this.models['claude-3.5'];

    try {
      if (stream) {
        return this.chatStream(messages, modelId, { temperature, maxTokens });
      }

      return await this.retryWithBackoff(async () => {
        const command = new InvokeModelCommand({
          modelId,
          contentType: 'application/json',
          accept: 'application/json',
          body: JSON.stringify(this.formatRequest(modelId, messages, { temperature, maxTokens })),
        });

        const response = await this.client.send(command);
        const result = JSON.parse(new TextDecoder().decode(response.body));

        return this.formatResponse(modelId, result);
      });
    } catch (error) {
      console.error('❌ Bedrock error:', error);

      // Enhanced error messages
      const errorMessages = {
        ThrottlingException: 'Too many requests. Please try again in a moment.',
        ModelTimeoutException: 'Model took too long to respond. Try again.',
        ValidationException: 'Invalid request format. Check your parameters.',
        AccessDeniedException: 'Access denied. Check your AWS credentials.',
        UnauthorizedException: 'Bearer token expired or invalid.',
        ServiceUnavailableException: 'Bedrock service is temporarily unavailable.',
      };

      const userMessage = errorMessages[error.name] || `API error: ${error.message}`;
      throw new Error(userMessage);
    }
  }

  /**
   * Chat con streaming
   */
  async *chatStream(messages, modelId, options) {
    const command = new InvokeModelWithResponseStreamCommand({
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(this.formatRequest(modelId, messages, options)),
    });

    const response = await this.client.send(command);

    for await (const event of response.body) {
      if (event.chunk) {
        const chunk = JSON.parse(new TextDecoder().decode(event.chunk.bytes));

        if (modelId.includes('anthropic')) {
          if (chunk.type === 'content_block_delta') {
            yield chunk.delta.text;
          }
        } else if (modelId.includes('meta')) {
          yield chunk.generation;
        }
      }
    }
  }

  /**
   * Análisis de imágenes (Claude 3.5 Vision)
   */
  async analyzeImage(imageBase64, prompt, model = 'claude-3.5') {
    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ];

    return this.chat(messages, model);
  }

  /**
   * Generar embeddings
   */
  async generateEmbeddings(texts) {
    const command = new InvokeModelCommand({
      modelId: 'amazon.titan-embed-text-v1',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        inputText: Array.isArray(texts) ? texts.join(' ') : texts,
      }),
    });

    const response = await this.client.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    return result.embedding;
  }

  /**
   * Formatea request según modelo
   */
  formatRequest(modelId, messages, options) {
    if (modelId.includes('anthropic')) {
      return {
        anthropic_version: 'bedrock-2023-05-31',
        messages,
        max_tokens: options.maxTokens,
        temperature: options.temperature,
      };
    } else if (modelId.includes('meta')) {
      return {
        prompt: this.convertMessagesToPrompt(messages),
        max_gen_len: options.maxTokens,
        temperature: options.temperature,
      };
    } else if (modelId.includes('amazon.nova')) {
      return {
        messages,
        inferenceConfig: {
          max_new_tokens: options.maxTokens,
          temperature: options.temperature,
        },
      };
    }
  }

  /**
   * Formatea response según modelo
   */
  formatResponse(modelId, result) {
    if (modelId.includes('anthropic')) {
      return {
        text: result.content[0].text,
        model: modelId,
        usage: result.usage,
      };
    } else if (modelId.includes('meta')) {
      return {
        text: result.generation,
        model: modelId,
        usage: result.prompt_token_count,
      };
    } else if (modelId.includes('amazon.nova')) {
      return {
        text: result.output.message.content[0].text,
        model: modelId,
        usage: result.usage,
      };
    }
  }

  /**
   * Convierte mensajes a prompt simple
   */
  convertMessagesToPrompt(messages) {
    return messages.map((m) => `${m.role}: ${m.content}`).join('\n\n');
  }
}

export default new BedrockService();
