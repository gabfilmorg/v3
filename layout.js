// Controle do Menu Lateral
class LayoutManager {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.overlay = document.querySelector('.mobile-overlay');
        this.menuToggle = this.createMenuToggle();
        this.init();
    }

    createMenuToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'menu-toggle';
        toggle.innerHTML = '<i class="ri-menu-line"></i>';
        const header = document.querySelector('.page-header');
        if (header) {
            header.insertBefore(toggle, header.firstChild);
        }
        return toggle;
    }

    toggleMenu() {
        this.sidebar.classList.toggle('show');
        this.overlay.classList.toggle('show');
        document.body.style.overflow = this.sidebar.classList.contains('show') ? 'hidden' : '';
    }

    checkScreenSize() {
        const isMobile = window.innerWidth <= 768;
        this.menuToggle.style.display = isMobile ? 'block' : 'none';
        if (!isMobile && this.sidebar.classList.contains('show')) {
            this.toggleMenu();
        }
    }

    handleResize() {
        let timeout;
        window.addEventListener('resize', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => this.checkScreenSize(), 100);
        });
    }

    markActiveMenuItem() {
        const currentPath = window.location.pathname;
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href && currentPath.includes(href)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    init() {
        // Adiciona overlay para mobile se não existir
        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'mobile-overlay';
            document.body.appendChild(this.overlay);
        }

        // Event listeners
        this.menuToggle.addEventListener('click', () => this.toggleMenu());
        this.overlay.addEventListener('click', () => this.toggleMenu());
        
        // Inicialização
        this.checkScreenSize();
        this.handleResize();
        this.markActiveMenuItem();
    }
}

// Inicializa o gerenciador de layout quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new LayoutManager();
}); 