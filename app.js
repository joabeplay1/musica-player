import { initGalaxy } from './components/galaxy.js';
import { initPlayer } from './components/player.js';
import { initPlaylist } from './components/playlist.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicia o Fundo
    initGalaxy();

    // 2. Inicia as ferramentas de Mídia
    const playerEngine = initPlayer();
    
    // O Try-Catch protege o site. Se a playlist falhar, o menu continua funcionando!
    try {
        initPlaylist(playerEngine);
    } catch (error) {
        console.error("Erro na Playlist, mas o App continua rodando:", error);
    }

    // 3. SISTEMA DE MENUS (À Prova de Falhas)
    const menuBtns = document.querySelectorAll('.menu-btn');
    const views = document.querySelectorAll('.view');

    menuBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove ativo de todos os botões
            menuBtns.forEach(b => b.classList.remove('active'));
            // Adiciona ativo no clicado
            e.currentTarget.classList.add('active');
            
            // Esconde todas as telas
            views.forEach(v => v.classList.remove('active'));
            
            // Exibe a tela alvo
            const targetId = e.currentTarget.getAttribute('data-target') + '-view';
            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.classList.add('active');
            }
        });
    });
});
