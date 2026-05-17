import { initGalaxy } from './components/galaxy.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. INICIALIZA O FUNDO GALÁCTICO
    initGalaxy();

    // ==========================================
    // 2. NAVEGAÇÃO DE MENUS (SPA)
    // ==========================================
    const menuBtns = document.querySelectorAll('.menu-btn');
    const views = document.querySelectorAll('.view');

    menuBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            menuBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            views.forEach(v => v.classList.remove('active'));
            
            const targetId = e.currentTarget.getAttribute('data-target') + '-view';
            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.classList.add('active');
            }
        });
    });

    // ==========================================
    // 3. MOTOR DO PLAYER DE ÁUDIO/VÍDEO
    // ==========================================
    const audio = new Audio();
    let isPlaying = false;
    
    const playBtn = document.getElementById('btn-play');
    const playIcon = playBtn ? playBtn.querySelector('.material-icons-round') : null;
    const coverImage = document.getElementById('current-cover');
    const titleDisplay = document.getElementById('track-title');
    const artistDisplay = document.getElementById('track-artist');
    
    const videoModal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('main-video-player');
    const btnCloseVideo = document.getElementById('close-video-btn');
    const videoTitleDisplay = document.getElementById('video-title-display');

    const playerEngine = {
        playMedia: function(media) {
            if (media.type === 'video') {
                audio.pause();
                if(playIcon) playIcon.textContent = 'play_arrow';
                if(coverImage) coverImage.classList.remove('playing');
                
                if(videoPlayer) videoPlayer.src = media.src;
                if(videoTitleDisplay) videoTitleDisplay.textContent = `${media.title} - ${media.artist}`;
                if(videoModal) videoModal.classList.remove('hidden');
                if(videoPlayer) videoPlayer.play();
            } else {
                audio.src = media.src;
                if(titleDisplay) titleDisplay.textContent = media.title;
                if(artistDisplay) artistDisplay.textContent = media.artist;
                
                if(coverImage) {
                    const imgSrc = media.cover || 'https://via.placeholder.com/150/111111/bc13fe?text=Música';
                    coverImage.innerHTML = `<img src="${imgSrc}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
                }

                audio.play();
                if(playIcon) playIcon.textContent = 'pause';
                if(coverImage) coverImage.classList.add('playing');
                isPlaying = true;
            }
        }
    };

    if (btnCloseVideo && videoPlayer && videoModal) {
        btnCloseVideo.addEventListener('click', () => {
            videoPlayer.pause();
            videoPlayer.src = "";
            videoModal.classList.add('hidden');
        });
    }

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if(!audio.src) return;
            
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

    // ==========================================
    // 4. SISTEMA DE PLAYLIST E BOTÃO SALVAR
    // ==========================================
    const btnSave = document.getElementById('id-do-seu-botao-salvar');
    const playlistContainer = document.querySelector('.playlist-container');
    const emptyState = document.querySelector('.empty-state');
    
    let myPlaylist = JSON.parse(localStorage.getItem('gmusic_playlist')) || [];

    function renderPlaylist() {
        if(!playlistContainer) return;

        const items = playlistContainer.querySelectorAll('.playlist-item');
        items.forEach(item => item.remove());

        if (myPlaylist.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        myPlaylist.forEach((media, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'playlist-item glass-panel';
            itemDiv.style.display = 'flex';
            itemDiv.style.alignItems = 'center';
            itemDiv.style.justifyContent = 'space-between';
            itemDiv.style.padding = '10px';
            itemDiv.style.marginTop = '10px';
            itemDiv.style.borderRadius = '8px';

            itemDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${media.cover || ''}" onerror="this.src='https://via.placeholder.com/150/111111/bc13fe?text=Música'" alt="Capa" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;">
                    <div class="info">
                        <strong style="color: #fff;">${media.title}</strong>
                        <div style="color: var(--text-secondary); font-size: 0.8rem;">${media.artist}</div>
                    </div>
                </div>
                <div class="actions">
                    <button class="icon-btn play-item-btn" data-index="${index}"><span class="material-icons-round">play_arrow</span></button>
                    <button class="icon-btn delete-item-btn" data-index="${index}"><span class="material-icons-round" style="color: #ff3366;">delete</span></button>
                </div>
            `;
            playlistContainer.appendChild(itemDiv);
        });

        document.querySelectorAll('.play-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                playerEngine.playMedia(myPlaylist[index]);
            });
        });

        document.querySelectorAll('.delete-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                myPlaylist.splice(index, 1);
                localStorage.setItem('gmusic_playlist', JSON.stringify(myPlaylist));
                renderPlaylist();
            });
        });
    }

    function convertDriveLink(url) {
        if (!url) return null;
        const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
            return `https://drive.google.com/uc?export=download&id=${match[1]}`;
        }
        return url; 
    }

    if (btnSave) {
        btnSave.addEventListener('click', (e) => {
            // TRAVA A PÁGINA PARA NÃO RECARREGAR
            e.preventDefault(); 

            const driveLink = document.getElementById('id-do-input-audio-drive').value;
            const coverLink = document.getElementById('link-capa-drive').value;
            const title = document.getElementById('id-do-input-titulo').value || 'Música Desconhecida';
            const artist = document.getElementById('id-do-input-artista').value || 'Artista Desconhecido';

            if (!driveLink) {
                alert("Adicione o link do Google Drive do áudio!");
                return;
            }

            const finalSrc = convertDriveLink(driveLink);

            const newMedia = {
                id: Date.now(),
                src: finalSrc,
                title: title,
                artist: artist,
                type: 'audio',
                cover: coverLink 
            };

            // Futuramente você pode conectar essa etapa com a Base44 ou Firebase
            myPlaylist.push(newMedia);
            localStorage.setItem('gmusic_playlist', JSON.stringify(myPlaylist));
            
            document.getElementById('id-do-input-audio-drive').value = '';
            document.getElementById('link-capa-drive').value = '';
            document.getElementById('id-do-input-titulo').value = '';
            document.getElementById('id-do-input-artista').value = '';
            
            alert("Música adicionada com sucesso à sua Playlist!");
            
            renderPlaylist();
        });
    }

    renderPlaylist();
});
