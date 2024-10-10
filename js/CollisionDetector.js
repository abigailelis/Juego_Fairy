class CollisionDetector {

    /* Verifica si dos rectángulos se solapan */

    areColliding(rect1, rect2) {
        if (rect1 != null && rect2 != null) {
            return !(rect1.right < rect2.left ||
                rect1.left > rect2.right ||
                rect1.bottom < rect2.top ||
                rect1.top > rect2.bottom);
        } else
            return false;
    }
}



