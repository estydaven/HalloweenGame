const wrapper = document.querySelector('.wrapper');
const greetingWindow = document.querySelector('.greeting');
const greetingQuestion = document.querySelector('.greeting__question');
const greetingUser = document.querySelector('.greeting__user');
const userName = document.querySelector('#field');
const btnGreeting = document.querySelector('.greeting__button');
const textDanger = document.querySelector('.danger-text');
const startWrapper = document.querySelector('#start-btn');
const startBtn = document.querySelector('.start-btn');
const description = document.querySelector('.description');
const gamer = document.querySelector('#gamer');
const gameArea = document.querySelector('#game-area');
const scoreArea = document.querySelector('.score-area');
const scoreElem = document.querySelector('#score');
const levelElem = document.querySelector('#level');
const scoreCoverResultElem = document.querySelector('#score-cover-result');
const scoreCoverElem = document.querySelector('#score-cover');
const scoreCoverBtns = document.querySelectorAll('.score-cover__btn');
const bestScore = document.querySelector('#score-cover-best');
const audioWrapper = document.querySelector('.audio');
const audio = document.querySelector('audio');
const playBtn = document.querySelector('.audio__icon');
let isPlay = false;
let level = 1;
let speed = 200;
let iterateList = [10, 20, 30, 40];
let ratingList = [];
let iterations= 0;

function playGameAudio() {
    gamer.focus();
    audio.src = 'audio/audio1.mp3';
    audio.currentTime = 0;
    audio.play();

    if(!isPlay) {
        audio.play();
        isPlay = true;
        playBtn.classList.remove('pause');
    } else {
        audio.pause();
        isPlay = false;
        playBtn.classList.add('pause');
    }
}

playBtn.addEventListener('click', playGameAudio);

function playLoosingGameAudio() {
    audio.currentTime = 0;
    audio.src = 'audio/titry-directed-by-fail.mp3'
    audio.play();

    if(!isPlay) {
        audio.play();
        isPlay = true;
    } else {
        audio.pause();
        isPlay = false;
    }
}

const hideGreetingWindow = () => {
    greetingWindow.classList.add('hidden');
}

const hideGreetings = () => {
    if (userName.value === '') {
        textDanger.style.opacity = '1';
    } else {
        greetingQuestion.classList.add('hidden');
        greetingUser.innerText = `Okay, ${userName.value}, let's start the game right now!`;
        greetingUser.classList.remove('hidden');

        setTimeout(hideGreetingWindow, 3000);
    }    
}

btnGreeting.addEventListener('click', hideGreetings);

const createEnemies = () => {
    const startPositions = ['0px', '250px', '500px'];
    for (let i = 0; i <= Math.round(Math.random()); i++) {
        const enemy = document.createElement('img');
        enemy.classList.add('enemy');
        enemy.src = 'images/pumpkin.png';
        gameArea.append(enemy);

        const index = i === 0 ? Math.round(Math.random() * 2) : Math.round(Math.random());
        enemy.style.top = startPositions.splice(index, 1);

        iterations++; 
        for (let i = 0; i < iterateList.length; i++ ) {
            if (iterations == iterateList[i]) {
                level++;
                levelElem.textContent = level;
                speed = speed - 40;             
            } 
        }
    }    
}

const gameOver = () => {
    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach((el) => {
        el.remove();
    });
    clearInterval(intervalID);
    gamer.removeEventListener('keydown', turn);

    scoreCoverResultElem.innerText = score;
    scoreCoverElem.classList.remove('hidden');
    wrapper.classList.remove('bg-animate');
    startBtn.classList.add('hidden');
    description.classList.add('hidden');
    scoreArea.classList.add('hidden');    
    
    window.localStorage.setItem('score', scoreElem.innerText);
    ratingList.push(score);    
    var maxScore = Math.max(...ratingList);
    bestScore.textContent = maxScore;
    window.localStorage.setItem('ratingList', JSON.stringify(ratingList));

    playGameAudio();
    playLoosingGameAudio();
}

scoreCoverBtns.forEach((el) => {    
    el.addEventListener('click', function() {
        if (el.classList.contains('score-cover__btn_one')) {
            greetingWindow.classList.add('hidden');
            startBtn.classList.remove('hidden'); 
            description.classList.remove('hidden'); 
            scoreCoverElem.classList.add('hidden');
            playLoosingGameAudio();          
        } 
        if (el.classList.contains('score-cover__btn_two')) {
            startBtn.classList.remove('hidden');
            description.classList.remove('hidden'); 
            scoreCoverElem.classList.add('hidden');
            greetingWindow.classList.remove('hidden');
            greetingQuestion.classList.remove('hidden');
            greetingUser.classList.add('hidden');
            audioWrapper.classList.add('hidden');
            playLoosingGameAudio();          
            //userName.value = '';
        }
    });
})

const animateEnemies = () => {
    const enemies = document.querySelectorAll('.enemy');
    const currentLeftPosition = +getComputedStyle(enemies[0]).left.split('px')[0];
    
    if (currentLeftPosition <= -165) {

        enemies.forEach((el) => {
            score++;
            el.remove();
        });
        
        if (level >= 0) {
            clearInterval(intervalID);
            intervalID = setInterval(animateEnemies, speed);
        }

        scoreElem.innerText = score;
        createEnemies();
    }
    else {
        enemies.forEach((el) => {
            if (currentLeftPosition <= 165) {
                const currentTopPosition = +getComputedStyle(el).top.split('px')[0];
                const currentPosition = +getComputedStyle(gamer).top.split('px')[0];

                if (currentPosition === currentTopPosition) {
                    gameOver();
                    return;
                }
            }
            const currentRightPosition = +getComputedStyle(el).right.split('px')[0];
            el.style.right = `${currentRightPosition + (165 / 4)}px`;
        });
    }
}

let intervalID = 0;
const startEnemies = () => {
    // create enemies
    createEnemies();
    // animate enemies
    intervalID = setInterval(animateEnemies, 200);
}

const turn = (event) => {
    const enemies = document.querySelectorAll('.enemy');
    const currentPosition = +getComputedStyle(gamer).top.split('px')[0];

    if (event.keyCode === 38 && currentPosition > 0) {
        gamer.style.top = `${currentPosition - 250}px`;
        enemies.forEach((el) => {
            const currentLeftPosition = +getComputedStyle(el).left.split('px')[0];
            if (currentLeftPosition < 165) {
                const currentTopPosition = +getComputedStyle(el).top.split('px')[0];
                if (currentTopPosition === currentTopPosition) {
                    gameOver();
                }
            }
        })
    } else if (event.keyCode === 40 && currentPosition < 254) {
        gamer.style.top = `${currentPosition + 250}px`;
        enemies.forEach((el) => {
            const currentLeftPosition = +getComputedStyle(el).left.split('px')[0];
            if (currentLeftPosition < 165) {
                const currentTopPosition = +getComputedStyle(el).top.split('px')[0];
                if (currentPosition === currentTopPosition) {
                    gameOver();
                }
            }
        })
    }
}

startWrapper.addEventListener('click', () => {
    playGameAudio();
    //playLoosingGameAudio();  
    startBtn.classList.add('hidden');
    description.classList.add('hidden'); 
    scoreArea.classList.remove('hidden');
    audioWrapper.classList.remove('hidden');
    resetGame();
    gamer.addEventListener('keydown', turn);
    gamer.focus();
    wrapper.classList.add('bg-animate');
    startEnemies();
})

const resetGame = () => {
    score = 0;
    speed = 200;
    level = 1;
    levelElem.textContent = '1';
    scoreElem.innerText = score;
    scoreCoverElem.classList.add('hidden');
}

function setLocalStorage() {
    localStorage.setItem('name', userName.value);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
    if (localStorage.getItem('name')) {
        userName.value = localStorage.getItem('name');
    }
}
window.addEventListener('load', getLocalStorage);