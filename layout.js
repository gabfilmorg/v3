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
            <a href="projetos.html" class="menu-item ${pageName === 'projetos.html' ? 'active' : ''}">
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
            <a href="ai-assist.html" class="menu-item ${pageName === 'ai-assist.html' ? 'active' : ''}">
                <i class="menu-icon ri-robot-line"></i>
                <span class="menu-text">AI Assist</span>
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
    
    // Garantir que o conteúdo principal tenha a classe correta
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) {
        const newMainContent = document.createElement('div');
        newMainContent.className = 'main-content';
        
        // Mover todo o conteúdo do body (exceto a sidebar) para dentro do main-content
        Array.from(document.body.children).forEach(child => {
            if (child.id !== 'sidebar-container' && !child.classList.contains('sidebar-overlay')) {
                newMainContent.appendChild(child);
            }
        });
        
        document.body.appendChild(newMainContent);
    }
    
    // Criar botão de menu para mobile se não existir
    createMobileMenuToggle();
    
    // Adicionar eventos para dispositivos móveis
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    // Toggle da sidebar em dispositivos móveis
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            sidebarOverlay.classList.toggle('show');
        });
    }
    
    // Fechar a sidebar ao clicar no overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('show');
            sidebarOverlay.classList.remove('show');
        });
    }
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