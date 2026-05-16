export function initGalaxy() {
    const canvas = document.getElementById('galaxy-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const stars = [];
    for (let i = 0; i < 400; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * width,
            radius: Math.random() * 1.5,
            color: Math.random() > 0.5 ? '#00f3ff' : '#bc13fe'
        });
    }

    function animate() {
        ctx.fillStyle = 'rgba(5, 5, 16, 0.3)';
        ctx.fillRect(0, 0, width, height);

        stars.forEach(star => {
            star.z -= 0.5;
            if (star.z <= 0) {
                star.z = width;
                star.x = Math.random() * width;
                star.y = Math.random() * height;
            }
            let x = (star.x - width / 2) * (width / star.z) + width / 2;
            let y = (star.y - height / 2) * (width / star.z) + height / 2;
            let r = star.radius * (width / star.z);

            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = star.color;
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
}
