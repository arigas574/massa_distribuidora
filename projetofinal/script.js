document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('#main-nav a, #mobile-nav-menu a');
    const mainHeader = document.getElementById('main-header');
    const modalContato = document.getElementById('modal-contato');
    const contatoButton = document.getElementById('btn-contato');
    const contatoButtonMobile = document.getElementById('btn-contato-mobile');
    const searchInput = document.getElementById('search-input');
    const categoryFilterButtons = document.querySelectorAll('.category-filter-btn');
    let currentCategory = 'all';
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');

    function navigateTo(sectionId) {
        if (mobileNavMenu.style.display === 'flex') {
            mobileNavMenu.style.display = 'none';
        }
        
        sections.forEach(section => {
            section.classList.add('hidden');
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
            }
        }
         window.scrollTo(0, 0);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const sectionId = this.dataset.section;
            navigateTo(sectionId);
            history.pushState({section: sectionId}, '', `#${sectionId}`);
        });
    });
    
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.section) {
            navigateTo(event.state.section);
        } else {
            navigateTo('produtos');
        }
    });

    function initialNavigation() {
        const hash = window.location.hash.substring(1);
        const sectionToShow = hash || 'produtos';
        navigateTo(sectionToShow);
        history.replaceState({section: sectionToShow}, '', `#${sectionToShow}`);
    }


    if (mainHeader) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
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

    [contatoButton, contatoButtonMobile].forEach(btn => {
        if(btn) {
            btn.addEventListener('click', () => abrirModal(modalContato));
        }
    });

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
            const matchesCategory = (currentCategory === 'all' || productCategory === currentCategory);
            const matchesSearch = (!searchTerm || (tituloProduto && tituloProduto.includes(searchTerm)));
            
            if (matchesCategory && matchesSearch) {
                card.style.display = "flex";
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

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            const isVisible = mobileNavMenu.style.display === 'flex';
            mobileNavMenu.style.display = isVisible ? 'none' : 'flex';
        });
    }

    initialNavigation();
    filtrarProdutosPorCategoriaETexto();
});