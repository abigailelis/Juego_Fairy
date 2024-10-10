class Enemy extends Character {

    /* El constructor crea un nuevo elemento en el DOM */

    constructor(id, lives, className, scoreByEnemy) {
        super(lives);
        this.id = id;
        this.game = document.getElementById('game');
        this.element = document.createElement('div');
        this.element.id = id;
        this.element.className = className;
        this.game.appendChild(this.element);
        this.character = document.getElementById(id);
        this.scoreByEnemy = scoreByEnemy;
        this.collisioned = false;
        this.previousAttack = false;
        this.enemyAttacked = new Sound('./sounds/enemyDead.wav');
        this.fairyAttacked = new Sound ('./sounds/fairyDead.wav');
        this.start();
    }


    /* Comienza la animación del enemigo y al finalizar la animación lo oculta */

    start() {
        this.clean();
        this.character.classList.add("start_enemy");

        this.character.addEventListener("animationend", () => {
            this.character.style.display = 'none';
        });
    }

    /* Se modifica si el personaje muere */

    die() {
        this.clean();
        this.character.classList.add('die_enemy');
        this.enemyAttacked.play();
    }

    /* Elimina todas las clases del enemigo */

    clean(){
        this.character.classList.remove('start_enemy');
        this.character.classList.remove('die_enemy');
    }

    /* Si el enemigo ya fue ciolisionado lo almacena en la variable collisioned */

    collision(isCollisioned) {
        this.collisioned = isCollisioned;
    }

    /* Retorna el valor de collisioned */

    isCollisioned() {
        return this.collisioned;
    }

    /*-- Modifica la variable que indica si el enemigo ya habia atacado/quitado vidas al personaje principal  --*/

    attack() {
        this.previosAttack = true;
        this.fairyAttacked.play();
    }

    /*-- Retorna true o false si el enemigo ya habia atacado/quitado vidas al personaje principal  --*/

    alreadyAttacked() {
        return this.previosAttack;
    }

    /*-- Retorna los puntos por cada enemigo --*/
    getScoreByEnemy() {
        return this.scoreByEnemy;
    }

    /* Obtiene las coordenadas actuales del personaje */

    status() {
        return this.character.getBoundingClientRect();
    }
}
