// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.about-card, .skill-category, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Aquí puedes agregar la lógica para enviar el formulario
        // Por ahora, solo mostramos un mensaje
        alert('¡Gracias por tu mensaje! Me pondré en contacto contigo pronto.');
        contactForm.reset();
    });
}

// Animated skill bars on scroll
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fillBar 2s ease-out forwards';
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.bg-shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.2);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add active state to navigation
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Typing effect for subtitle (optional)
const subtitle = document.querySelector('.subtitle');
if (subtitle) {
    const text = subtitle.textContent;
    subtitle.textContent = '';
    let i = 0;
    
    const typeWriter = () => {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Start typing after a short delay
    setTimeout(typeWriter, 500);
}

// Add hover effect to floating elements
const floatingElements = document.querySelectorAll('.float-element');
floatingElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.style.transform = 'scale(1.5) rotate(360deg)';
        element.style.transition = 'all 0.5s ease';
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Console easter egg
console.log('%c¡Hola! 👋', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cGracias por visitar mi portafolio', 'font-size: 14px; color: #764ba2;');
console.log('%c- Jaquelin Guadalupe Tut Ek', 'font-size: 12px; color: #666;');

// ==========================================
// CHATBOT ASSISTANT WITH GEMINI FLASH API
// ==========================================

// IMPORTANTE: Reemplaza 'YOUR_GEMINI_API_KEY' con tu clave API de Google
// Obtén tu clave en: https://aistudio.google.com/apikey
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

class ChatbotAssistant {
    constructor() {
        this.chatWidget = document.querySelector('.chatbot-widget');
        this.chatToggle = document.getElementById('chatbotToggle');
        this.chatClose = document.querySelector('.chatbot-close');
        this.messagesContainer = document.getElementById('chatbotMessages');
        this.inputField = document.getElementById('chatbotInput');
        this.sendBtn = document.getElementById('chatbotSend');
        this.conversationHistory = [];
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.chatToggle.addEventListener('click', () => this.toggleChat());
        this.chatClose.addEventListener('click', () => this.closeChat());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Mostrar mensaje de bienvenida
        this.showWelcomeMessage();
    }
    
    toggleChat() {
        this.chatWidget.classList.toggle('visible');
        if (this.chatWidget.classList.contains('visible')) {
            this.chatToggle.classList.add('hidden');
            this.inputField.focus();
        }
    }
    
    closeChat() {
        this.chatWidget.classList.remove('visible');
        this.chatToggle.classList.remove('hidden');
    }
    
    showWelcomeMessage() {
        const welcomeMsg = document.createElement('div');
        welcomeMsg.className = 'chatbot-welcome';
        welcomeMsg.innerHTML = `
            <p><strong>¡Hola! 👋</strong></p>
            <p>Soy tu asistente IA. Haz preguntas sobre programación, redes, o cualquier otro tema. ¡Estoy aquí para ayudarte!</p>
        `;
        this.messagesContainer.appendChild(welcomeMsg);
    }
    
    addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${isUser ? 'user' : 'bot'}`;
        
        if (!isUser) {
            const avatar = document.createElement('div');
            avatar.className = 'chatbot-avatar';
            avatar.textContent = '🤖';
            messageDiv.appendChild(avatar);
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'chatbot-message-content';
        contentDiv.textContent = text;
        messageDiv.appendChild(contentDiv);
        
        if (isUser) {
            const avatar = document.createElement('div');
            avatar.className = 'chatbot-avatar';
            avatar.textContent = '👤';
            messageDiv.appendChild(avatar);
        }
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot';
        
        const avatar = document.createElement('div');
        avatar.className = 'chatbot-avatar';
        avatar.textContent = '🤖';
        typingDiv.appendChild(avatar);
        
        const typingContent = document.createElement('div');
        typingContent.className = 'chatbot-typing';
        typingContent.innerHTML = '<span></span><span></span><span></span>';
        typingDiv.appendChild(typingContent);
        
        this.messagesContainer.appendChild(typingDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        return typingDiv;
    }
    
    async sendMessage() {
        const userMessage = this.inputField.value.trim();
        
        if (!userMessage) return;
        
        if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
            this.addMessage('⚠️ Por favor, configura tu clave API de Gemini en el archivo script.js', false);
            this.addMessage('Obtén tu clave aquí: https://aistudio.google.com/apikey', false);
            this.inputField.value = '';
            return;
        }
        
        // Agregar mensaje del usuario
        this.addMessage(userMessage, true);
        this.inputField.value = '';
        this.sendBtn.classList.add('loading');
        this.sendBtn.disabled = true;
        this.inputField.disabled = true;
        this.isLoading = true;
        
        // Guardar en historial
        this.conversationHistory.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });
        
        // Mostrar indicador de escritura
        const typingDiv = this.showTyping();
        
        try {
            const response = await this.callGeminiAPI(userMessage);
            
            // Remover indicador de escritura
            typingDiv.remove();
            
            if (response) {
                this.addMessage(response, false);
                
                // Guardar respuesta en historial
                this.conversationHistory.push({
                    role: 'model',
                    parts: [{ text: response }]
                });
            } else {
                this.addMessage('Lo siento, no pude obtener una respuesta. Intenta de nuevo.', false);
            }
        } catch (error) {
            typingDiv.remove();
            console.error('Error:', error);
            this.addMessage(`Error: ${error.message}`, false);
        } finally {
            this.sendBtn.classList.remove('loading');
            this.sendBtn.disabled = false;
            this.inputField.disabled = false;
            this.isLoading = false;
            this.inputField.focus();
        }
    }
    
    async callGeminiAPI(userMessage) {
        try {
            // Construir el payload con el historial de conversación
            const contents = this.conversationHistory.map(msg => ({
                role: msg.role,
                parts: msg.parts
            }));
            
            // Agregar el mensaje actual si no está ya en el historial
            if (contents.length === 0 || contents[contents.length - 1].parts[0].text !== userMessage) {
                contents.push({
                    role: 'user',
                    parts: [{ text: userMessage }]
                });
            }
            
            const payload = {
                contents: contents,
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.95,
                    topK: 64,
                    maxOutputTokens: 500,
                }
            };
            
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Respuesta inesperada de la API');
            }
        } catch (error) {
            throw new Error(`Error al conectar con Gemini: ${error.message}`);
        }
    }
}

// Inicializar chatbot cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ChatbotAssistant();
});
