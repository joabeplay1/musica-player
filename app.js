import { initGalaxy } from './components/galaxy.js';
import { initPlayer } from './components/player.js';
import { initPlaylist } from './components/playlist.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa Fundo Galáctico
    initGalaxy();

    // 2. Inicializa o Player e pega o "motor" dele
    const playerEngine = initPlayer();

    // 3. Inicializa a Playlist passando o motor do player
    initPlaylist(playerEngine);

    // 4. Sistema de Menus (Navegação SPA)
    const menuBtns = document.querySelectorAll('.menu-btn');
    const views = document.querySelectorAll('.view');

    menuBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            menuBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            views.forEach(v => v.classList.remove('active'));
            
            const targetId = e.currentTarget.getAttribute('data-target') + '-view';
            const targetView = document.getElementById(targetId);
            if (targetView) targetView.classList.add('active');
        });
    });
});
