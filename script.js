document.addEventListener('DOMContentLoaded', () => {
    //Elementos parallax del menu

    new Parallax('8s', './PNG/Cartoon_Forest_BG_02/Layers/Ground1.png', document.getElementById('layer5'), 'start_parallax_menu');
    new Parallax('7s', './PNG/Cartoon_Forest_BG_01/Layers/Foreground.png', document.getElementById('layer4'), 'start_parallax_menu');
    new Parallax('6s', './PNG/Cartoon_Forest_BG_02/Layers/Middle_Decor.png', document.getElementById('layer3'), 'start_parallax_menu');
    new Parallax('4s', './PNG/Cartoon_Forest_BG_02/Layers/BG_Decor.png', document.getElementById('layer2'), 'start_parallax_menu');
    new Parallax('2s', './PNG/Cartoon_Forest_BG_02/Layers/Sky.png', document.getElementById('layer1'), 'start_parallax_menu');

    const home = document.getElementById('home');
    const menu = document.getElementById('menu');
    const intro = document.getElementById('intro');
    const newGameBtn = document.getElementById('start-game');
    const gameContainer = document.getElementById('game');
    const howToPlayBtn = document.getElementById('how_to_play');
    const howToPlayPage = document.getElementById("howToPlay");
    const closeWindows = document.getElementById('close_windows');

    /* Oculta el loader al terminar de cargar la pagina */

    window.addEventListener('load', function () {
        document.getElementById('loader').classList.add('loaderHidden');
    });


    /* Llama a la función de renderizado de la pantalla del juego al hacer click en nuevo juego  */

    newGameBtn.addEventListener('click', (e) => {
        e.preventDefault();
        /* Muestra el loader al hacer click en new game */
        document.getElementById('loader').classList.remove('loaderHidden');
        createGame(5, 1);
    });

    /* Muestra la pagina de how to play y cierra el menu */

    howToPlayBtn.addEventListener('click', (e) => {
        menu.style.display = 'none';
        howToPlayPage.classList.toggle('hidden');
    });

    /* Cierra la pagina de how to play y vuelve al menu */

    closeWindows.addEventListener('click', (e) => {
        menu.style.display = 'flex';
        howToPlayPage.classList.toggle('hidden');
    });

    /* Renderiza la pantalla del juego  */

    function createGame(maxEnemies, levelActual) {
        fetch('game.html')
            .then(response => response.text())
            .then(data => {
                intro.pause();
                intro.currentTime = 0;
                home.classList.add('hidden');
                gameContainer.innerHTML = data;
                //Oculta el loader cuando la página esté completamente cargada
                document.getElementById('loader').classList.add('loaderHidden');
                // Llama a la función para iniciar el juego
                startGame(maxEnemies, levelActual);
            })
            .catch(error => console.error('Error al cargar el archivo:', error));
    }


    /* FUNCION QUE CONTIENE TODA LA LOGICA DEL JUEGO, SOLO SE EJECUTA CUANDO INICIA EL JUEGO */

    function startGame(maxEnemies, levelActual) {

        //Variables del personaje
        let livesFairy = 3;
        let character = new Fairy('fairy', livesFairy);

        //Variables de enemigos
        let enemies = [];
        let cantEnemies = maxEnemies;
        let intervalEnemies = 3500;

        //Variables de items  
        let potions = [];
        let cantPotions = 3;
        let intervalPotions = 20000;

        //Variables de información de juego
        let minScore = document.getElementById('min-score');
        let score = document.getElementById('score');
        let lives = document.getElementById('lives');
        let level = document.getElementById('level');
        let timer = document.getElementById('timer');

        let scores = 0;
        let levelUp = new LevelUp('levelUp');
        let actualLevel = levelActual;

        let time_per_level = parseInt((cantEnemies * intervalEnemies) / 1000);
        let timeLeft = time_per_level;

        //Variables de animación
        let animation = new Animation();
        let sound = new Sound('sounds/music.mp3');

        //Variable de CollisionDetector
        let collisionDetector = new CollisionDetector();

        //Variables helpers
        let keyPress = null;
        let in_game = true;
        let in_game_page = true;
        let minimalPoints = (cantEnemies) * 110;
        let passNext = false;
        let gameInterval;

        /*------ EVENTOS DE ESCUCHA DE KEYDOWN Y KEYUP ------ */

        document.addEventListener('keydown', (e) => {
            keyPress = e.code;
            if (keyPress == "Space")
                pauseGame();
        });

        document.addEventListener('keyup', (e) => {
            keyPress = null;
        });

        /*------ PROCESA LA ENTRADA DEL USUARIO ---------- */

        function process_user_entry() {
            if (keyPress == null)
                character.fly();
            else if (keyPress == "KeyA")
                character.attack();
            else
                character.moveTo(keyPress);
        }

        /*------ STOP - PAUSE - RESTART - END GAME -------- */

        /*-- STOP GAME --*/

        function stopGame() {
            in_game = false;
            animation.stopAnimation();
            cancelAnimationFrame(globalId);
            sound.stop();
        }

        /*-- PAUSE GAME --*/

        function pauseGame() {
            if (in_game_page) {
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

            if (!passNext) {
                setTimeout(() => {
                    gameOver(msg);
                }, 1000);
            } else {
                setTimeout(() => {
                    showInfo(msg);
                }, 1000);
            }
        }


        /*------ VERIFICA SI EL PERSONAJE COLISIONA CON CUALQUIER ELEMENTO ------*/

        function areColliding(element) {
            return collisionDetector.areColliding(character.status(), element.status());
        }

        /*------ VERIFICA SI EL PERSONAJE COLISIONA CON LOS ENEMIGOS ------*/

        function areCollidingCharacters() {

            enemies.forEach(enemy => {
                if (areColliding(enemy)) {
                    if (enemy.isAlive() && character.isAttacking())
                        lostLiveEnemy(enemy);

                    else if (!enemy.alreadyAttacked() && !character.isAttacking() && enemy.isAlive()) {
                        enemy.attack();
                        lostLiveCharacter();
                    }
                }
            });
        }

        /*------ VERIFICA SI EL PERSONAJE TOMA LAS POSIONES ------*/

        function takeThePotions() {
            potions.forEach(item => {
                if (!item.isCollisioned() && areColliding(item)) {
                    item.takePotion();
                    character.addLive(item.getLives());
                }
            })
        }


        /*------ QUITA VIDAS AL PERSONAJE PRINCIPAL ------ */

        function lostLiveCharacter() {
            character.lostLive();
            if (!character.isAlive())
                endGame("Perdiste todas tus vidas");
            else
                character.isAttacked();
        }

        /*------ QUITA VIDAS A LOS ENEMIGOS ------*/

        function lostLiveEnemy(enemy) {
            enemy.lostLive();
            if (!enemy.isAlive()) {
                enemy.die();
                scores += enemy.getScoreByEnemy();
            }
        }

        /*------ GENERA NUEVOS ENEMIGOS ------*/

        let countEnemies = 0;

        function generateEnemies() {
            if (in_game && countEnemies < cantEnemies) {
                if (countEnemies % 2 == 0)
                    enemies.push(new Enemy(`enemy${countEnemies}`, 1, 'enemy', 100));
                else
                    enemies.push(new SpecialEnemy(`enemySpecial${countEnemies}`, 1, 'specialEnemy', 200));

                countEnemies++;
            }
            else if (!in_game) {
                enemies = [];
                countEnemies = 0;
            }
        }


        /*------ GENERA NUEVAS POSIONES ------*/

        let countPotions = 0;

        function generatePotions() {
            if (in_game && countPotions < cantPotions) {
                potions.push(new MagicPotion(`potion${countPotions}`, 1));
                countPotions++;
            }
            else if (!in_game) {
                potions = [];
                countPotions = 0;
            }
        }



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

        /*--- Si pasó de nivel, finaliza el juego y muestra la pantalla de nextLevel ---*/

        function passNextLevel() {
            if (in_game && areColliding(levelUp)) {
                if (scores >= minimalPoints) {
                    character.hidde();
                    passNext = true;
                    levelUp.takeLevelUp();
                    increaseDifficulty();
                    endGame("Pasaste de nivel");
                } else
                    endGame("No alcanzó los puntos requeridos en este nivel");
            }
        }


        /*-------- Incrementa la dificultad del juego para cada nivel  ---------*/

        function increaseDifficulty() {
            actualLevel++;
            cantEnemies+=3;
        }

        /*-------- Muestra la pantalla de Next Level --------*/

        function showInfo(msg) {
            if (passNext)
                loadPage('bg_win', '¡Felicitaciones!', 'Next Level', 'Continuar', 'Pulsa continuar para seguir jugando', msg);
        }

        /*-------- Muestra la pantalla de Game Over --------*/


        function gameOver(msg) {
            loadPage('bg_gameOver', '¡Ups!', 'Has perdido', 'Reiniciar', 'Pulsa reiniciar para comenzar de nuevo', msg);
        }

        /*-------- Carga las pantallas de información de juego --------*/

        function loadPage(classBg, header, title, btnText, footer, msg) {
            in_game_page = false;
            fetch('info.html')
                .then(response => response.text())
                .then(data => {
                    gameContainer.innerHTML = data;
                    let btn = document.getElementById('btn')
                    btn.innerHTML = btnText;
                    document.getElementById('totalScores_info').innerHTML = "Scores: " + scores;
                    document.getElementById('level_info').innerHTML = "Level: " + actualLevel;
                    document.getElementById('bg_info').classList.add(classBg);
                    document.getElementById('info_game').innerHTML = msg;
                    document.getElementById('card-header').innerHTML = header;
                    document.getElementById('card-title').innerHTML = title;
                    document.getElementById('footer').innerHTML = footer;


                    if (btn) {
                        btn.addEventListener('click', (e) => {
                            createGame(cantEnemies, actualLevel);
                        });
                    } else
                        console.error('El botón no se encontró.');
                })
                .catch(error => console.error('Error al cargar el archivo:', error));
        }


        /*------------------ SET INTERVALS ------------------ */

        /*------ Generar enemigos cada n = (IntervalEnemies) segundos ------*/

        let enemyInterval = setInterval(() => {
            if (in_game)
                generateEnemies();
            else
                clearInterval(enemyInterval);
        }, intervalEnemies);

        setTimeout(() => { generateEnemies(); }, 1500);


        /*------ Generar posiones cada n = (IntervalPotions) segundos ------*/

        let potionsInterval = setInterval(() => {
            if (in_game)
                generatePotions();
            else
                clearInterval(potionsInterval);
        }, intervalPotions);

        setTimeout(() => { generatePotions(); }, 3000);


        /*------ Actualiza el timer cada 1 segundo ------*/

        function updateTimer() {
            if (in_game) {
                if (timeLeft == 5)
                    levelUp.start();
                if (timeLeft < 5)
                    passNextLevel();
                if (timeLeft > 0)
                    timeLeft--;
                else
                    endGame("Te has quedado sin tiempo.");
            }
        }

        gameInterval = setInterval(updateTimer, 1000);

        /*---------- FUNCIÓN CÍCLICA DE ANIMACIÓN CON REQUEST ANIMATION FRAME --------- */

        let globalId;

        function gameLoop() {
            if (in_game) {
                sound.play();
                process_user_entry();
                areCollidingCharacters();
                takeThePotions();
                updateInformation();
                globalId = requestAnimationFrame(gameLoop);
            }
        }

        gameLoop();

    }
})