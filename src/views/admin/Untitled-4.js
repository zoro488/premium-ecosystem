import { GoogleGenerativeAI } from '@google/generative-ai';
import confetti from 'canvas-confetti';

// --- CONFIGURACIÓN ---
// ¡ATENCIÓN! Reemplaza esto con tu API Key real de Google AI Studio.
const GEMINI_API_KEY = '';

// --- ELEMENTOS DOM ---
const els = {
  splash: document.getElementById('splashScreen'),
  app: document.getElementById('appContainer'),
  loginContent: document.getElementById('loginContent'),
  progressBar: document.getElementById('progressBar'),
};

let genAI;
if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

// --- INICIO ---
document.addEventListener('DOMContentLoaded', () => {
  simulateLoadingSequence();
});

function simulateLoadingSequence() {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 12;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      finishLoading();
    }
    els.progressBar.style.width = `${progress}%`;
  }, 150);
}

function finishLoading() {
  setTimeout(() => {
    els.splash.style.opacity = '0';
    setTimeout(() => {
      els.splash.style.display = 'none';
      els.app.classList.remove('hidden');
      void els.app.offsetWidth;
      els.app.style.opacity = '1';
      renderLoginForm();
    }, 800);
  }, 500);
}

// --- RENDERIZADO ---
function renderLoginForm() {
  els.loginContent.innerHTML = `
    <div class="fade-in-up">
        <div class="glass-card rounded-[32px] p-10 md:p-12 relative overflow-hidden">
            <div class="mb-12 flex justify-center">
                <div id="interactiveLogo" class="w-28 h-28 relative transition-transform duration-300 ease-out">
                     <svg class="w-full h-full drop-shadow-2xl" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.9" />
                                <stop offset="100%" style="stop-color:#a0a0a0;stop-opacity:0.9" />
                            </linearGradient>
                             <filter id="softGlow">
                                <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        <circle cx="100" cy="100" r="85" stroke="url(#logoGradient)" stroke-width="0.5" opacity="0.3" />
                        <path d="M100 35 C 135 35, 165 65, 165 100 C 165 135, 135 165, 100 165 C 65 165, 35 135, 35 100 C 35 65, 65 35, 100 35 Z" fill="none" stroke="url(#logoGradient)" stroke-width="5" filter="url(#softGlow)" />
                        <circle cx="100" cy="100" r="28" fill="#ffffff" filter="url(#softGlow)" />
                    </svg>
                </div>
            </div>

            <h2 class="text-3xl font-medium text-white text-center mb-10 tracking-wide opacity-95">
                Bienvenido
            </h2>

            <form id="loginForm" class="space-y-6" novalidate>
                <div class="group relative">
                    <input type="email" id="email" required 
                        class="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-transparent focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-300"
                        placeholder="Email">
                    <label for="email" class="absolute left-4 top-4 text-white/40 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-white/70 pointer-events-none">
                        Email Corporativo
                    </label>
                    <!-- Indicador de Análisis IA -->
                    <div id="aiAnalysisIndicator" class="absolute right-4 top-4 hidden text-xs text-white/50 flex items-center transition-opacity duration-300">
                        <span class="w-2 h-2 bg-white/50 rounded-full animate-pulse mr-2"></span>
                        Analizando...
                    </div>
                </div>
                <div class="group relative">
                    <input type="password" id="password" required 
                        class="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-transparent focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-300"
                        placeholder="Contraseña">
                    <label for="password" class="absolute left-4 top-4 text-white/40 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-white/70 pointer-events-none">
                        Clave de Acceso
                    </label>
                </div>

                <button type="submit" id="submitBtn" class="w-full bg-white text-black rounded-xl py-4 font-medium tracking-wide hover:bg-[#f0f0f0] transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] mt-10 relative overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <span id="btnText" class="relative z-10">Iniciar Sesión</span>
                    <div id="btnLoader" class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 bg-white">
                        <svg class="animate-spin h-6 w-6 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </button>
            </form>
        </div>
        
        <div class="text-center mt-8 opacity-40 hover:opacity-80 transition-opacity duration-300">
             <p class="text-white text-[10px] tracking-[0.3em] font-mono uppercase">
                Powered by Chronos AI Neural Engine
            </p>
        </div>
    </div>
    `;

  initInteractions();
}

function initInteractions() {
  // Efecto Paralaje
  const logo = document.getElementById('interactiveLogo');
  const card = document.querySelector('.glass-card');
  if (card && logo) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.08;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.08;
      logo.style.transform = `translate(${x}px, ${y}px) rotateX(${-y * 0.5}deg) rotateY(${x * 0.5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      logo.style.transform = 'translate(0px, 0px) rotateX(0deg) rotateY(0deg)';
    });
  }

  // Análisis IA al escribir email
  const emailInput = document.getElementById('email');
  const analysisIndicator = document.getElementById('aiAnalysisIndicator');
  let analysisTimeout;

  emailInput.addEventListener('input', () => {
    clearTimeout(analysisTimeout);
    if (emailInput.value.length > 5 && emailInput.value.includes('@')) {
      analysisIndicator.classList.remove('hidden');
      analysisIndicator.style.opacity = '1';
      analysisIndicator.innerHTML =
        '<span class="w-2 h-2 bg-white/50 rounded-full animate-pulse mr-2"></span>Analizando...';

      // Simulamos análisis rápido de Gemini
      analysisTimeout = setTimeout(async () => {
        const isSafe = true; // Por defecto
        // Aquí podrías llamar a Gemini real para validar el dominio si quisieras
        // const result = await checkDomainWithGemini(emailInput.value);

        if (emailInput.value.includes('chronos.ai')) {
          analysisIndicator.innerHTML =
            '<span class="text-green-400 flex items-center"><svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg> Dominio Seguro</span>';
        } else {
          analysisIndicator.innerHTML = '<span class="text-white/60">Verificado</span>';
        }
      }, 1200);
    } else {
      analysisIndicator.style.opacity = '0';
      setTimeout(() => analysisIndicator.classList.add('hidden'), 300);
    }
  });

  document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
  e.preventDefault();
  const btnText = document.getElementById('btnText');
  const btnLoader = document.getElementById('btnLoader');
  const email = document.getElementById('email').value;

  btnText.style.opacity = '0';
  btnLoader.style.opacity = '1';

  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let welcomeMsg = 'Acceso concedido. Bienvenido al sistema.';
    let isAiMsg = false;

    if (GEMINI_API_KEY && genAI) {
      try {
        // Indicador visual de que la IA está pensando
        btnLoader.innerHTML = `
                <div class="flex items-center space-x-2">
                     <span class="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style="animation-delay: 0s"></span>
                     <span class="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                     <span class="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
                </div>`;

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const username = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
        const hour = new Date().getHours();
        let timeOfDay = 'día';
        if (hour < 12) timeOfDay = 'mañana';
        else if (hour < 20) timeOfDay = 'tarde';
        else timeOfDay = 'noche';

        const prompt = `Genera un saludo de bienvenida muy breve (máximo 12 palabras), elegante y futurista para el usuario '${username}'. Ten en cuenta que es por la ${timeOfDay}. Tono: IA avanzada y servicial. Evita 'Hola'.`;

        const result = await model.generateContent(prompt);
        welcomeMsg = await result.response.text();
        isAiMsg = true;
      } catch (err) {
        console.warn('Gemini API Error:', err);
      }
    }

    showModal(
      isAiMsg ? 'Enlace Chronos Establecido' : 'Acceso Exitoso',
      welcomeMsg,
      isAiMsg ? 'ai' : 'success'
    );
    if (isAiMsg)
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#ffffff', '#a0a0a0'],
        disableForReducedMotion: true,
      });
  } catch (error) {
    showModal('Error de Acceso', 'Credenciales no verificadas.', 'error');
  } finally {
    btnText.style.opacity = '1';
    btnLoader.style.opacity = '0';
    setTimeout(() => {
      btnLoader.innerHTML = `<svg class="animate-spin h-6 w-6 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
    }, 500);
  }
}

function showModal(title, body, type) {
  const modal = document.getElementById('messageModal');
  const content = document.getElementById('modalContent');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalIcon = document.getElementById('modalIcon');
  const aiPulse = document.getElementById('aiPulseIcon');

  modalTitle.textContent = title;
  modalBody.innerHTML = '';

  const icons = {
    success:
      '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
    error:
      '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>',
    ai: '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>',
  };

  modalIcon.innerHTML = icons[type] || icons.success;
  aiPulse.style.display = type === 'ai' ? 'block' : 'none';

  modal.classList.remove('pointer-events-none', 'opacity-0');
  content.classList.remove('scale-95', 'translate-y-4');
  content.classList.add('scale-100', 'translate-y-0');

  if (type === 'ai') {
    typeWriter(modalBody, body);
  } else {
    modalBody.textContent = body;
  }

  document.getElementById('modalCloseBtn').onclick = () => {
    modal.classList.add('opacity-0', 'pointer-events-none');
    content.classList.add('scale-95', 'translate-y-4');
    content.classList.remove('scale-100', 'translate-y-0');
  };
}

function typeWriter(element, text, i = 0) {
  if (i < text.length) {
    element.innerHTML += text.charAt(i);
    setTimeout(() => typeWriter(element, text, i + 1), 35);
  }
}
