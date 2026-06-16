/* ========================================
   AHS - Auto Hub Solution
   Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // === Loader ===
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        initRevealAnimations();
        initCounters();
    }, 2000);

    // === Neural Network Canvas ===
    const canvas = document.getElementById('neural-canvas');
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let animFrame;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createNodes() {
        nodes = [];
        const count = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < count; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.4 + 0.1
            });
        }
    }

    function drawNetwork() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const alpha = (1 - dist / 150) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Draw nodes
        for (const node of nodes) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${node.opacity})`;
            ctx.fill();

            // Update position
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off edges
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        }

        animFrame = requestAnimationFrame(drawNetwork);
    }

    resizeCanvas();
    createNodes();
    drawNetwork();

    window.addEventListener('resize', () => {
        resizeCanvas();
        createNodes();
    });

    // === Floating Particles ===
    const particlesContainer = document.getElementById('particles-container');

    function createParticles() {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 6 + 6) + 's';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.width = particle.style.height = (Math.random() * 3 + 1) + 'px';
            if (Math.random() > 0.5) {
                particle.style.background = '#00ff88';
            }
            particlesContainer.appendChild(particle);
        }
    }
    createParticles();

    // === Navbar ===
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveNavLink();
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    [...mobileLinks].forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('.section');
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // === Scroll Reveal ===
    function initRevealAnimations() {
        const elements = document.querySelectorAll('.reveal-up');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, index * 80);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        elements.forEach(el => observer.observe(el));
    }

    // === Animated Counters ===
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observer.observe(c));
    }

    function animateCounter(el, target) {
        let current = 0;
        const step = target / 60;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 30);
    }

    // === 3D Tilt on Cards ===
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // === Firebase Integration ===
    const db = window.ahsDB;
    const messaging = window.ahsMessaging;
    const firebaseReady = typeof db !== 'undefined';

    // Helper: generate unique ID
    function genId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    // Helper: timeout wrapper for any promise
    function withTimeout(promise, ms) {
        return Promise.race([
            promise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
        ]);
    }

    // Helper: create notification in Firestore
    async function createNotification(title, message, type, relatedId, priority) {
        if (!firebaseReady) return;
        try {
            await withTimeout(db.collection('notifications').add({
                id: genId(),
                title: title,
                message: message,
                type: type,
                relatedId: relatedId || '',
                priority: priority || 'medium',
                read: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }), 8000);
        } catch (err) {
            console.error('Notification error:', err);
        }
    }

    // Helper: create activity log in Firestore
    async function createActivityLog(action, details, type) {
        if (!firebaseReady) return;
        try {
            await withTimeout(db.collection('activity_logs').add({
                id: genId(),
                action: action,
                details: details,
                type: type,
                source: 'website',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }), 8000);
        } catch (err) {
            console.error('Activity log error:', err);
        }
    }

    // Helper: save to Firestore with timeout
    async function saveToFirestore(collection, data) {
        if (!firebaseReady) return null;
        try {
            const docRef = await withTimeout(db.collection(collection).add(data), 8000);
            return docRef;
        } catch (err) {
            console.error('Firestore save error:', err);
            return null;
        }
    }

    // Helper: request push notification permission
    async function requestPushPermission() {
        if (!messaging) return;
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                const token = await messaging.getToken();
                console.log('FCM Token:', token);
            }
        } catch (err) {
            console.log('Push permission skipped:', err);
        }
    }

    // Request push permission after 5 seconds
    setTimeout(requestPushPermission, 5000);

    // === Form Handling ===
    function handleFormSubmit(formId, successMsg) {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            try {
                if (formId === 'audit-form') {
                    const leadData = {
                        id: genId(),
                        name: data.name || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        company: data.company || '',
                        industry: data.industry || '',
                        challenges: data.challenges || '',
                        services: formData.getAll('services') || [],
                        status: 'new',
                        source: 'website',
                        formType: 'audit',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    };

                    const docRef = await saveToFirestore('leads', leadData);
                    if (docRef) {
                        createNotification('New Lead Received', 'Website audit request submitted by ' + (data.name || 'Unknown') + ' from ' + (data.company || 'Unknown company'), 'Lead', docRef.id, 'high');
                        createActivityLog('Lead Created', data.name + ' (' + data.company + ') submitted an AI audit request', 'lead');
                    }

                } else if (formId === 'contact-form') {
                    const leadData = {
                        id: genId(),
                        name: data.name || '',
                        email: data.email || '',
                        phone: '',
                        company: '',
                        subject: data.subject || '',
                        message: data.message || '',
                        status: 'new',
                        source: 'website',
                        formType: 'contact',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    };

                    const docRef = await saveToFirestore('leads', leadData);
                    if (docRef) {
                        createNotification('New Lead Received', 'Website contact form submitted by ' + (data.name || 'Unknown'), 'Lead', docRef.id, 'high');
                        createActivityLog('Lead Created', data.name + ' sent a contact message: ' + (data.subject || 'No subject'), 'lead');
                    }
                }

                btn.innerHTML = '<span>Sent!</span><i class="fas fa-check"></i>';
                showToast(successMsg);
                form.reset();

                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                }, 2000);

            } catch (err) {
                console.error('Form submission error:', err);
                btn.innerHTML = '<span>Error</span><i class="fas fa-exclamation-triangle"></i>';
                showToast('Something went wrong. Please try again.');
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                }, 3000);
            }
        });
    }

    handleFormSubmit('audit-form', 'Audit request submitted! We\'ll contact you within 24 hours.');
    handleFormSubmit('contact-form', 'Message sent! We\'ll get back to you soon.');

    // === Toast Notification ===
    function showToast(msg) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    }

    // === AI Widget ===
    const widgetBtn = document.getElementById('ai-widget-btn');
    const widgetChat = document.getElementById('ai-widget-chat');
    const widgetClose = document.getElementById('aiw-close');
    const widgetInput = document.getElementById('aiw-input');
    const widgetSend = document.getElementById('aiw-send');
    const widgetMessages = document.getElementById('aiw-messages');
    const quickBtns = document.querySelectorAll('.aiw-quick');

    widgetBtn.addEventListener('click', () => {
        widgetChat.classList.toggle('active');
        if (widgetChat.classList.contains('active')) {
            widgetInput.focus();
        }
    });

    widgetClose.addEventListener('click', () => {
        widgetChat.classList.remove('active');
    });

    function addBotMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'aiw-msg bot';
        msg.innerHTML = `<p>${text}</p>`;
        widgetMessages.appendChild(msg);
        widgetMessages.scrollTop = widgetMessages.scrollHeight;
    }

    function addUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'aiw-msg user';
        msg.innerHTML = `<p>${text}</p>`;
        widgetMessages.appendChild(msg);
        widgetMessages.scrollTop = widgetMessages.scrollHeight;
    }

    const aiResponses = {
        'services': 'We offer AI & Automation, Software Development, Web Development, Mobile Apps, API Integration, UI/UX Design, Cloud Solutions, Business Solutions, and 24/7 Support. Which one interests you?',
        'meeting': 'Great! You can book a free 30-minute strategy call at <a href="#booking" style="color:#00d4ff;text-decoration:underline;">our booking page</a>. Pick a time that works for you!',
        'pricing': 'Our pricing is project-based and tailored to your needs. For an accurate quote, fill out our <a href="#audit" style="color:#00d4ff;text-decoration:underline;">AI Audit form</a> or book a free consultation.',
        'ai': 'Our AI solutions include intelligent chatbots, predictive analytics, process automation, computer vision, and custom ML models. Want a free AI audit for your business?',
        'contact': 'You can reach us at:<br>Phone: <a href="tel:+919940918442" style="color:#00d4ff">+91 9940918442</a><br>Email: <a href="mailto:usrinivasan240@gmail.com" style="color:#00d4ff">usrinivasan240@gmail.com</a><br>Location: Trichy, Tamil Nadu',
        'location': 'We\'re based in Trichy, Tamil Nadu, India. We serve clients globally across multiple industries.',
        'hello': 'Hello! Welcome to AHS. How can I help you today? I can tell you about our services, help book a strategy call, or answer any questions.',
        'hi': 'Hi there! I\'m the AHS AI Assistant. How can I assist you today?',
        'audit': 'Our free AI Audit analyzes your current systems and identifies automation opportunities. Fill out the form at <a href="#audit" style="color:#00d4ff;text-decoration:underline;">our audit page</a> to get started!',
        'default': 'Thanks for your interest! I can help with information about our services, pricing, or booking a strategy call. You can also reach us directly at +91 9940918442 or usrinivasan240@gmail.com.'
    };

    function getAIResponse(input) {
        const lower = input.toLowerCase();
        if (lower.includes('service') || lower.includes('what do you do')) return aiResponses.services;
        if (lower.includes('meet') || lower.includes('book') || lower.includes('schedule') || lower.includes('call')) return aiResponses.meeting;
        if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('quote')) return aiResponses.pricing;
        if (lower.includes('ai') || lower.includes('automat') || lower.includes('machine learning') || lower.includes('chatbot')) return aiResponses.ai;
        if (lower.includes('contact') || lower.includes('phone') || lower.includes('email') || lower.includes('reach')) return aiResponses.contact;
        if (lower.includes('location') || lower.includes('where') || lower.includes('address') || lower.includes('trichy')) return aiResponses.location;
        if (lower.includes('hello') || lower.includes('hey') || lower.includes('good morning') || lower.includes('good evening')) return aiResponses.hello;
        if (lower.includes('hi') || lower.includes('hii') || lower.includes('helo')) return aiResponses.hi;
        if (lower.includes('audit') || lower.includes('assess') || lower.includes('review')) return aiResponses.audit;
        return aiResponses.default;
    }

    function processMessage() {
        const text = widgetInput.value.trim();
        if (!text) return;

        addUserMessage(text);
        widgetInput.value = '';

        setTimeout(() => {
            addBotMessage(getAIResponse(text));
        }, 600);
    }

    widgetSend.addEventListener('click', processMessage);
    widgetInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') processMessage();
    });

    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const msg = btn.dataset.msg;
            addUserMessage(msg);
            setTimeout(() => {
                addBotMessage(getAIResponse(msg));
            }, 600);
        });
    });

    // === Smooth Scroll for Anchor Links ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
