class MagicPotion extends Item {

    constructor(id, lives) {
        super();
        this.id = id;
        this.lives = lives;
        this.game = document.getElementById('game');
        this.element = document.createElement('div');
        this.element.id = id;
        this.element.className = 'potion';
        this.game.appendChild(this.element);
        this.item = document.getElementById(id);
        this.takePotionSound = new Sound('./sounds/takePotion.wav');
        this.start();
    }

    /*-- Comienza la animación del item y al finalizar la animación lo oculta --*/

    start() {
        this.item.classList.add("start_item");

        this.item.addEventListener("animationend", () => {
            this.item.style.display = 'none';
            this.cleanDom();
        });

    }

    /*-- Crea el efecto al tomar la posión y la oculta --*/

    takePotion() {
        this.collision(true);
        this.takePotionSound.play();
        this.item.style.display = 'none';
    }

    /*-- Retorna la cantidad de vidas que incrementa la posión --*/

    getLives() {
        return this.lives;
    }

    /*-- Elimina el elemento del DOM --*/

    cleanDom() {
        this.item.remove();
    }

    /* Obtiene las coordenadas actuales del personaje */

    status() {
        return this.item.getBoundingClientRect();
    }
}