import Deepgram from '@deepgram/sdk';

export class VoiceService {
    private deepgram: any;
    private mediaRecorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];
    private sessionId: string | null = null;

    constructor(deepgramApiKey: string) {
        this.deepgram = new Deepgram(deepgramApiKey);
    }
    
    // Method to setup media recorder
    public startRecording(): void {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                this.mediaRecorder = new MediaRecorder(stream);
                this.mediaRecorder.start();
                this.mediaRecorder.ondataavailable = (event) => {
                    this.audioChunks.push(event.data);
                };
            })
            .catch(error => console.error('Error accessing microphone:', error));
    }

    public stopRecording(): Promise<void> {
        return new Promise((resolve) => {
            if (this.mediaRecorder) {
                this.mediaRecorder.stop();
                this.mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(this.audioChunks);
                    this.audioChunks = [];
                    this.transcribeAudio(audioBlob);
                    resolve();
                };
            }
        });
    }

    private async transcribeAudio(blob: Blob): Promise<void> {
        const file = new File([blob], 'audio.wav', { type: 'audio/wav' });
        const response = await this.deepgram.transcription.preRecorded(file, {
            punctuate: true,
            language: 'es' // Spanish language
        });
        console.log('Transcription Results:', response);
    }

    public async textToSpeech(text: string): Promise<void> {
        // Text-to-Speech implementation (this is a simplified version)
        const audioResponse = await this.deepgram.tts.synthesize({ text, language: 'es' });
        const audio = new Audio(audioResponse.url);
        audio.play();
    }
}