import { initGalaxy } from './components/galaxy.js';
// Importe os módulos do firebase quando estiverem configurados:
// import { db, storage } from './firebase/firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa Fundo Galáctico
    initGalaxy();

    // 2. Sistema de Menus (Navegação SPA)
    const menuBtns = document.querySelectorAll('.menu-btn');
    menuBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            menuBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            // Lógica para alternar seções (ocultar views ativas e mostrar a nova)
            const target = e.currentTarget.getAttribute('data-target');
            console.log(`Navegando para: ${target}`);
            // Exemplo: document.querySelector('.view.active').classList.remove('active');
            // document.getElementById(`${target}-view`).classList.add('active');
        });
    });

    // 3. Player Base
    const audio = new Audio();
    let isPlaying = false;
    
    const playBtn = document.getElementById('btn-play');
    const playIcon = playBtn.querySelector('.material-icons-round');
    const coverImage = document.getElementById('current-cover');
    const progressBar = document.getElementById('progress-bar');
    
    playBtn.addEventListener('click', () => {
        if(isPlaying) {
            audio.pause();
            playIcon.textContent = 'play_arrow';
            coverImage.classList.remove('playing');
        } else {
            // áudio fictício para teste se não houver src
            if(!audio.src) audio.src = 'assets/music/sample.mp3'; 
            // audio.play(); // Descomente ao adicionar música real
            playIcon.textContent = 'pause';
            coverImage.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });

    // 4. Controle de Volume
    const volumeBar = document.getElementById('volume-bar');
    volumeBar.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });
    
    // Atualização da barra de progresso
    audio.addEventListener('timeupdate', () => {
        if(audio.duration){
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.value = progressPercent;
            // Atualizar spans de tempo (time-current e time-total) aqui
        }
    });

    progressBar.addEventListener('input', (e) => {
        const seekTime = (e.target.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    });
});
