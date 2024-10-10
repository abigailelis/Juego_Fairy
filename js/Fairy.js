class Fairy extends Character {
    
    constructor(elementId, lives){
        super(lives);
        this.character = document.getElementById(elementId);
        this.character.classList.add('fly');
        this.coord = this.character.getBoundingClientRect();
        this.x = this.coord.left;
        this.y = this.coord.top;
        this.steps = 6;
        this.attackSound = new Sound('./sounds/FairyAttack.mp3');
  
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

    /* Mueve al personaje según las teclas oprimidas y no le permite salir de los bordes de la pantalla  */

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
        this.character.classList.remove('fly');
        if(this.isAttacking)
            this.character.classList.remove('attack');
    }

    /* Verifica si el personaje está atacando o no */

    isAttacking(){
        return this.character.classList.contains('attack');
    }

    /* Se modifica si el personaje pierde una vida */

    isAttacked(){
        this.character.classList.add('blink');
        setTimeout(() => {
            this.character.classList.remove('blink');
        }, 3000);
    }

    /* Oculta al elemento */

    hidde(){
        this.character.classList.add('hidden');
    }

    /* Obtiene las coordenadas actuales del personaje */

    status(){
        return this.character.getBoundingClientRect();
    }
}