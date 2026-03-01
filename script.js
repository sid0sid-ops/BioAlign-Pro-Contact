// Theme Toggle Logic
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
    drawBackground(); // Update canvas colors if needed
}

function updateThemeIcon(isDark) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
}

// Background Animation (Simplified version for contact page)
function drawBackground() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Set proper size
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Basic particle animation
    const particles = [];
    const isDark = document.documentElement.classList.contains('dark');
    const color = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';

    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedY: Math.random() * 0.5 + 0.1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = color;

        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            p.y -= p.speedY;
            if (p.y < 0) {
                p.y = canvas.height;
                p.x = Math.random() * canvas.width;
            }
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    const isDark = document.documentElement.classList.contains('dark');
    updateThemeIcon(isDark);
    drawBackground();

    // Form Handling - Asynchronous Apps Script Web App "Silent" Logic
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = document.getElementById('submitBtn');
            const btnText = document.getElementById('btnText');
            const statusDiv = document.getElementById('formStatus');

            // Disable button & show loading state
            btn.disabled = true;
            btnText.innerHTML = 'Sending...';
            statusDiv.classList.add('hidden');

            // Collect Data and handle JSON mapping as Apps Script handles it robustly
            const formData = new FormData(contactForm);

            // The Apps Script JSON Endpoint
            const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzgccTbmSWWE0p49Hkc_Duy34z9u32W3kvDPOrMlN0m_2ypCrlfD_18Qpcxmu_FO5uW/exec";

            try {
                // Convert FormData to a standard JSON object mapping our name attributes
                const dataPayload = Object.fromEntries(formData);

                // The Silent Logic: Using mode 'no-cors' allows us to send a POST request
                // bypassing CORS restrictions from a static site. We can't read the response,
                // but we know it gets sent.
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: JSON.stringify(dataPayload)
                });

                // On success (or at least dispatch completion)
                contactForm.reset();
                showStatus(statusDiv, 'success', 'Your message has been sent successfully. We will get back to you soon!');

            } catch (error) {
                console.error("Error submitting form:", error);

                // For no-cors, exceptions are rare unless there is a complete network interruption,
                // making it effectively "Silent".
                showStatus(statusDiv, 'error', 'An error occurred while sending your message. Please verify your connection.');
            } finally {
                // Reset button
                btn.disabled = false;
                btnText.textContent = 'Send Message';
            }
        });
    }
});

function showStatus(element, type, message) {
    element.textContent = '';

    // Clear previous classes
    element.className = 'mt-6 p-4 rounded-xl text-sm font-medium animate-fade-in block border';

    if (type === 'success') {
        element.classList.add('bg-emerald-500/10', 'text-emerald-700', 'dark:text-emerald-400', 'border-emerald-500/20');
        element.innerHTML = '<i class="fa-solid fa-check-circle mr-2"></i> ' + message;
    } else {
        element.classList.add('bg-destructive/10', 'text-destructive', 'border-destructive/20');
        element.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-2"></i> ' + message;
    }
}
