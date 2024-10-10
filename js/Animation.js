class Animation {

    constructor() {
        this.running = true;
    }

    getDomElements() {
        /* Obtiene los elementos del DOM */

        let enemys = document.getElementsByClassName('enemy');
        let specialEnemys = document.getElementsByClassName('specialEnemy');
        let parallax = document.getElementsByClassName('bg-parallax');
        let items = document.getElementsByClassName('potion');
        let main_character = document.getElementById('fairy');

        /* Los convierte en Array para recorrerlos con foreach */

        enemys = Array.from(enemys);
        specialEnemys = Array.from(specialEnemys);
        parallax = Array.from(parallax);
        items = Array.from(items);

        return { enemys, specialEnemys, parallax, items, main_character}
    }

    stopAnimation() {
        let elements = this.getDomElements();

        let enemys = elements.enemys;
        let specialEnemys = elements.specialEnemys;
        let parallax = elements.parallax;
        let items = elements.items;


        /* Pausa al personaje principal */

        elements.main_character.style.animationPlayState = 'paused';

        /* Pausa todos los enemigos en su posicion actual */

        enemys.forEach(enemy => {
            enemy.style.animationPlayState = 'paused';
        });

        specialEnemys .forEach(enemy => {
            enemy.style.animationPlayState = 'paused';
        });

        /* Pausa las animaciones parallax del ambiente */

        parallax.forEach(layer => {
            layer.style.animationPlayState = 'paused';
        });

        /* Pausa todas las posiones en su posicion actual */

        items.forEach(item => {
            item.style.animationPlayState = 'paused';
        });

        this.running = false;
    }

    reStartAnimation(){
        let elements = this.getDomElements();

        let enemys = elements.enemys;
        let specialEnemys = elements.specialEnemys;
        let parallax = elements.parallax;
        let items = elements.items;

        /* Retoma las animaciones del personaje principal */

        elements.main_character.style.animationPlayState = 'running';

        /* Retoma las animaciones parallax de los enemigos*/

        enemys.forEach(enemy => {
            enemy.style.animationPlayState = 'running';
        });

        specialEnemys .forEach(enemy => {
            enemy.style.animationPlayState = 'running';
        });

        /* Retoma las animaciones parallax del ambiente */

        parallax.forEach(layer => {
            layer.style.animationPlayState = 'running';
        });

        /* Retoma todas las posiones */

        items.forEach(item => {
            item.style.animationPlayState = 'running';
        });

        this.running = true;
    }

    /* Retorna el valor running, que indica si la animación está corriendo o no */

    isRunning() {
        return this.running;
    }
}