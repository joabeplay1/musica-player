export function initPlaylist(playerEngine) {
    const btnSave = document.getElementById('btn-save-media');
    const playlistContainer = document.getElementById('playlist-list');
    const emptyState = document.getElementById('playlist-empty');
    
    // Tenta carregar a playlist. Se o navegador travar, ele recria.
    let myPlaylist = [];
    try {
        myPlaylist = JSON.parse(localStorage.getItem('gmusic_playlist')) || [];
    } catch (e) {
        console.error("Erro ao carregar a playlist", e);
        myPlaylist = [];
    }

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
                <img src="${media.cover || ''}" onerror="this.src='https://via.placeholder.com/150/111111/bc13fe?text=Play'" alt="Capa">
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

    // Extrai o ID do Google Drive de qualquer formato de link
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
            e.preventDefault(); // Impede recarregamento acidental da página
            
            const driveLink = document.getElementById('upload-drive').value;
            const title = document.getElementById('upload-title').value || 'Mídia Desconhecida';
            const artist = document.getElementById('upload-artist').value || 'Artista Desconhecido';
            const type = document.getElementById('upload-type').value;
            const coverFile = document.getElementById('upload-cover').files[0];

            if (!driveLink) {
                alert("⚠️ Por favor, cole o link do Google Drive!");
                return;
            }

            const finalSrc = convertDriveLink(driveLink);

            if (coverFile) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    saveToDatabase(finalSrc, title, artist, type, event.target.result);
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
        
        try {
            // Tenta salvar no navegador
            localStorage.setItem('gmusic_playlist', JSON.stringify(myPlaylist));
            
            // Limpa os campos depois de salvar com sucesso
            document.getElementById('upload-drive').value = '';
            document.getElementById('upload-title').value = '';
            document.getElementById('upload-artist').value = '';
            document.getElementById('upload-cover').value = '';
            
            alert("✅ Salvo com sucesso na Playlist!");
            renderPlaylist();

        } catch (error) {
            // Se der erro (ex: a imagem for muito pesada para o limite do navegador)
            myPlaylist.pop(); // Remove a música defeituosa da lista
            alert("❌ Erro ao salvar! A imagem da capa pode ser muito pesada. Tente usar uma imagem menor ou não colocar capa.");
            console.error(error);
        }
    }

    // Renderiza a lista na tela logo no início
    renderPlaylist();
}
