export function initPlayer() {
    const audio = new Audio();
    let isPlaying = false;
    
    // Controles de Áudio
    const playBtn = document.getElementById('btn-play');
    const playIcon = playBtn ? playBtn.querySelector('.material-icons-round') : null;
    const coverImage = document.getElementById('current-cover');
    const titleDisplay = document.getElementById('track-title');
    const artistDisplay = document.getElementById('track-artist');
    
    // Controles de Vídeo
    const videoModal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('main-video-player');
    const btnCloseVideo = document.getElementById('close-video-btn');
    const videoTitleDisplay = document.getElementById('video-title-display');

    // Motor do Player (Exposto para a playlist usar)
    const playerEngine = {
        playMedia: function(media) {
            if (media.type === 'video') {
                // Pausa o áudio se estiver tocando
                audio.pause();
                if(playIcon) playIcon.textContent = 'play_arrow';
                if(coverImage) coverImage.classList.remove('playing');
                
                // Configura e abre o Vídeo
                videoPlayer.src = media.src;
                videoTitleDisplay.textContent = `${media.title} - ${media.artist}`;
                videoModal.classList.remove('hidden');
                videoPlayer.play();
            } else {
                // Configura e toca o Áudio
                audio.src = media.src;
                if(titleDisplay) titleDisplay.textContent = media.title;
                if(artistDisplay) artistDisplay.textContent = media.artist;
                
                // Se tiver capa customizada, atualiza
                if(coverImage && media.cover) {
                    coverImage.innerHTML = `<img src="${media.cover}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
                }

                audio.play();
                if(playIcon) playIcon.textContent = 'pause';
                if(coverImage) coverImage.classList.add('playing');
                isPlaying = true;
            }
        }
    };

    // Fechar Modal de Vídeo
    if (btnCloseVideo) {
        btnCloseVideo.addEventListener('click', () => {
            videoPlayer.pause();
            videoPlayer.src = "";
            videoModal.classList.add('hidden');
        });
    }

    // Botão de Play/Pause Principal (Barra Inferior)
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if(!audio.src) return; // Não faz nada se não tiver música
            
            if(isPlaying) {
                audio.pause();
                playIcon.textContent = 'play_arrow';
                coverImage.classList.remove('playing');
            } else {
                audio.play();
                playIcon.textContent = 'pause';
                coverImage.classList.add('playing');
            }
            isPlaying = !isPlaying;
        });
    }

    // Barra de Progresso e Volume (Mantém igual o seu anterior)
    const progressBar = document.getElementById('progress-bar');
    const volumeBar = document.getElementById('volume-bar');
    
    if(volumeBar) {
        volumeBar.addEventListener('input', (e) => { audio.volume = e.target.value / 100; });
    }
    
    if(progressBar) {
        audio.addEventListener('timeupdate', () => {
            if(audio.duration) progressBar.value = (audio.currentTime / audio.duration) * 100;
        });
        progressBar.addEventListener('input', (e) => {
            audio.currentTime = (e.target.value / 100) * audio.duration;
        });
    }

    return playerEngine; // Retorna o motor para a playlist
}
