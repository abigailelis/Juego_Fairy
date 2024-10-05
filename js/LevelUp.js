class LevelUp extends Item{

    constructor(id){
        super();
        this.id = id;
        this.game = document.getElementById('game');
        this.element = document.createElement('div');
        this.element.id = id;
        this.element.className = 'levelUp hidden';
        this.game.appendChild(this.element);
        this.item = document.getElementById(id);
        this.nextLevelSound = new Sound ('./sounds/nextLevel.wav');
    }

    /*-- Comienza la animación del item y al finalizar la animación lo oculta --*/

    start() {
        this.item.classList.add("blink");
        this.item.style.display = 'block';

        this.item.addEventListener("animationend", () => {
            this.item.style.display = 'none';
        });

    }

    takeLevelUp(){
        this.nextLevelSound.play();
        this.item.style.display = 'none';
    }
}