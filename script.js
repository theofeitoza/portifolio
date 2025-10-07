document.addEventListener('DOMContentLoaded', () => {

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
            if (index >= images.length) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = images.length - 1;
            } else {
                currentIndex = index;
            }
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

        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));

        const closeModal = () => modal.classList.remove('show');

        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
        });
    }
});