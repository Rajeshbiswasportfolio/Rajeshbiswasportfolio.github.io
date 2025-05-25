document.addEventListener('DOMContentLoaded', () => {

    // --- Debounce function for performance optimization of scroll/resize events ---
    function debounce(func, wait = 15, immediate = false) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // --- Sticky Header ---
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', debounce(() => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, 10));
    }

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // --- Smooth Scrolling & Active Link Highlighting ---
    const scrollLinks = document.querySelectorAll('.scroll-link');
    const sections = document.querySelectorAll('section[id]');

    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                let offsetTop = targetElement.offsetTop;
                // Adjust for sticky header height, but not for hero link
                if (header && targetId !== '#hero') {
                     offsetTop -= header.offsetHeight;
                }

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // If it's a nav link in the mobile menu, close the menu
                if (navMenu && navMenu.classList.contains('active') && link.classList.contains('nav-link')) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            }
        });
    });

     function navHighlighter() {
        let scrollY = window.pageYOffset;
        let headerOffset = header ? header.offsetHeight + 5 : 5; // Small buffer

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            // Adjust sectionTop to be the actual top of the section minus header height
            let sectionTop = current.offsetTop - headerOffset;
            const sectionId = current.getAttribute('id');

            const navLinkForSection = document.querySelector('.nav-menu a[href*=\\#' + sectionId + ']');

            if (navLinkForSection) {
                 // Check if scrollY is within the section bounds
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight - headerOffset) {
                    navLinks.forEach(nav => {
                        nav.classList.remove('active');
                        nav.removeAttribute('aria-current');
                    });
                    navLinkForSection.classList.add('active');
                    navLinkForSection.setAttribute('aria-current', 'page');
                }
            }
        });

        // Special case for hero section (top of the page)
        // If scrollY is less than the top of the first *actual* section (e.g., 'about')
        const firstContentSection = sections[0]; // Assuming 'hero' is not in this NodeList
        if (firstContentSection) {
            let firstSectionTop = firstContentSection.offsetTop - headerOffset;
            if (scrollY < firstSectionTop) {
                navLinks.forEach(nav => {
                    nav.classList.remove('active');
                    nav.removeAttribute('aria-current');
                });
                const homeLink = document.querySelector('.nav-menu a[href="#hero"]');
                if (homeLink) {
                    homeLink.classList.add('active');
                    homeLink.setAttribute('aria-current', 'page');
                }
            }
        }
     }
     window.addEventListener('scroll', debounce(navHighlighter, 50));
     navHighlighter(); // Initial call

    // --- Back to Top Button ---
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', debounce(() => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        }, 100));
    }

    // --- Scroll Animations ---
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
    };
    const displayScrollElement = (element) => { element.classList.add('visible'); };
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.15)) { // Element is 1.15 of viewport height from top
                displayScrollElement(el);
            }
        });
    };
    window.addEventListener('scroll', debounce(handleScrollAnimation, 50));
    handleScrollAnimation(); // Initial check

    // --- Footer Current Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Contact Form Submission (mailto) ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message'); // Corresponds to name="message_body"

            // Basic client-side validation check (though 'required' handles most)
            if (!nameInput.value || !emailInput.value || !subjectInput.value || !messageInput.value) {
                // Optionally, display an error message to the user
                alert('Please fill in all required fields.');
                return;
            }

            const name = nameInput.value;
            const email = emailInput.value;
            const subject = subjectInput.value;
            const message = messageInput.value;

            const mailtoRecipient = 'biswasrajesh773@gmail.com'; // The recipient email address

            // Construct the email body
            let emailBody = `Hello Rajesh,\n\n`;
            emailBody += `I am ${name}\n`;
            emailBody += `\n${message}`;

            // Encode components for the mailto URL
            const mailtoSubject = encodeURIComponent(subject);
            const mailtoBody = encodeURIComponent(emailBody);

            // Construct the mailto link
            const mailtoLink = `mailto:${mailtoRecipient}?subject=${mailtoSubject}&body=${mailtoBody}`;

            // Open the user's default email client
            window.location.href = mailtoLink;

            // Optionally, reset the form after a short delay
            setTimeout(() => {
                contactForm.reset();
            }, 500); // 0.5 seconds delay
        });
    }

    // --- Lightbox Gallery for Portfolio ---
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentImageIndex = 0;
    let imagesData = [];
    let lastFocusedElement;

    if (portfolioItems.length > 0 && lightboxModal && lightboxImage && lightboxCaption && lightboxClose && lightboxPrev && lightboxNext) {
        portfolioItems.forEach((item, index) => {
            const img = item.querySelector('img');
            const overlayText = item.querySelector('.overlay span');

            if (img) {
                imagesData.push({
                    src: img.src,
                    alt: img.alt,
                    caption: overlayText ? overlayText.textContent : img.alt
                });

                item.setAttribute('tabindex', '0');
                item.setAttribute('role', 'button');
                item.setAttribute('aria-label', `View image: ${imagesData[index].caption}`);

                item.addEventListener('click', () => openLightbox(index));
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightbox(index);
                    }
                });
            }
        });

        function openLightbox(index) {
            lastFocusedElement = document.activeElement;
            currentImageIndex = index;
            updateLightboxImage();
            lightboxModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            lightboxClose.focus();
        }

        function closeLightbox() {
            lightboxModal.style.display = 'none';
            document.body.style.overflow = '';
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        }

        function updateLightboxImage() {
            if (imagesData[currentImageIndex]) {
                lightboxImage.src = imagesData[currentImageIndex].src;
                lightboxImage.alt = imagesData[currentImageIndex].alt;
                lightboxCaption.textContent = imagesData[currentImageIndex].caption;
            }
            lightboxPrev.style.display = (currentImageIndex === 0) ? 'none' : 'block';
            lightboxNext.style.display = (currentImageIndex === imagesData.length - 1) ? 'none' : 'block';
        }

        function showPrevImage() {
            if (currentImageIndex > 0) {
                currentImageIndex--;
                updateLightboxImage();
                lightboxPrev.focus(); // Keep focus on the control if possible
            }
        }

        function showNextImage() {
            if (currentImageIndex < imagesData.length - 1) {
                currentImageIndex++;
                updateLightboxImage();
                lightboxNext.focus(); // Keep focus on the control if possible
            }
        }

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);

        document.addEventListener('keydown', (e) => {
            if (lightboxModal.style.display === 'block') {
                if (e.key === 'Escape') closeLightbox();
                else if (e.key === 'ArrowLeft') showPrevImage();
                else if (e.key === 'ArrowRight') showNextImage();
            }
        });

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) { // Click on backdrop
                closeLightbox();
            }
        });
    }
});