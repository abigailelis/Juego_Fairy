class Fairy extends Character {
    
    constructor(elementId, lives){
        super(lives);
        this.character = document.getElementById(elementId);
        this.coord = this.character.getBoundingClientRect();
        this.x = this.coord.left;
        this.y = this.coord.top;
        this.steps = 5;
        this.attackSound = new Sound('./sounds/FairyAttack.mp3');
        this.fairyAttacked = new Sound ('./sounds/fairyDead.wav');
    }

    /* Acción principal del personaje - volar */

    fly(){
        this.clean();
        this.character.classList.add('fly');
    }

    /* Acción del personaje - atacar */

    attack(){
        this.clean();
        this.character.classList.add('attack');
        this.attackSound.play();
    }

    /* Actualiza la posición del personaje con las nuevas coordenadas  */

    updatePosition() {
        this.character.style.top = `${this.y}px`;
        this.character.style.left = `${this.x}px`;
        this.status();
    }

    /* Actualiza las coordenadas actuales del personaje */

    moveTo(key){
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        if(key == "ArrowRight" && this.x + this.steps + this.character.offsetWidth <= screenWidth)
            this.x += this.steps;
        else if(key == "ArrowLeft" && this.x - this.steps >= 0)
            this.x -= this.steps;
        else if(key == "ArrowUp" && this.y - this.steps >= 0)
            this.y -= this.steps;
        else if(key == "ArrowDown" && this.y + this.steps + this.character.offsetHeight <= screenHeight)
            this.y += this.steps;

        this.updatePosition();
    }

    /* Elimina todas las clases del personaje */

    clean(){
        this.character.classList.remove('attack');
        this.character.classList.remove('fly');
    }

    /* Verifica si el personaje está atacando o no */

    isAttacking(){
        return this.character.classList.contains('attack');
    }

    /* Se modifica si el personaje muere */

    isAttacked(){
        this.character.classList.add('blink');
        this.fairyAttacked.play();
        setTimeout(() => {
            this.character.classList.remove('blink');
        }, 3000);
    }

    /* Obtiene las coordenadas actuales del personaje */

    status(){
        this.character.getBoundingClientRect();
    }
}