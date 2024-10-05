class Character{

    constructor(lives){
        this.lives = lives;
        this.isLive = true;
    }
    
    
    lostLive(){
        if(this.lives > 0){
            this.lives -= 1;  
            if(this.lives <=0)    
                this.isLive = false; 
        }    
    }

    addLive(cant){
        this.lives += cant;
    }

    isAlive(){
        return this.isLive;
    }

    
    getLives(){
        return this.lives;
    }
}