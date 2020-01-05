const app = () => {

    //inicjacja stałych
    const song = document.querySelector(".song");
    const outline = document.querySelector(".moving-outline circle");
    const video = document.querySelector(".vid-container video");
    const play = document.querySelector(".play");
    const playerHeader = document.querySelector(".player-header");
    let timer = 10;

    video.play();
    //Wybór dźwięków 
    const sounds = document.querySelectorAll(".sound-picker button");

    //Wybór czasu medytacji
    const timeDisplay = document.querySelector(".time-display");
    const timeSelect = document.querySelectorAll(".time-select button");
    //Zmienna potrzebna do zmiany 'długości' obręczy w zależności od czasu
    const outlineLenght = outline.getTotalLength();
    
    //'Fałszywa' długość ścieżki dźwiękowej, aby była dopasowana do długości czasu medytacji
    //Ustawiona na 10 min, czyli max czas
    let fakeDuration = 600;

    outline.style.strokeDasharray = outlineLenght;
    outline.style.strokeDashoffset = outlineLenght;

    //Wybór dźwięków przez kliknięcie przycisku
    sounds.forEach(sound =>{
        sound.addEventListener('click', function(){
            song.pause();
            song.src = this.getAttribute("data-sound");
            checkPlaying(song);
        });
    });

    //Kliknięcie przycisku play
    play.addEventListener('click', () => {
        checkPlaying(song);
    });

    //Wybór długości medytacji 
    timeSelect.forEach(option => {
        option.addEventListener('click', function(){
            fakeDuration = this.getAttribute("data-time");
            timeDisplay.textContent = `${Math.floor(fakeDuration/60)}:${Math.floor(fakeDuration % 60)}`;
        });
    });

    //Zmiana przycisku z play na pause podczas trwania medytacji
    function meditate(){
        clearInterval(countdown);
        timer = 10;
        song.play();
        play.src = "./Img/pause.svg";
        playerHeader.textContent = ``;
    }

    //Funkcja zatrzymująca/startująca muzykę i czas w zależności od tego czy medytacja trwa czy nie
    const checkPlaying = song =>{
        if(song.paused && timer==10){
            
            //setTimeout() i setInterval() użyte w celu odliczania 10 sek przed rozpoczęciem medytacji
            setTimeout(() => {
                meditate();
            }, 11000);

            countdown = setInterval(function(){
                playerHeader.textContent = `Meditation starts in ${timer} seconds`;
                timer--;
            }, 1000);
        }else{
            song.pause();
            play.src = "./Img/play-arrow.svg";
        }
    }

    //Funkcja zatrzymująca dźwięk przy końcu czasu i ustawiająca z powrotem przycisk play zamiast pause
    song.ontimeupdate = () => {
        let currentTime = song.currentTime;
        let elapsed = fakeDuration - currentTime;
        let seconds = Math.floor(elapsed % 60);
        let minutes = Math.floor(elapsed / 60);

        //Animate the circle
        let progress = outlineLenght - (currentTime/fakeDuration) * outlineLenght;
        outline.style.strokeDashoffset = progress;

        //Animate the text
        timeDisplay.textContent = `${minutes}:${seconds}`;

        if(currentTime >= fakeDuration){
            song.pause();
            song.currentTime = 0;
            play.src ='./Img/play-arrow.svg';
        }
    };
};

app();
