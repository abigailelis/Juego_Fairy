document.addEventListener('DOMContentLoaded', () => {

    const intro = document.getElementById('intro');
    const newGame_content = document.getElementById('start-game');
    const gameContainer = document.getElementById('game');
    const menu = document.getElementById('home');

    /* Llama a la función de renderizado de la pantalla del juego al hacer click en nuevo juego  */

    newGame_content.addEventListener('click', (e) => {
        e.preventDefault();
        
        createGame(5, 6000, 1);
    });

    /* Renderiza la pantalla del juego  */

    function createGame(maxEnemies, intEnemies, levelActual) {
        fetch('game.html')
            .then(response => response.text())
            .then(data => {
                intro.pause();
                intro.currentTime = 0;
                menu.classList.add('hidden');
                gameContainer.innerHTML = data;
                startGame(maxEnemies, intEnemies, levelActual); // Llama a la función para iniciar el juego
            })
            .catch(error => console.error('Error al cargar el archivo:', error));
    }



    /* FUNCION QUE CONTIENE TODA LA LOGICA DEL JUEGO, SOLO SE EJECUTA CUANDO INICIA EL JUEGO */

    function startGame(maxEnemies, intEnemies, levelActual) {
        
        //Variables del personaje
        let livesFairy = 3;
        let character = new Fairy('fairy', livesFairy);
        let characterDOM = document.getElementById('fairy');

        //Variables de enemigos
        let enemies = [];
        let cantEnemies = maxEnemies;
        let intervalEnemies = intEnemies;

        //Variables de items
        let potions = [];
        let cantPotions = 3;
        let intervalPotions = 20000;

        //Variables de información de juego
        let score = document.getElementById('score');
        let minScore = document.getElementById('min-score');
        let lives = document.getElementById('lives');
        let level = document.getElementById('level');
        let timer = document.getElementById('timer');
        let scores = 0;
        let scoreByEnemy = 100;
        let levelUp = new LevelUp('levelUp');
        let actualLevel = levelActual;
        let time_per_level =  parseInt((cantEnemies*intervalEnemies)/1000);
        let timeLeft = time_per_level;
        let gameInterval;


        //Variables de animación
        let animation = new Animation();
        let sound = new Sound('sounds/music.mp3');


        //Variable de CollisionDetector
        let collisionDetector = new CollisionDetector();

        //Variables helpers
        let keyPress = null;
        let in_game = true;
        let in_game_page = true;
        let minimalPoints = (cantEnemies) * 100;
        let passNext = false;



        /*-------------------- EVENTOS DE ESCUCHA DE KEYDOWN Y KEYUP ---------------------- */

        document.addEventListener('keydown', (e) => {
            keyPress = e.code;
            if (keyPress == "Space")
                pauseGame();
        });

        document.addEventListener('keyup', (e) => {
            keyPress = null;
        });


        /*-------------------------- PROCESA LA ENTRADA DEL USUARIO ------------------------ */

        function process_user_entry() {
            if (keyPress == null)
                character.fly();
            else if (keyPress == "KeyA")
                character.attack();
            else
                character.moveTo(keyPress);
        }

        /* ----------------------- STOP - PAUSE - RESTART - END GAME ---------------------------------- */

        /*-- STOP GAME --*/

        function stopGame() {
            in_game = false;
            animation.stopAnimation();
            cancelAnimationFrame(globalId);
            sound.stop();
        }

        /*-- PAUSE GAME --*/

        function pauseGame() {
            if(in_game_page){
                if (in_game)
                    stopGame();
                else
                    reStartGame();
            }
        }

        /*-- RESTART GAME --*/

        function reStartGame() {
            in_game = true;
            animation.reStartAnimation();
            globalId = requestAnimationFrame(gameLoop);
        }

        /*-- END GAME --*/

        function endGame(msg) {
            stopGame();
            clearInterval(gameInterval);
            if (!passNext)
                gameOver(msg);
            else
                showInfo(msg);
        }


        /*--------------- VERIFICA SI EL PERSONAJE COLISIONA CON CUALQUIER ELEMENTO ---------------*/

        function areColliding(element) {
            return collisionDetector.checkCollision(characterDOM, element);
        }

        /*--------------- VERIFICA SI EL PERSONAJE COLISIONA CON LOS ENEMIGOS ---------------------*/

        function areCollidingCharacters() {
            enemies.forEach(enemy => {
                let enemyDom = document.getElementById(enemy.id);
                if (!enemy.isCollisioned() && areColliding(enemyDom)) {
                    enemy.collision(true);
                    if (character.isAttacking())
                        lostLiveEnemy(enemy);
                    else
                        lostLiveCharacter();
                }
            })
        }

        /*---------------------- VERIFICA SI EL PERSONAJE TOMA LAS POSIONES ----------------------*/

        function takeThePotions() {
            potions.forEach(item => {
                let itemDom = document.getElementById(item.id);
                if (!item.isCollisioned() && areColliding(itemDom)) {
                    item.collision(true);
                    item.takePotion();
                    character.addLive(item.getLives());
                }
            })
        }


        /* ------------------------------- QUITA VIDAS AL PERSONAJE ------------------------------ */

        function lostLiveCharacter() {
            character.lostLive();
            if (!character.isAlive()) {
                endGame("Perdiste todas tus vidas");
            }
            else
                character.isAttacked();
        }

        /* ---------------------------- QUITA VIDAS A LOS ENEMIGOS --------------------------------- */

        function lostLiveEnemy(enemy) {
            enemy.lostLive();
            if (!enemy.isAlive()) {
                enemy.die();
                scores += scoreByEnemy;
            }
        }

        /*----------------------------------- GENERA NUEVOS ENEMIGOS -----------------------------------*/

        let countEnemies = 0;

        function generateEnemies() {

            if (in_game && countEnemies < cantEnemies) {
                let enemy = new Enemy(`enemy${countEnemies}`, 1);
                enemies.push(enemy);
                enemy.start();
                countEnemies++;
            }
            else if (!in_game) {
                enemies = [];
                countEnemies = 0;
            }
        }


        /*---------------------------------- GENERA NUEVAS POSIONES ---------------------------------------*/

        let countPotions = 0;

        function generatePotions() {
            if (in_game && countPotions < cantPotions) {
                let item = new MagicPotion(`potion${countPotions}`, 1);
                potions.push(item);
                item.start();
                countPotions++;
            }
            else if (!in_game) {
                potions = [];
                countPotions = 0;
            }
        }

        /*------------------------------------------ SET INTERVALS -------------------------------- */

        /*---------------- Generar enemigos cada n = (IntervalEnemies) segundos --------------------*/

        let enemyInterval = setInterval(() => {
            if (in_game)
                generateEnemies();
            else
                clearInterval(enemyInterval);
        }, intervalEnemies);

        /*----------------- Generar posiones cada n = (IntervalPotions) segundos --------------------*/

        let potionsInterval = setInterval(() => {
            if (in_game)
                generatePotions();
            else
                clearInterval(potionsInterval);
        }, intervalPotions);


        /*--------------------- Actualiza el timer cada 1 segundo -----------------------*/

        function updateTimer() {
            if (in_game) {
                if (timeLeft == 5)
                    createNextLevel();
                if (timeLeft < 5) {
                    passNextLevel();
                }
                if (timeLeft > 0)
                    timeLeft--;
                else {
                    endGame("Te has quedado sin tiempo.");
                }
            }
        }

        gameInterval = setInterval(updateTimer, 1000);

        /*-------------- FUNCIÓN PARA ACTUALIZAR LA INFORMACIÓN DEL JUEGO -------------------*/

        function updateInformation() {
            livesFairy = character.getLives();
            minScore.innerHTML = "Min. Score: " + minimalPoints;
            score.innerHTML = "Score: " + scores;
            lives.innerHTML = "Lives: " + livesFairy;
            level.innerHTML = "Level: " + actualLevel;
            timer.innerHTML = "Time: " + timeLeft;
        }

        /*-------------------------------------- PASAR AL SIGUIENTE NIVEL  --------------------------------- */

        /*-------- Crea el item que se debe tomar para pasar al siguiente nivel -----------*/

        function createNextLevel() {
            if (in_game)
                levelUp.start();
        }

        /*--- Si pasó de nivel, finaliza el juego, muestra la pantalla de nextLevel y comienza un nuevo juego ---*/

        function passNextLevel() {
            let levelDOM = document.getElementById('levelUp');
            if (in_game && areColliding(levelDOM)) {
                if (scores >= minimalPoints) {
                    passNext = true;
                    levelUp.takeLevelUp();
                    increaseDifficulty();
                    endGame("Pasaste de nivel");
                } else
                    endGame("No alcanzó los puntos requeridos en este nivel");
            }
        }


        /*----------------- Incrementa la dificultad del juego para cada nivel  --------------------*/

        function increaseDifficulty() {
            actualLevel++;
            cantEnemies++;
            intervalEnemies -= 500;
        }

        /*-------------------- Muestra la pantalla de Next Level ------------------------*/

        function showInfo(msg) {
            in_game_page = false;

            if (passNext) {
                fetch('info.html')
                    .then(response => response.text())
                    .then(data => {
                        gameContainer.innerHTML = data;
                        let btnNextLevel = document.getElementById('nextLevel');
                        document.getElementById('totalScores_info').innerHTML = "Scores: " + scores;
                        document.getElementById('level_info').innerHTML = "Level: " + actualLevel;
                        document.getElementById('info_nextLevel').innerHTML = msg;

                        if (btnNextLevel) {
                            btnNextLevel.addEventListener('click', (e) => {
                                createGame(cantEnemies, intervalEnemies, actualLevel);
                            });
                        } else
                            console.error('El botón nextLevel no se encontró.');

                    })
                    .catch(error => console.error('Error al cargar el archivo:', error));
            }
        }


        /*-------------------- Muestra la pantalla de Next Level ------------------------*/

    
        function gameOver(msg) {
            in_game_page = false;
            fetch('gameOver.html')
                .then(response => response.text())
                .then(data => {
                    gameContainer.innerHTML = data;
                    let restartGame = document.getElementById('restartGame');
                    document.getElementById('totalScores_info').innerHTML = "Scores: " + scores;
                    document.getElementById('level_info').innerHTML = "Level: " + actualLevel;
                    document.getElementById('info_gameOver').innerHTML = "Has perdido porque: " + msg;

                    if (restartGame) {
                        restartGame.addEventListener('click', (e) => {
                            createGame(cantEnemies, intervalEnemies, actualLevel);
                        });
                    } else
                        console.error('El botón reiniciar no se encontró.');

                })
                .catch(error => console.error('Error al cargar el archivo:', error));
        }

        /*-------------------- FUNCIÓN CÍCLICA DE ANIMACIÓN CON REQUEST ANIMATION FRAME -------------------- */


        generateEnemies();
        generatePotions();


        let globalId;

        function gameLoop() {

            if (in_game) {
                process_user_entry();
                areCollidingCharacters();
                takeThePotions();
                updateInformation();

                sound.play();
                globalId = requestAnimationFrame(gameLoop);

            }
        }

        gameLoop();

    }

})