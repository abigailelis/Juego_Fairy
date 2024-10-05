class Sound {

    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }

    play() {
        if (this.sound.paused) {
            this.sound.play().catch(error => {
                console.error('Error playing sound:', error);
            });
        }

    }

    stop() {
        if(!this.sound.paused){
            this.sound.pause();
            this.sound.currentTime = 0;
        }
    }

}
