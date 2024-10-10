class Character{

    constructor(lives){
        this.lives = lives;
        this.isLive = true;
    }
    
    /*-- Le quita vidas al personaje/enemigo --*/
    
    lostLive(){
        if(this.lives > 0){
            this.lives -= 1;  
            if(this.lives <=0)    
                this.isLive = false; 
        }    
    }

    /*-- Adiciona vidas al personaje/enemigo --*/

    addLive(cant){
        this.lives += cant;
    }

    /*-- Retorna true o false si el personaje/enemigo está vivo --*/
    isAlive(){
        return this.isLive;
    }
     
    /*-- Retorna la cantidad de vidas actuales del personaje/enemigo --*/
    getLives(){
        return this.lives;
    }
}