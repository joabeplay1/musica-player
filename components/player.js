export function initPlaylist(playerEngine) {
    const btnSave = document.getElementById('btn-save-media');
    const playlistContainer = document.getElementById('playlist-list');
    const emptyState = document.getElementById('playlist-empty');
    
    // Recupera a playlist do LocalStorage
    let myPlaylist = [];
    try {
        myPlaylist = JSON.parse(localStorage.getItem('gmusic_playlist')) || [];
    } catch (e) {
        console.warn("Criando nova playlist vazia.");
        myPlaylist = [];
    }

    function renderPlaylist() {
        if (!playlistContainer) return;

        // Limpa a lista atual
        const items = playlistContainer.querySelectorAll('.playlist-item');
        items.forEach(item => item.remove());

        if (myPlaylist.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        // Constroi a lista
        myPlaylist.forEach((media, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'playlist-item';
            
            // Capa padrão se não houver link
            const coverImage = media.cover || 'https://via.placeholder.com/150/111111/bc13fe?text=Play';
            
            itemDiv.innerHTML = `
                <img src="${coverImage}" onerror="this.src='https://via.placeholder.com/150/111111/bc13fe?text=Erro'" alt="Capa">
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

        // Evento de Play
        document.querySelectorAll('.play-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                if (playerEngine) playerEngine.playMedia(myPlaylist[index]);
            });
        });

        // Evento de Excluir
        document.querySelectorAll('.delete-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                myPlaylist.splice(index, 1);
                localStorage.setItem('gmusic_playlist', JSON.stringify(myPlaylist));
                renderPlaylist();
            });
        });
    }

    // Traduz Link Público do Drive para Link Direto
    function convertDriveLink(url) {
        if (!url) return null;
        const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
            return `https://drive.google.com/uc?export=download&id=${match[1]}`;
        }
        return url; // Retorna o link original caso seja uma URL direta comum
    }

    // Evento de Salvar Música/Vídeo
    if (btnSave) {
        btnSave.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o botão de dar refresh na página
            
            const driveInput = document.getElementById('upload-drive');
            const coverInput = document.getElementById('upload-cover');
            const titleInput = document.getElementById('upload-title');
            const artistInput = document.getElementById('upload-artist');
            const typeInput = document.getElementById('upload-type');

            if (!driveInput || !driveInput.value) {
                alert("⚠️ Cole o link do Google Drive para salvar!");
                return;
            }

            const finalSrc = convertDriveLink(driveInput.value);
            const finalCover = convertDriveLink(coverInput.value);

            const newMedia = {
                id: Date.now(),
                src: finalSrc,
                title: titleInput.value || 'Mídia Desconhecida',
                artist: artistInput.value || 'Desconhecido',
                type: typeInput.value,
                cover: finalCover
            };

            // Salva na Memória e no LocalStorage
            myPlaylist.push(newMedia);
            localStorage.setItem('gmusic_playlist', JSON.stringify(myPlaylist));
            
            // Limpa os campos
            driveInput.value = '';
            coverInput.value = '';
            titleInput.value = '';
            artistInput.value = '';
            
            alert("✅ Salvo com sucesso na sua Playlist Premium!");
            renderPlaylist(); // Atualiza a tela imediatamente
        });
    }

    // Exibe a lista ao carregar a página
    renderPlaylist();
}
