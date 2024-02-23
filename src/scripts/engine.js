const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    actions:{
        button: document.getElementById("next-duel"),
        muteBtn: document.getElementById("mute-icon"),
        tutorialBtn: document.getElementById("tutorial-icon"),
        tutotial_closeBtn: document.getElementById("tutotialBtn"),
    },
    playerSides:{
        player1: "player-cards",
        computer: "computer-cards",
        playerBox: document.querySelector("#player-cards"),
        computerBox: document.querySelector("#computer-cards"),
    },
    system:{
        bgMusic: document.getElementById("background-music"),
        tutorialBox: document.querySelector(".tutorial-box"),
        isFirstClick: true,
    },
};

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winOf: [0],
        LoseOf: [1],
    }
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide)  {
    const  cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player1){
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });

        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(idCard);
        });
    }

    return cardImage;
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCarId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCarId].img;

    let duelResults = await checkDuelResults(cardId, computerCarId);

    await updateScore();
    await drawButton(duelResults);
}

async function updateScore(text) {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function checkDuelResults(playerCardId, computerCarId) {
    let duelResults = "Draw";
    let playerCard = cardData[playerCardId];

    if(playerCard.winOf.includes(computerCarId)) {
        duelResults = "Win";
        state.score.playerScore++;
    }

    if(playerCard.LoseOf.includes(computerCarId)) {
        duelResults = "Lose";
        state.score.computerScore++;
    }

    await playAudio(duelResults, "wav", 1);

    return duelResults;
}

async function removeAllCardsImages() {
    let computerBox = state.playerSides.computerBox;
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    let playerBox = state.playerSides.playerBox;
    imgElements = playerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectedCard(idCard) {
    state.cardSprites.avatar.src = cardData[idCard].img;
    state.cardSprites.name.innerText = cardData[idCard].name;
    state.cardSprites.type.innerText = "Atribute: " + cardData[idCard].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

function playAudio(status, type, volume) {
    const audio = new Audio(`./src/assets/audios/${status}.${type}`);
    
    try {
        if(status == "Win"){
            audio.volume = 0.5;
        }
        else{
            audio.volume = volume;
        }
        audio.play();
    } catch (error) {
        console.log(error);
    }
}

function playBgMusic(bgMusic, volume) {
    bgMusic.volume = volume;
    bgMusic.play();
}

state.actions.muteBtn.addEventListener("click", () => {
    const bgMusic = state.system.bgMusic;
    const muteIcon = state.actions.muteBtn;

    if (!bgMusic.paused) {
        bgMusic.pause();
        muteIcon.classList.remove('fa-volume-high');
        muteIcon.classList.add('fa-volume-xmark');
    } else {
        playBgMusic(bgMusic, 0.3);
        muteIcon.classList.remove('fa-volume-xmark');
        muteIcon.classList.add('fa-volume-high');
    }
});

state.actions.tutotial_closeBtn.addEventListener("click", () => {
    const tutorialBox = state.system.tutorialBox;
    const bgMusic = state.system.bgMusic;
    const isFirstClick = state.system.isFirstClick;

    tutorialBox.style.display = "none";
    if (isFirstClick && bgMusic.paused) {
        playBgMusic(bgMusic, 0.3);
        state.system.isFirstClick = false;
    }
});

state.actions.tutorialBtn.addEventListener("click", () => {
    const tutorialBox = state.system.tutorialBox;

    tutorialBox.style.display = "flex";
});

function init() {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);
}

init();
