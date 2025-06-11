// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline, .btn-login, .btn-signin');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in animation to sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transition = 'opacity 0.5s ease-in-out';
        observer.observe(section);
    });

    // Handle navigation menu for mobile
    const createMobileMenu = () => {
        const nav = document.querySelector('.main-nav');
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        nav.insertBefore(mobileMenuBtn, nav.firstChild);

        mobileMenuBtn.addEventListener('click', () => {
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.toggle('show');
            mobileMenuBtn.classList.toggle('active');
        });
    };

    // Only create mobile menu if screen width is below 768px
    if (window.innerWidth < 768) {
        createMobileMenu();
    }

    // Handle window resize
    let timeout = false;
    window.addEventListener('resize', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const mobileMenu = document.querySelector('.mobile-menu-btn');
            if (window.innerWidth < 768 && !mobileMenu) {
                createMobileMenu();
            } else if (window.innerWidth >= 768 && mobileMenu) {
                mobileMenu.remove();
                document.querySelector('.nav-links').classList.remove('show');
            }
        }, 250);
    });

    // Add CSS for mobile menu button and navigation
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu-btn {
            display: none;
            flex-direction: column;
            justify-content: space-between;
            width: 30px;
            height: 20px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
        }

        .mobile-menu-btn span {
            width: 100%;
            height: 2px;
            background-color: var(--text-color);
            transition: var(--transition);
        }

        .mobile-menu-btn.active span:nth-child(1) {
            transform: translateY(9px) rotate(45deg);
        }

        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }

        .mobile-menu-btn.active span:nth-child(3) {
            transform: translateY(-9px) rotate(-45deg);
        }

        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: flex;
            }

            .nav-links {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--white);
                padding: 1rem;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
                display: none;
                box-shadow: var(--shadow);
            }

            .nav-links.show {
                display: flex;
            }
        }

        .fade-in {
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);
}); 