class Enemy extends Character {

    /* El constructor crea un nuevo elemento en el DOM */

    constructor(id, lives) {
        super(lives);
        this.id = id;
        this.game = document.getElementById('game');
        this.element = document.createElement('div');
        this.element.id = id;
        this.element.className = 'enemy';
        this.game.appendChild(this.element);
        this.character = document.getElementById(id);
        this.collisioned = false;
        this.enemyAttacked = new Sound ('./sounds/enemyDead.wav');
    }


    /* Obtiene las coordenadas actuales del personaje */

    status() {
        this.character.getBoundingClientRect();
    }

    /* Comienza la animación del enemigo y al finalizar la animación lo oculta */
    start() {
        this.character.classList.add("start_enemy");

        this.character.addEventListener("animationend", () => {
            this.character.style.display = 'none';
        });
    }

    /* Se modifica si el personaje muere */

    die() {
        this.character.classList.remove('start_enemy');
        this.character.classList.add('die_enemy');
        this.enemyAttacked.play();
    }

    /* Si el enemigo ya fue ciolisionado lo almacena en la variable collisioned */

    collision(isCollisioned) {
        this.collisioned = isCollisioned;
    }

    /* Retorna el valor de collisioned */

    isCollisioned() {
        return this.collisioned;
    }
    
}
