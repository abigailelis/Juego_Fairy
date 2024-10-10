class Item{

    constructor() {
        this.collisioned = false;
    }


    /* Si el item ya fue ciolisionado lo almacena en la variable collisioned */

    collision(isCollisioned) {
        this.collisioned = isCollisioned;
    }

    /* Retorna el valor de collisioned */

    isCollisioned() {
        return this.collisioned;
    }
}