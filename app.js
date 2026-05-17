import { initGalaxy } from './components/galaxy.js';
import { initPlayer } from './components/player.js';
import { initPlaylist } from './components/playlist.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa Fundo Galáctico
    initGalaxy();

    // 2. Inicializa o Player
    const playerEngine = initPlayer();

    // 3. Inicializa a Playlist
    initPlaylist(playerEngine);

    // 4. SISTEMA DE MENUS (CORRIGIDO E FUNCIONAL)
    const menuBtns = document.querySelectorAll('.menu-btn');
    const views = document.querySelectorAll('.view');

    menuBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove a classe active de todos os botões
            menuBtns.forEach(b => b.classList.remove('active'));
            // Adiciona a classe active no botão clicado
            e.currentTarget.classList.add('active');
            
            // Esconde todas as telas
            views.forEach(v => v.classList.remove('active'));
            
            // Pega o alvo e mostra a tela correta
            const targetId = e.currentTarget.getAttribute('data-target') + '-view';
            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.classList.add('active');
            }
        });
    });
});
