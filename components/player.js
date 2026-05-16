export function initPlayer() {
    const audio = new Audio();
    let isPlaying = false;
    
    const playBtn = document.getElementById('btn-play');
    if (!playBtn) return;
    
    const playIcon = playBtn.querySelector('.material-icons-round');
    const coverImage = document.getElementById('current-cover');
    const progressBar = document.getElementById('progress-bar');
    const volumeBar = document.getElementById('volume-bar');
    
    playBtn.addEventListener('click', () => {
        if(isPlaying) {
            audio.pause();
            playIcon.textContent = 'play_arrow';
            coverImage.classList.remove('playing');
        } else {
            // áudio fictício para teste até o upload estar pronto
            if(!audio.src) audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; 
            audio.play().catch(e => console.log("Aguardando interação do usuário para tocar"));
            playIcon.textContent = 'pause';
            coverImage.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });

    volumeBar.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });
    
    audio.addEventListener('timeupdate', () => {
        if(audio.duration){
            progressBar.value = (audio.currentTime / audio.duration) * 100;
        }
    });

    progressBar.addEventListener('input', (e) => {
        audio.currentTime = (e.target.value / 100) * audio.duration;
    });
}
