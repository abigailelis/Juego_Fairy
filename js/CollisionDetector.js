class CollisionDetector {
    
    /* Verifica si el personaje se toca con otro elemento */
    
    checkCollision(personaje, element) {
        if(personaje != null && element != null){
            const fairy = personaje.getBoundingClientRect();
            const elem = element.getBoundingClientRect();
    
            return this.areColliding(fairy, elem);
        }
        return false;
    }

    /* Verifica si dos rectángulos se solapan */

    areColliding(rect1, rect2) {
        return !(rect1.right < rect2.left || 
                 rect1.left > rect2.right || 
                 rect1.bottom < rect2.top || 
                 rect1.top > rect2.bottom);
    }
}



