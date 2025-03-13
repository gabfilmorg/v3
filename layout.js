// layout.js - Script para padronizar o layout em todas as páginas

// Função para inicializar a sidebar em todas as páginas
function initSidebar() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop();
    
    // Estrutura HTML padrão da sidebar
    const sidebarHTML = `
    <div class="sidebar">
        <div class="sidebar-logo">
            <div class="logo-icon">F</div>
            <div class="logo-text">filmORG</div>
        </div>
        
        <nav class="sidebar-menu">
            <a href="dashboard.html" class="menu-item ${pageName === 'dashboard.html' ? 'active' : ''}">
                <i class="menu-icon ri-dashboard-line"></i>
                <span class="menu-text">Dashboard</span>
            </a>
            <a href="projetos.html" class="menu-item ${pageName === 'projetos.html' || pageName === 'projeto-detalhes.html' ? 'active' : ''}">
                <i class="menu-icon ri-movie-line"></i>
                <span class="menu-text">Projetos</span>
            </a>
            <a href="roteiro.html" class="menu-item ${pageName === 'roteiro.html' || pageName === 'roteiro-editor.html' ? 'active' : ''}">
                <i class="menu-icon ri-draft-line"></i>
                <span class="menu-text">Roteiro</span>
            </a>
            <a href="equipe.html" class="menu-item ${pageName === 'equipe.html' ? 'active' : ''}">
                <i class="menu-icon ri-team-line"></i>
                <span class="menu-text">Equipe</span>
            </a>
            <a href="equipamentos.html" class="menu-item ${pageName === 'equipamentos.html' ? 'active' : ''}">
                <i class="menu-icon ri-camera-line"></i>
                <span class="menu-text">Equipamentos</span>
            </a>
            <a href="analytics.html" class="menu-item ${pageName === 'analytics.html' ? 'active' : ''}">
                <i class="menu-icon ri-bar-chart-line"></i>
                <span class="menu-text">Analytics</span>
            </a>
            <a href="agenda.html" class="menu-item ${pageName === 'agenda.html' ? 'active' : ''}">
                <i class="menu-icon ri-calendar-line"></i>
                <span class="menu-text">Agenda</span>
            </a>
            <a href="orcamento.html" class="menu-item ${pageName === 'orcamento.html' ? 'active' : ''}">
                <i class="menu-icon ri-money-dollar-circle-line"></i>
                <span class="menu-text">Orçamento</span>
            </a>
            <a href="configuracoes.html" class="menu-item ${pageName === 'configuracoes.html' ? 'active' : ''}" style="margin-top: auto;">
                <i class="menu-icon ri-settings-line"></i>
                <span class="menu-text">Configurações</span>
            </a>
        </nav>
    </div>
    <div class="sidebar-overlay"></div>
    `;
    
    // Inserir a sidebar no início do body
    const sidebarContainer = document.createElement('div');
    sidebarContainer.id = 'sidebar-container';
    sidebarContainer.innerHTML = sidebarHTML;
    
    // Remover qualquer sidebar existente
    const existingSidebar = document.querySelector('.sidebar');
    if (existingSidebar) {
        existingSidebar.parentNode.removeChild(existingSidebar);
    }
    
    const existingOverlay = document.querySelector('.sidebar-overlay');
    if (existingOverlay) {
        existingOverlay.parentNode.removeChild(existingOverlay);
    }
    
    // Adicionar a nova sidebar padronizada
    document.body.insertBefore(sidebarContainer, document.body.firstChild);
    
    // Configurar eventos para mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    function toggleSidebar() {
        sidebar.classList.toggle('show');
        if (overlay) {
            overlay.style.display = sidebar.classList.contains('show') ? 'block' : 'none';
        }
    }
    
    function closeSidebar() {
        sidebar.classList.remove('show');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
    
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }
    
    // Fechar sidebar ao clicar em um link do menu em mobile
    const menuLinks = document.querySelectorAll('.menu-item');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });
    
    // Ajustar sidebar ao redimensionar a janela
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });
}

// Função para criar botão de menu móvel
function createMobileMenuToggle() {
    // Verificar se já existe um botão
    if (document.querySelector('.menu-toggle')) return;
    
    // Criar o botão de menu
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="ri-menu-line"></i>';
    
    // Adicionar estilos inline
    menuToggle.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 990;
        background: rgba(26, 35, 126, 0.9);
        border: none;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        display: none;
    `;
    
    // Adicionar à página
    document.body.appendChild(menuToggle);
    
    // Mostrar o botão apenas em dispositivos móveis
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            menuToggle.style.display = 'flex';
        } else {
            menuToggle.style.display = 'none';
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
        }
    }
    
    // Verificar tamanho da tela inicialmente e ao redimensionar
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
}

// Inicializar o layout quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
}); 