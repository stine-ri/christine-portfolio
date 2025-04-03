// Safe DOM selection helper function
function selectElement(selector) {
    const el = document.querySelector(selector);
    if (!el) {
        console.warn(`Element not found: ${selector}`);
    }
    return el;
}

// DOM Elements
const successModal = document.getElementById('success-modal');
const contactForm = document.getElementById('contact-form');
const menuToggle = selectElement('.menu-toggle');
const downloadCvButton = document.querySelector('.download-cv');
const yearElement = document.getElementById('current-year');

// Mobile Menu Toggle
if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        const navLinks = selectElement('.nav-links');
        if (navLinks) {
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-times');
                icon.classList.toggle('fa-bars');
            }
        }
    });
}

// Close mobile menu when clicking a nav link
const navLinkItems = document.querySelectorAll('.nav-links a');
if (navLinkItems.length > 0) {
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            const nav = selectElement('.nav-links');
            const menuIcon = selectElement('.menu-toggle i');
            if (nav) nav.classList.remove('active');
            if (menuIcon) {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
    });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Testimonial Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.testimonial-dot');

if (slides.length > 0 && dots.length > 0) {
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
}

// Animated Counter for Stats
const statsSection = document.getElementById('stats');
if (statsSection) {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        const statsPosition = statsSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (statsPosition < screenPosition && statNumbers.length > 0) {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                const duration = 2000; 
                const step = target / (duration / 16); 
                
                let current = 0;
                const increment = () => {
                    current += step;
                    if (current < target) {
                        stat.textContent = Math.floor(current);
                        requestAnimationFrame(increment);
                    } else {
                        stat.textContent = target + '+';
                    }
                };
                
                increment();
            });
            
            window.removeEventListener('scroll', animateStats);
        }
    }
    window.addEventListener('scroll', animateStats);
}

// Projects Filter
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Contact Form Submission
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formStatus = document.getElementById('form-status');
        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const loadingIcon = submitBtn.querySelector('.loading-icon');

        // Reset and show loading state
        formStatus.style.display = 'none';
        formStatus.textContent = '';
        formStatus.className = 'form-status';
        submitBtn.disabled = true;
        btnText.style.opacity = '0';
        loadingIcon.style.display = 'block';

        try {
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };

            // Basic validation
            if (!formData.name || !formData.email || !formData.message) {
                throw new Error('Please fill in all required fields');
            }

            // Replace with your actual endpoint
            const response = await fetch('http://localhost:8000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to send message');
            }

            // Success case
            formStatus.textContent = 'Message sent successfully!';
            formStatus.className = 'form-status success';
            formStatus.style.display = 'block';
            this.reset();

            // Show success modal if exists
            if (successModal) {
                successModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }

        } catch (error) {
            // Error case
            formStatus.textContent = error.message;
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
            console.error('Submission error:', error);
            
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.opacity = '1';
            loadingIcon.style.display = 'none';
        }
    });
}

// Modal close handlers
const closeModalButtons = document.querySelectorAll('.close-modal, .close-modal-btn');
if (closeModalButtons.length > 0 && successModal) {
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            successModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Download CV button
if (downloadCvButton) {
    downloadCvButton.addEventListener('click', function(e) {
        e.preventDefault();
        const cvUrl = this.getAttribute('href');
        
        if (cvUrl) {
            const link = document.createElement('a');
            link.href = cvUrl;
            link.download = 'Christine_Nyambwari_CV.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log('CV downloaded!');
        }
    });
}

// Scroll Reveal Animation
function revealOnScroll() {
    const revealElements = document.querySelectorAll('.hero-content, .hero-image, .about-text, .about-image, .section-title, .skill-item, .service-card, .stat-item, .timeline-item, .project-card, .testimonial-slider, .contact-info, .contact-form');
    
    if (revealElements.length > 0) {
        revealElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
}

window.addEventListener('scroll', revealOnScroll);

// Initialize elements with hidden state
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.hero-content, .hero-image, .about-text, .about-image, .section-title, .skill-item, .service-card, .stat-item, .timeline-item, .project-card, .testimonial-slider, .contact-info, .contact-form');
    
    if (elementsToAnimate.length > 0) {
        elementsToAnimate.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        // Show hero section immediately
        const heroContent = selectElement('.hero-content');
        const heroImage = selectElement('.hero-image');
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }
        if (heroImage) {
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateY(0)';
        }
    }
});

// Active nav link on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
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
}

// Update copyright year automatically
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}