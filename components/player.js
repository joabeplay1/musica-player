export function initPlaylist(playerEngine) {
    const btnSave = document.getElementById('btn-save-media');
    const playlistContainer = document.getElementById('playlist-list');
    const emptyState = document.getElementById('playlist-empty');
    
    let myPlaylist = JSON.parse(localStorage.getItem('gmusic_playlist')) || [];

    function renderPlaylist() {
        const items = playlistContainer.querySelectorAll('.playlist-item');
        items.forEach(item => item.remove());

        if (myPlaylist.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        myPlaylist.forEach((media, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'playlist-item';
            itemDiv.innerHTML = `
                <img src="${media.cover || ''}" onerror="this.src='https://via.placeholder.com/150/111111/bc13fe?text=Música'" alt="Capa">
                <div class="info">
                    <strong>${media.title} <span class="media-type">${media.type.toUpperCase()}</span></strong>
                    <span>${media.artist}</span>
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
        btnSave.addEventListener('click', () => {
            const driveLink = document.getElementById('upload-drive').value;
            const localFile = document.getElementById('upload-local').files[0];
            const title = document.getElementById('upload-title').value || 'Mídia Desconhecida';
            const artist = document.getElementById('upload-artist').value || 'Artista Desconhecido';
            const type = document.getElementById('upload-type').value;
            const coverFile = document.getElementById('upload-cover').files[0];

            let finalSrc = '';

            if (driveLink) {
                finalSrc = convertDriveLink(driveLink);
            } else if (localFile) {
                finalSrc = URL.createObjectURL(localFile);
            } else {
                alert("Adicione um arquivo local ou um link do Google Drive!");
                return;
            }

            if (coverFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    saveToDatabase(finalSrc, title, artist, type, e.target.result);
                };
                reader.readAsDataURL(coverFile);
            } else {
                saveToDatabase(finalSrc, title, artist, type, null);
            }
        });
    }

    function saveToDatabase(src, title, artist, type, coverData) {
        const newMedia = {
            id: Date.now(),
            src: src,
            title: title,
            artist: artist,
            type: type,
            cover: coverData
        };

        myPlaylist.push(newMedia);
        localStorage.setItem('gmusic_playlist', JSON.stringify(myPlaylist));
        
        document.getElementById('upload-title').value = '';
        document.getElementById('upload-drive').value = '';
        document.getElementById('upload-artist').value = '';
        alert("Mídia adicionada com sucesso à sua Playlist!");
        
        renderPlaylist();
    }

    renderPlaylist();
}
export function initPlayer() {
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
                
                videoPlayer.src = media.src;
                videoTitleDisplay.textContent = `${media.title} - ${media.artist}`;
                videoModal.classList.remove('hidden');
                videoPlayer.play();
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

    if (btnCloseVideo) {
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

    return playerEngine;
}
