export function initGalaxy() {
    const canvas = document.getElementById('galaxy-canvas');
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const stars = [];
    const numStars = 400;

    class Star {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.z = Math.random() * width;
            this.radius = Math.random() * 1.5;
            this.color = Math.random() > 0.5 ? '#00f3ff' : '#bc13fe';
        }

        update() {
            this.z -= 0.5; // Velocidade de movimento em direção ao espectador
            if (this.z <= 0) {
                this.z = width;
                this.x = Math.random() * width;
                this.y = Math.random() * height;
            }
        }

        draw() {
            let x = (this.x - width / 2) * (width / this.z) + width / 2;
            let y = (this.y - height / 2) * (width / this.z) + height / 2;
            let r = this.radius * (width / this.z);

            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
        }
    }

    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }

    function animate() {
        ctx.fillStyle = 'rgba(5, 5, 16, 0.3)'; // Rastro suave
        ctx.fillRect(0, 0, width, height);

        stars.forEach(star => {
            star.update();
            star.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
}
