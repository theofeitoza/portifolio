document.addEventListener('DOMContentLoaded', () => {

    // --- NÍVEL 1: INDICAÇÃO DE PÁGINA ATIVA NO MENU ---
    const currentPagePath = window.location.pathname.split("/").pop();
    const navLinksList = document.querySelectorAll('#navbar-links a');
    navLinksList.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPagePath || (currentPagePath === '' && linkPath === 'index.html')) {
            link.classList.add('active-page');
        }
    });

    // --- NÍVEL 1: BOTÃO "VOLTAR AO TOPO" ---
    const backToTopButton = document.getElementById('back-to-top-btn');
    if (backToTopButton) {
        window.onscroll = () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                backToTopButton.style.display = "block";
            } else {
                backToTopButton.style.display = "none";
            }
        };
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- NÍVEL 1: VALIDAÇÃO DO FORMULÁRIO DE CONTATO ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const validateEmail = () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value) && emailInput.value !== '') {
                emailError.textContent = 'Por favor, insira um formato de e-mail válido.';
                emailInput.classList.add('invalid');
                return false;
            } else {
                emailError.textContent = '';
                emailInput.classList.remove('invalid');
                return true;
            }
        };
        emailInput.addEventListener('input', validateEmail);
        contactForm.addEventListener('submit', (e) => {
            if (!validateEmail()) {
                e.preventDefault();
                alert('Por favor, corrija os erros no formulário antes de enviar.');
            }
        });
    }

    // --- LÓGICA PARA O MENU HAMBÚRGUER ---
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('navbar-links');
    if (hamburger && navLinks) {
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
        const closeMenu = () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            overlay.classList.remove('active');
        };
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            overlay.classList.toggle('active');
        });
        overlay.addEventListener('click', closeMenu);
        
        // LÓGICA DE CLIQUE COM DIAGNÓSTICO
        navLinks.addEventListener('click', (e) => {
            console.log("1. Evento de clique no container dos links foi detectado.");

            const link = e.target.closest('a');
            if (!link) {
                console.log("O clique não foi em um link. Ignorando.");
                return;
            }

            console.log("2. Clique foi em um link:", link.href);
            e.preventDefault();
            const destination = link.href;
            
            console.log("3. Função closeMenu() será chamada.");
            closeMenu();
            
            console.log("4. Agendando redirecionamento para", destination, "em 400ms.");
            setTimeout(() => {
                console.log("5. Tempo esgotado! Redirecionando agora...");
                window.location.href = destination;
            }, 400); 
        });
    }

    // --- LÓGICA PARA FILTRAGEM DE PROJETOS ---
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    const projectCards = document.querySelectorAll('#project-grid .repo-card-link');
    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.getAttribute('data-filter');
                projectCards.forEach(card => {
                    const tags = card.getAttribute('data-tags');
                    if (filter !== 'all' && !tags.includes(filter)) {
                        card.classList.add('hide');
                        setTimeout(() => {
                            if (card.classList.contains('hide')) card.style.display = 'none';
                        }, 400);
                    } else {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.classList.remove('hide');
                        }, 10);
                    }
                });
            });
        });
    }

    // --- LÓGICA PARA O MODAL COM GALERIA ---
    const modal = document.getElementById('project-modal');
    if (modal) {
        const modalClose = document.querySelector('.modal-close');
        const projectGrid = document.getElementById('project-grid');
        const modalTitle = document.getElementById('modal-title');
        const galleryImagesContainer = document.querySelector('.modal-gallery-images');
        const modalDesc = document.getElementById('modal-desc');
        const modalLink = document.getElementById('modal-link');
        const prevBtn = document.querySelector('.modal-gallery-prev');
        const nextBtn = document.querySelector('.modal-gallery-next');
        let currentImages = [];
        let currentIndex = 0;
        function showImage(index) {
            const images = galleryImagesContainer.querySelectorAll('img');
            if (images.length === 0) return;
            if (index >= images.length) { currentIndex = 0; } 
            else if (index < 0) { currentIndex = images.length - 1; } 
            else { currentIndex = index; }
            images.forEach(img => img.classList.remove('active'));
            images[currentIndex].classList.add('active');
        }
        projectGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.repo-card-link');
            if (card) {
                galleryImagesContainer.innerHTML = '';
                currentImages = card.dataset.images.split(',');
                currentImages.forEach(imgUrl => {
                    const img = document.createElement('img');
                    img.src = imgUrl.trim();
                    galleryImagesContainer.appendChild(img);
                });
                modalTitle.textContent = card.dataset.title;
                modalDesc.textContent = card.dataset.descLong;
                modalLink.href = card.dataset.ghLink;
                showImage(0);
                modal.classList.add('show');
            }
        });
        const closeModal = () => modal.classList.remove('show');
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });
    }
});