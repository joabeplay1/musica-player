import { initGalaxy } from './components/galaxy.js';
import { initPlayer } from './components/player.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa Fundo Galáctico e Player
    initGalaxy();
    initPlayer();

    // 2. Sistema de Menus (Navegação SPA Completa)
    const menuBtns = document.querySelectorAll('.menu-btn');
    const views = document.querySelectorAll('.view');

    menuBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove a luz/estado ativo de todos os botões do menu
            menuBtns.forEach(b => b.classList.remove('active'));
            
            // Adiciona a luz/estado ativo apenas no botão que foi clicado
            e.currentTarget.classList.add('active');
            
            // Esconde TODAS as telas
            views.forEach(v => v.classList.remove('active'));
            
            // Descobre qual tela abrir baseado no 'data-target' do botão
            const targetId = e.currentTarget.getAttribute('data-target') + '-view';
            
            // Mostra a tela correta disparando a animação do CSS
            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.classList.add('active');
            }
        });
    });
});
