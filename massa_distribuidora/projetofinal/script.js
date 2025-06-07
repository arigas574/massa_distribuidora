document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('#main-header nav a');
    const contatoButton = document.getElementById('btn-contato');
    const mainHeader = document.getElementById('main-header');
    const modalContato = document.getElementById('modal-contato');
    const searchInput = document.getElementById('search-input');
    const categoryFilterButtons = document.querySelectorAll('.category-filter-btn');
    let currentCategory = 'all';
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    function navigateTo(sectionId) {
        sections.forEach(section => {
            section.classList.add('hidden');
            section.classList.remove('fade-in');
        });
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            void targetSection.offsetWidth;
            targetSection.classList.add('fade-in');
        } else {
            const defaultSection = document.getElementById('produtos');
            if (defaultSection) {
                defaultSection.classList.remove('hidden');
                void defaultSection.offsetWidth;
                defaultSection.classList.add('fade-in');
            }
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const sectionId = this.dataset.section;
            navigateTo(sectionId);
            try {
                history.pushState(null, null, '#' + sectionId);
            } catch (e) {
                window.location.hash = sectionId;
            }
        });
    });

    function initialNavigation() {
        const hash = window.location.hash.substring(1);
        const sectionToShow = hash || 'produtos';
        navigateTo(sectionToShow);
        if (sectionToShow === 'produtos') {
            document.querySelectorAll('.category-filter-btn').forEach(btn => btn.classList.remove('active'));
            const todosButton = document.querySelector('.category-filter-btn[data-category="all"]');
            if (todosButton) {
                todosButton.classList.add('active');
            }
            currentCategory = 'all';
            filtrarProdutosPorCategoriaETexto();
        }
    }

    window.addEventListener('hashchange', initialNavigation);

    if (mainHeader) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 60) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        });
    }

    function abrirModal(modal) {
        if (modal) {
            document.body.classList.add('modal-is-open');
            modal.classList.add('modal-open');
        }
    }

    function fecharModal(modal) {
        if (modal) {
            document.body.classList.remove('modal-is-open');
            modal.classList.remove('modal-open');
        }
    }

    if (contatoButton) {
        contatoButton.addEventListener('click', () => abrirModal(modalContato));
    }

    if (modalContato) {
        modalContato.addEventListener('click', function(event) {
            if (event.target === modalContato || event.target.closest('.modal-close-btn')) {
                fecharModal(modalContato);
            }
        });
    }

    function filtrarProdutosPorCategoriaETexto() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const productCards = document.querySelectorAll('#produtos-list .produto-item');
        productCards.forEach(card => {
            const productCategory = card.dataset.category;
            const tituloProduto = card.querySelector('.produto-titulo')?.textContent.toLowerCase();
            const descricaoProduto = card.querySelector('.produto-descricao-curta')?.textContent.toLowerCase();
            const matchesCategory = (currentCategory === 'all' || productCategory === currentCategory);
            const matchesSearch = (!searchTerm ||
                (tituloProduto && tituloProduto.includes(searchTerm)) ||
                (descricaoProduto && descricaoProduto.includes(searchTerm)));
            if (matchesCategory && matchesSearch) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    }

    categoryFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryFilterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            filtrarProdutosPorCategoriaETexto();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', filtrarProdutosPorCategoriaETexto);
    }

    document.querySelectorAll('.produto-imagem-container').forEach(container => {
        container.addEventListener('click', function(event) {
            event.stopPropagation();
            const image = container.querySelector('img');
            if (lightbox && lightboxImg && lightboxCaption && image) {
                lightbox.classList.add('show');
                lightboxImg.src = image.src;
                const card = image.closest('.produto-card');
                const titleElement = card ? card.querySelector('.produto-titulo') : null;
                lightboxCaption.textContent = titleElement ? titleElement.textContent : 'Imagem do Produto';
            }
        });
    });

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close-btn')) {
                lightbox.classList.remove('show');
            }
        });
    }

    const elementsToAnimate = document.querySelectorAll('.animate-scroll');
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-scroll');
                }
            });
        }, {
            threshold: 0.1
        });
        elementsToAnimate.forEach(el => observer.observe(el));
    } else {
        elementsToAnimate.forEach(el => el.classList.add('show-scroll'));
    }

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    initialNavigation();
});