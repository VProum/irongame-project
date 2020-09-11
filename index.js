import { Board, Card, Player } from "./js/classes.js"

console.log("js loaded");

const audioBackground = document.getElementById("audio");
const audioVictory = new Audio("./sounds/victory.wav");
const audioDefeat = new Audio("./sounds/naruto-sad.mp3");
const audioBomb = new Audio("./sounds/explosion.mp3");
const audioWire = new Audio("./sounds/grun_amp.wav");
const audioWin = new Audio("./sounds/metal-slug_amp.wav");
const audioSharingan = new Audio("./sounds/sharingan.wav");
const audioShuffle = new Audio("./sounds/shuffle.mp3");
const audioScissor = new Audio("./sounds/scissors.mp3");

audioWin.onended = function() {
    audioVictory.play();
};


//#region declaration of variables && eventlistener
const htmlTitle = document.getElementById("title");
const homePage = document.getElementById("main-page");
const gamePage = document.getElementById("game-page");
const soloOptPage = document.getElementById("solo-option-page");
const multiOptPage = document.getElementById("multi-option-page");
const tutorialPage = document.getElementById("tutorial-page");

const pages = [homePage, gamePage, soloOptPage, multiOptPage, tutorialPage];
const tutorialPages = [];

const winPopup = document.getElementById("win-popup");
const losePopup = document.getElementById("lose-popup");
const claimPopup = document.getElementById("claim-popup");
const winMsg = document.getElementById("win-msg");
const loseMsg = document.getElementById("lose-msg");
const winBtn = document.getElementById("close-win");
const loseBtn = document.getElementById("close-lose");
const claimBtn = document.getElementById("claim-set");
const claimCloseBtn = document.getElementById("claim-close");

winBtn.onclick = closePopup;
loseBtn.onclick = closePopup;
claimBtn.onclick = setClaim;
claimCloseBtn.onclick = closePopup;

const htmlTutorial = document.getElementById("tutorial");
const htmlSingleplayer = document.getElementById("singleplayer");
const htmlMultiplayer = document.getElementById("multiplayer");
const htmlMainSection = document.getElementById("main-section");

htmlTutorial.onclick = tutorialClkHandler;
htmlSingleplayer.onclick = singleplayerClkHandler;
htmlMultiplayer.onclick = multiplayerClkHandler;

const htmlSoloForm = document.getElementById("solo-form");
const htmlMultiForm = document.getElementById("multi-form");
const htmlMultiStart = document.getElementById("multi-start");
const htmlMultiStartTxt = document.getElementById("multi-start-txt");
const htmlMultiNbPlayer = document.getElementById("multi-nb-players");
const htmlMultiNbHuman = document.getElementById("multi-nb-human");
const htmlMultiClaim = document.getElementById("multi-claim");
const htmlIALvl = document.getElementById("ia-lvl");
const htmlRadioIaLvl = document.querySelectorAll('input[name="IALvl"]');
const htmlSoloName = document.getElementById("solo-name");
let htmlSoloNbPlayer = document.getElementById("solo-nb-players");
const htmlSoloClaim = document.getElementById("solo-claim");
const htmlEasyDiv = document.getElementById("solo-easy");
const htmlNormalDiv = document.getElementById("solo-normal");
const htmlHardDiv = document.getElementById("solo-hard");
const htmlSoloTxt = document.getElementById("option-txt");

htmlMultiNbHuman.onchange = nbHumanChangeHandler;

const htmlClaimForm = document.getElementById("claim-form");
const htmlClaimWire = document.getElementById("claim-wire");
const htmlClaimBomb = document.getElementById("claim-bomb");

htmlMultiStart.onclick = multiClkHandler;
htmlEasyDiv.onclick = soloClkHandler;
htmlNormalDiv.onclick = soloClkHandler;
htmlHardDiv.onclick = soloClkHandler;
htmlEasyDiv.onmouseover = easyOverHandler;
htmlNormalDiv.onmouseover = normalOverHandler;
htmlHardDiv.onmouseover = hardOverHandler;

const htmlBoard = document.getElementById("board");
const htmlUsedCards = document.getElementById("used-cards");

let htmlPlayers = document.querySelectorAll(".player");
let htmlHands = document.querySelectorAll(".hand");
let htmlPlayerInfos = document.querySelectorAll(".infos");
let htmlPlayerName = document.querySelectorAll(".name");
let htmlPlayerWireBomb = document.querySelectorAll(".wire-bomb");
let htmlCards = document.querySelectorAll(".card");
let htmlRoles = document.querySelectorAll(".card-role");
let htmlScissors = document.querySelectorAll(".card-scissor");
let htmlNbWire = document.getElementById("nb-wire-span");
let htmlNbNeutral = document.getElementById("nb-neutral-span");
let htmlMultiHumanNames = document.querySelectorAll(".multi-name-player")

const shuffleBtn = document.getElementById("shuffle-btn");
const resetBtn = document.querySelectorAll(".reset-btn");
const restartBtn = document.getElementById("restart-btn");
const returnBtn = document.getElementById("return-btn");
const menuBtn = document.querySelectorAll(".menu-btn");

shuffleBtn.onclick = shuffleBtnClickHandler;
resetBtn.forEach(button => button.onclick = resetBtnClickHandler);
restartBtn.onclick = () => document.location.reload(true);
returnBtn.onclick = returnHandler;
menuBtn.forEach(button => button.onclick = menuClkHAndler);

document.querySelectorAll(".close").forEach(button => button.onclick = closePopup);

let board;
let nbplayer = 7;
let rolescard = [true, true, true, false, false]; //3 blue, 2 red
let playerNames = [];
let isClaim = true;
let iALvlstr = "Easy";
let playerClaim;

const htmlTutoPlayers = document.querySelectorAll(".tuto-player");
const htmlTutoHands = document.querySelectorAll(".tuto-hand");
const htmlTutoPlayerInfos = document.querySelectorAll(".tuto-infos");
const htmlTutoPlayerName = document.querySelectorAll(".tuto-name");
const htmlTutoPlayerWireBomb = document.querySelectorAll(".tuto-wire-bomb");
const htmlTutoCards = document.querySelectorAll(".tuto-card");
const htmlTutoRoles = document.querySelectorAll(".tuto-card-role");
const htmlTutoScissors = document.querySelectorAll(".tuto-card-scissor");

//#endregion

function setClaim() {
    if (htmlClaimForm.checkValidity()) {
        playerClaim.innerText = `Wires: ${htmlClaimWire.value} - Bomb: ${htmlClaimBomb.checked ? "YES" : "NO"}`;
        closePopup();
    }
}

function returnCard(card) {
    htmlCards = document.querySelectorAll(".card"); //update the card
    let playercard = card.parentElement.querySelectorAll(".card"); //select card that is on hand of player

    flipCard(card);
    setCard(card, board.remainingCards[getIndexCards(card)]);
    //sound if wire
    if (board.remainingCards[getIndexCards(card)].isWire) audioWire.play();
    else audioScissor.play();

    board.usedCards.push(board.remainingCards[getIndexCards(card)]);
    board.usedCards = [...new Set(board.usedCards)]; //dont add if the card is already there
    board.turnCards.push(getIndexCards(card));

    //define new current player
    board.activeplayer = board.players.filter(player => player.hand.includes(board.remainingCards[getIndexCards(card)]))[0];

    board.endTurn();

    //new round?
    if (board.turn === 0) { //new round, shuffle remaining card and distribute
        board.endRound();
        //remove return card from remaining cards
        setTimeout(() => { //careful, status is updated after 350 ms....
            board.remainingCards = board.remainingCards.filter(card => !card.isReturned);
            board.shuffleCards();
            giveCards(5 - board.round);
            setHtmlCurrentPlayer();
            setTimeout(() => {
                playercard = card.parentElement.querySelectorAll(".card");
                playercard.forEach(card => card.classList.add("remove-events"));
            }, 100);
        }, 500); // we have to wait for the status to update before filterring
    }

    displayStatus();
    setHtmlCurrentPlayer(card);

    htmlCards.forEach(card => card.classList.remove("remove-events"));
    playercard.forEach(card => card.classList.add("remove-events"));

    console.log("don't look, you cheater!", board);

    setTimeout(() => {
        if (board.isGameOver() === -1) { //red wins
            losePopup.classList.remove("hidden");
            showAllCards();
            audioBomb.play();
            audioDefeat.play();
            audioBackground.pause();
            audioBackground.currentTime = 0;

        } else if (board.isGameOver() === 1) {
            winPopup.classList.remove("hidden");
            showAllCards();
            audioWin.play();
            audioBackground.pause();
            audioBackground.currentTime = 0;

        } else if (board.activeplayer.isIA) {
            setTimeout(() => {
                console.log("ia playing");
                returnCard(htmlCards[board.playEasy()]);
            }, 1000);
        }
    }, 550);
}

//#region handlers
function menuClkHAndler() {
    show(homePage);
    closePopup();
}

function cardClickHandler(event) {
    returnCard(event.target);
}

function nbHumanChangeHandler(event) {

    while (event.target.nextElementSibling) {
        event.target.nextElementSibling.remove();
    }

    let div = document.createElement("div");
    let span = document.createElement("span");
    let input = document.createElement("input");

    htmlSoloNbPlayer = document.getElementById("multi-nb-players");

    let maxHuman = Math.min(htmlMultiNbHuman.value, htmlSoloNbPlayer.value);

    for (let i = 1; i <= maxHuman; i++) {
        div = document.createElement("div");
        span = document.createElement("span");
        input = document.createElement("input");
        span.innerText = `Enter the name of player ${i} (12 characters max): `;
        div.appendChild(span);
        input.type = "text";
        input.maxLength = "12";
        input.classList.add(`multi-name-player`);
        div.appendChild(input);
        event.target.parentElement.append(div);
    }
}

function shuffleBtnClickHandler() {
    board.shuffleCards();

    htmlCards.forEach(htmlcard => {
        setHtmlCard(board.remainingCards[index], htmlcard);
        //animation
        htmlcard.classList.add("wobble");
        htmlcard.classList.remove("flip-card");
        setTimeout(() => htmlcard.classList.remove("wobble"), 800);
    });
}

function resetBtnClickHandler() {
    let index = 0;
    //set all card to recto and show refresh animation
    htmlCards.forEach(htmlcard => {
        setHtmlCard(board.remainingCards[index], htmlcard);
        //animation
        htmlcard.classList.add("wobble");
        htmlcard.classList.remove("flip-card");
        setTimeout(() => htmlcard.classList.remove("wobble"), 800);
        index++;
    });

    init();
    closePopup();
    audioDefeat.pause();
    audioVictory.pause();
    audioDefeat.currentTime = 0;
    audioVictory.currentTime = 0;
    audioBackground.play();
}

function tutorialClkHandler() {
    show(tutorialPage);
    initTuto();
    audioDefeat.pause();
    audioVictory.pause();
    audioDefeat.currentTime = 0;
    audioVictory.currentTime = 0;
    audioBackground.play();
}

function singleplayerClkHandler() {
    show(soloOptPage);
    htmlTitle.innerText = "Single Player";
    audioDefeat.pause();
    audioVictory.pause();
    audioDefeat.currentTime = 0;
    audioVictory.currentTime = 0;
    audioBackground.play();
}

function multiplayerClkHandler() {
    htmlTitle.innerText = "Local Multi Player";
    show(multiOptPage);
    audioDefeat.pause();
    audioVictory.pause();
    audioDefeat.currentTime = 0;
    audioVictory.currentTime = 0;
    audioBackground.play();
}

function closePopup() {
    winPopup.classList.add("hidden");
    losePopup.classList.add("hidden");
    claimPopup.classList.add("hidden");
}

function soloClkHandler() {
    if (getSoloParameters()) {
        show(gamePage);
        init();
    } else {
        htmlSoloTxt.innerText = "Wrong Parameter :(";
    }
}

function multiClkHandler() {
    if (getMultiParameters()) {
        show(gamePage);
        init();
    } else htmlMultiStartTxt.innerHTML = "Wrong Parameter :("
}

function easyOverHandler() {
    htmlSoloTxt.innerHTML = "EASY MODE: <br> The IA is counting on luck to win";
    iALvlstr = "Easy";
}

function normalOverHandler() {
    htmlSoloTxt.innerHTML = "NORMAL MODE: <br> The IA is looking at your claims to win";
    iALvlstr = "Normal";
}

function hardOverHandler() {
    htmlSoloTxt.innerHTML = "HARD MODE: <br> The IA is optimised to win";
    iALvlstr = "Hard";
}

function playerInfoClkHandler(event) {
    if (isClaim) {
        claimPopup.classList.remove("hidden");
    }
    playerClaim = event.target;
}

//#endregion 



//iife for initialisation of the board ?
function init() {
    board = new Board();
    htmlBoard.innerHTML = "";

    //getSoloParameters();
    displayStatus()

    //init rolecard (depends on number of players)
    if (nbplayer === 6) {
        rolescard = [true, true, true, true, false, false]; //4 blue, 2 red
    } else if (nbplayer > 6) {
        rolescard = [true, true, true, true, true, false, false, false]; //5 blue, 3 red
    }
    rolescard = board.shuffle(rolescard);
    let isIa = false;
    let j = 1;
    board.players = [];
    //adding html players and hand
    for (let i = 0; i < nbplayer; i++) {
        //adding players to board
        let newplayer = new Player(playerNames[i] === undefined ? `Player ${i}` : playerNames[i], rolescard[i], i, isIa)
        if (newplayer.isIA) {
            newplayer.name = `${iALvlstr} IA ${j}`;
            j++;
        }
        board.players.push(newplayer);

        const div = document.createElement("div");
        div.classList.add("player");
        htmlBoard.appendChild(div);
        isIa = i >= playerNames.length - 1 ? true : false;
    }
    htmlPlayers = document.querySelectorAll(".player");

    //creating html template
    let i = 0;
    htmlPlayers.forEach(player => {
        let div = document.createElement("div");
        div.classList.add("infos");

        let h2 = document.createElement("h2");
        h2.classList.add("name");
        h2.innerText = board.players[i].name;
        div.appendChild(h2);

        h2 = document.createElement("h2");
        h2.classList.add("wire-bomb");
        h2.classList.add("remove-events");
        div.appendChild(h2);
        player.appendChild(div);

        div = document.createElement("div");
        div.classList.add("horizontal-container", "hand");
        player.appendChild(div);
        i++;
    });

    htmlHands = document.querySelectorAll(".hand");
    htmlPlayerInfos = document.querySelectorAll(".infos");
    htmlPlayerName = document.querySelectorAll(".name");
    htmlPlayerWireBomb = document.querySelectorAll(".wire-bomb");

    //setting claims functionnality (adding handler only if player is human)
    i = 0;
    htmlPlayerInfos.forEach(playerinfo => {
        if (!board.players[i].isIA) {
            playerinfo.querySelector(".wire-bomb").classList.remove("remove-events");
            playerinfo.querySelector(".wire-bomb").onclick = playerInfoClkHandler;
        }
        i++;
    });

    //calculating number of card required and pushing them to the array
    board.cards.push(new Card("bomb"));
    for (let i = 0; i < nbplayer; i++) {
        board.cards.push(new Card("wire"));
    }
    for (let i = 0; i < nbplayer * 4 - 1; i++) {
        board.cards.push(new Card("neutral"));
    }

    board.remainingCards = board.cards;
    board.shuffleCards();

    //adding card to the hand of players (fixed to 5 cards)
    giveCards(5);

    //animations
    htmlCards.forEach(card => {
        setCardToRecto(card);
        card.classList.add("wobble");
        card.classList.remove("flip-card");
        setTimeout(() => card.classList.remove("wobble"), 800);
    });

    //init win/lose msg
    board.getBlueTeam().forEach(player => { winMsg.innerText += `${player.name}, ` });
    board.getRedTeam().forEach(player => { loseMsg.innerText += `${player.name}, ` });
    winMsg.innerText = loseMsg.innerText.slice(0, -2);
    loseMsg.innerText = loseMsg.innerText.slice(0, -2);

    console.log("don't look, you cheater!", board);
}


//#region Html class manipulation

function show(section) {
    pages.forEach(page => page.classList.add("hidden"));
    section.classList.remove("hidden");
};

function createHtmlCard(card, targetparent) {
    const div = document.createElement("div");
    div.classList.add("card");
    div.classList.add("neutral");
    div.classList.add("recto");
    targetparent.appendChild(div);
    //targetparent.innerHTML += `<div class="card neutral recto"> A </div>`;
    setHtmlCard(card, targetparent.lastChild);
    htmlCards = document.querySelectorAll(".card"); //update the array of card
}

//notes : no need to update classes states, it is handle within the click handler
function setCardToRecto(htmlcard) {
    htmlcard.classList.add("recto");
}

function setCardToNeutral(htmlcard) {
    htmlcard.classList.remove("recto");
    htmlcard.classList.add("neutral");
    htmlcard.classList.remove("bomb");
    htmlcard.classList.remove("wire");
}

function setCardToBomb(htmlcard) {
    htmlcard.classList.remove("recto");
    htmlcard.classList.remove("neutral");
    htmlcard.classList.add("bomb");
    htmlcard.classList.remove("wire");
}

function setCardToWire(htmlcard) {
    htmlcard.classList.remove("recto");
    htmlcard.classList.remove("neutral");
    htmlcard.classList.remove("bomb");
    htmlcard.classList.add("wire");
}

function flipCard(eventtarget) {
    eventtarget.classList.add("flip-card");

    //add sound!!!!!

    setTimeout(() => {
        board.remainingCards[getIndexCards(eventtarget)].isReturned = !board.remainingCards[getIndexCards(eventtarget)].isReturned;
        eventtarget.classList.toggle("recto");
    }, 350);

    setTimeout(() => eventtarget.classList.remove("flip-card"), 450);
}

//find a more generic way?
function setHtmlCard(card, htmlcard) {
    //add classes
    if (card.isBomb) {
        setCardToBomb(htmlcard);
    } else if (card.isWire) {
        setCardToWire(htmlcard);
    } else {
        setCardToNeutral(htmlcard);
    }
    if (!card.isReturned) {
        setCardToRecto(htmlcard);
    }


}

function setCard(htmlcard, card) {
    card.isReturned = !htmlcard.classList.contains("recto");
}

//compare === with array of div to get index
function getIndexCards(card) {
    let index = 0;
    for (let htmlcard of htmlCards) {
        if (!(htmlcard === card)) {
            index++;
        } else if ((htmlcard === card)) {
            return index;
        }
    }
    console.log("card is not found");
    return -1;
}

function getIndexCurrentPlayer() {
    let index = 0;
    for (let player of board.players) {
        if (!(player === board.activeplayer)) {
            index++;
        } else if ((player === board.activeplayer)) {
            return index;
        }
    }
    console.log("player is not found");
    return -1;
}

//function to distribute role to the players
function createHtmlRoles(index, rolearray, targetparent) {
    const div = document.createElement("div");
    div.classList.add("card-role");
    div.classList.add("back-role");
    // add according role to element
    rolearray[index] ? div.classList.add("blue-role") : div.classList.add("red-role");
    targetparent.appendChild(div);
    htmlRoles = document.querySelectorAll(".card-role"); //update the array of card
    htmlRoles.forEach(htmlRole => {
        htmlRole.onmousedown = showPlayerCards;
        htmlRole.onmouseup = hidePlayerCards;
        htmlRole.onmouseout = hidePlayerCards;
    });
}

//function to create the scissors card
function createHtmlScissor(targetparent) {
    const div = document.createElement("div");
    div.classList.add("card-scissor");
    div.classList.add("hidden");
    div.innerHTML = "<h3>Current Player</h3>";
    targetparent.appendChild(div);
    htmlScissors = document.querySelectorAll(".card-scissor");
}

//function to get the scissor card when we click on a card
function setHtmlCurrentPlayer() {
    htmlScissors.forEach(scissor => scissor.classList.add("hidden"));
    htmlScissors[getIndexCurrentPlayer()].classList.remove("hidden");
    htmlPlayers.forEach(player => player.classList.remove("current-player"));
    htmlPlayers[getIndexCurrentPlayer()].classList.add("current-player");
}

//function to distribute card to the players
function giveCards(handsize) {
    htmlHands = document.querySelectorAll(".hand");
    htmlHands.forEach(player => player.innerHTML = "");

    let j = 0; //index of remainingcards
    let k = 0; //index of board.players

    audioShuffle.play();

    htmlHands.forEach(player => {
        createHtmlRoles(k, rolescard, player);
        createHtmlScissor(player);
        board.players[k].hand = []; //reset player hand
        //htmlPlayerInfos[k].innerText = ""; //reset player infos
        htmlPlayerName[k].innerText = "";
        htmlPlayerWireBomb[k].innerText = "";

        for (let i = 0; i < handsize; i++) {
            createHtmlCard(board.remainingCards[j], player);
            board.players[k].hand.push(board.remainingCards[j]);
            j++;
        }
        //htmlPlayerInfos[k].innerText = `${board.players[k].name} Wire: ${board.players[k].hand.filter(card => card.isWire).length} - Bomb: ${board.players[k].hand.filter(card => card.isBomb).length === 1 ? "YES" : "NO"}`;
        htmlPlayerName[k].innerText = board.players[k].name;

        let claimStr = board.players[k].isIA ? `Wire: ${board.players[k].hand.filter(card => card.isWire).length} ~ Bomb: ${board.players[k].hand.filter(card => card.isBomb).length === 1 ? "YES" : "NO"}` : "Claim ?";
        //if claims
        htmlPlayerWireBomb[k].innerText = isClaim ? claimStr : "";

        k++;
    });

    //htmlCards.forEach(card => card.onclick = cardClickHandler);

    htmlCards.forEach(card => {
        setCardToRecto(card);
        card.onclick = cardClickHandler
        card.classList.add("wobble");
        card.classList.remove("flip-card");
        setTimeout(() => card.classList.remove("wobble"), 800);
    });
}

//function to display status of the board
function displayStatus() {
    //display remaining cards (we have to wait for the animation to finish to complete)
    setTimeout(() => {
        //htmlUsedCards.innerHTML = "";
        //board.usedCards.forEach(card => createHtmlCard(card, htmlUsedCards));

        let roundStr = board.round === 3 ? "LAST ROUND !" : "Round " + (board.round + 1);
        let turnStr = (nbplayer - board.turn) === 1 ? "LAST CUT !" : "Cuts left before next round : " + (nbplayer - board.turn);
        htmlTitle.innerText = `${roundStr} //  ${turnStr} // Wires left : ${nbplayer - board.nbWire()}`; //todo update wire

        htmlNbWire.innerText = "X" + board.nbWire();
        htmlNbNeutral.innerText = "X" + board.nbNeutral();
    }, 355);
}

function getSoloParameters() {
    if (htmlSoloForm.checkValidity()) {
        nbplayer = htmlSoloNbPlayer.value;
        playerNames = [];
        playerNames.push(htmlSoloName.value ? htmlSoloName.value : "Anonymous");
        isClaim = htmlSoloClaim.checked;
        return true;
    } else return false;
}

function getMultiParameters() {
    if (htmlMultiForm.checkValidity()) {
        nbplayer = htmlMultiNbPlayer.value;
        playerNames = [];
        htmlMultiHumanNames = document.querySelectorAll(".multi-name-player");

        let i = 0;
        htmlMultiHumanNames.forEach(HtmlName => {
            playerNames.push(HtmlName.value ? HtmlName.value : `Player ${i}`);
            i++;
        });

        for (let IaLvl of htmlRadioIaLvl) {
            if (IaLvl.checked) {
                iALvlstr = IaLvl.value;
                break;
            }
        }

        isClaim = htmlMultiClaim.checked;
        return true;
    } else return false;
}

function returnHandler() {
    returnCard(htmlCards[0]);
}

function showPlayerCards(event) {
    let playerCards = event.target.parentElement.querySelectorAll(".card");
    playerCards.forEach(card => card.classList.remove("recto"));
    event.target.classList.remove("back-role");
    audioSharingan.play();
}

function hidePlayerCards(event) {
    htmlCards = document.querySelectorAll(".card");
    let playerCards = event.target.parentElement.querySelectorAll(".card");
    event.target.classList.add("back-role");

    playerCards.forEach(card => setHtmlCard(board.remainingCards[getIndexCards(card)], card));
}

function showAllCards() {
    htmlCards = document.querySelectorAll(".card");
    htmlCards.forEach(card => card.classList.remove("recto"));
    htmlRoles = document.querySelectorAll(".card-role");
    htmlRoles.forEach(card => card.classList.remove("back-role"));
}
//#endregion


function initTuto() {
    htmlTutoRoles.forEach(htmlRole => {
        htmlRole.onmousedown = showTutoPlayerCards;
        htmlRole.onmouseup = hideTutoPlayerCards;
        htmlRole.onmouseout = hideTutoPlayerCards;
    });
}

function showTutoPlayerCards(event) {
    let playerCards = event.target.parentElement.querySelectorAll(".tuto-card");
    playerCards.forEach(card => card.classList.remove("recto"));
    event.target.classList.remove("tuto-back-role");
    console.log(event.target);
    console.log(playerCards);
}

function hideTutoPlayerCards(event) {
    let playerCards = event.target.parentElement.querySelectorAll(".tuto-card");
    event.target.classList.add("tuto-back-role");

    playerCards.forEach(card => card.classList.add("recto"));
}