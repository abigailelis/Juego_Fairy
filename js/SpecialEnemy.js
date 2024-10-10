class SpecialEnemy extends Enemy{
    constructor(id, lives, className, scoreByEnemy){
        super(id, lives, className, scoreByEnemy);
        this.enemyAttacked = new Sound('./sounds/dieSpirit.wav');
        this.fairyAttacked = new Sound ('./sounds/specialEnemyAttack.wav');
        this.start();
    }

    /* Comienza la animación del enemigo y al finalizar la animación lo oculta */

    start() {
        this.clean();
        this.character.classList.add("start_specialEnemy");

        this.character.addEventListener("animationend", () => {
            this.character.style.display = 'none';
        });
    }

    /* Se modifica si el personaje muere */

    die() {
        this.clean();
        this.character.classList.remove('start_specialEnemy');
        this.character.classList.add('die_specialEnemy');
        this.enemyAttacked.play();
    }
}