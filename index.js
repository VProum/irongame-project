import { Board, Card, Player } from "./js/classes.js"

console.log("js loaded");

const audio = document.getElementById("audio");

//#region declaration of variables && eventlistener
const htmlTitle = document.getElementById("title");
const homePage = document.getElementById("main-page");
const gamePage = document.getElementById("game-page");
const soloOptPage = document.getElementById("solo-option-page");
const multiOptPage = document.getElementById("multi-option-page");

const pages = [homePage, gamePage, soloOptPage, multiOptPage];

const winPopup = document.getElementById("win-popup");
const losePopup = document.getElementById("lose-popup");
const winMsg = document.getElementById("win-msg");
const loseMsg = document.getElementById("lose-msg");
const winBtn = document.getElementById("close-win");
const loseBtn = document.getElementById("close-lose");

winBtn.onclick = closePopup;
loseBtn.onclick = closePopup;

const htmlTutorial = document.getElementById("tutorial");
const htmlSingleplayer = document.getElementById("singleplayer");
const htmlMultiplayer = document.getElementById("multiplayer");
const htmlMainSection = document.getElementById("main-section");

htmlTutorial.onclick = tutorialClkHandler;
htmlSingleplayer.onclick = singleplayerClkHandler;
htmlMultiplayer.onclick = multiplayerClkHandler;

const htmlMultiStart = document.getElementById("multi-start");
const htmlMultiNbPlayer = document.getElementById("multi-nb-players");
const htmlMultiNbHuman = document.getElementById("multi-nb-human");
const htmlMultiClaim = document.getElementById("multi-claim");
const htmlIALvl = document.getElementById("ia-lvl");
const htmlRadioIaLvl = document.querySelectorAll('input[name="IALvl"]');
const htmlSoloName = document.getElementById("solo-name");
const htmlSoloNbPlayer = document.getElementById("solo-nb-players");
const htmlSoloClaim = document.getElementById("solo-claim");
const htmlEasyDiv = document.getElementById("solo-easy");
const htmlNormalDiv = document.getElementById("solo-normal");
const htmlHardDiv = document.getElementById("solo-hard");
const htmlSoloTxt = document.getElementById("option-txt");

htmlMultiNbHuman.onchange = nbHumanChangeHandler;

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
//let htmlPlayerInfos = document.querySelectorAll(".infos");
let htmlPlayerName = document.querySelectorAll(".name");
let htmlPlayerWireBomb = document.querySelectorAll(".wire-bomb");
let htmlCards = document.querySelectorAll(".card");
let htmlRoles = document.querySelectorAll(".card-role");
let htmlScissors = document.querySelectorAll(".card-scissor");
let htmlNbWire = document.getElementById("nb-wire-span");
let htmlNbNeutral = document.getElementById("nb-neutral-span");
let htmlMultiHumanNames = document.querySelectorAll(".multi-name-player")

const shuffleBtn = document.getElementById("shuffle-btn");
const resetBtn = document.getElementById("reset-btn");
const restartBtn = document.getElementById("restart-btn");
const returnBtn = document.getElementById("return-btn");

shuffleBtn.onclick = shuffleBtnClickHandler;
resetBtn.onclick = resetBtnClickHandler;
restartBtn.onclick = () => document.location.reload(true);
returnBtn.onclick = returnHandler;

let board;
let nbplayer = 7;
let rolescard = [true, true, true, false, false]; //3 blue, 2 red
let playerNames = [];
let isClaim = true;
let iALvlstr = "Easy";

//#endregion



function returnCard(card) {
    htmlCards = document.querySelectorAll(".card"); //update the card

    flipCard(card);
    setCard(card, board.remainingCards[getIndexCards(card)]);

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
        }, 500); // we have to wait for the status to update before filterring
    }

    displayStatus();
    setHtmlCurrentPlayer(card);
    console.log("don't look, you cheater!", board);

    setTimeout(() => {
        if (board.isGameOver() === -1) {
            losePopup.classList.remove("hidden");
            showAllCards();
        } else if (board.isGameOver() === 1) {
            winPopup.classList.remove("hidden");
            showAllCards();
        } else if (board.activeplayer.isIA) {
            setTimeout(() => {
                console.log("ia playing");
                returnCard(htmlCards[board.playEasy()]);
            }, 800);
        }
    }, 550);
}

//#region handlers
function cardClickHandler(event) {
    returnCard(event.target);
}

function nbHumanChangeHandler(event) {
    console.log(event);

    let div = document.createElement("div");
    let span = document.createElement("span");
    let input = document.createElement("input");

    for (let i = 1; i <= htmlMultiNbHuman.value; i++) {
        div = document.createElement("div");
        span = document.createElement("span");
        input = document.createElement("input");
        console.log(i);
        span.innerText = `Enter the name of player ${i} (4 to 12 characters):`;
        div.appendChild(span);
        input.type = "text";
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
}

function tutorialClkHandler() {
    console.log("tuto click");
    audio.play();
}

function singleplayerClkHandler() {
    show(soloOptPage);
    htmlTitle.innerText = "Single Player";
    audio.play();
}

function multiplayerClkHandler() {
    htmlTitle.innerText = "Local Multi Player";
    show(multiOptPage);
    audio.play();
}

function closePopup() {
    winPopup.classList.add("hidden");
    losePopup.classList.add("hidden");
}

function soloClkHandler() {
    getSoloParameters();
    show(gamePage);
    init();
}

function multiClkHandler() {
    getMultiParameters();
    show(gamePage);
    init();
}

function easyOverHandler() {
    htmlSoloTxt.innerText = "EASYYYYYYYYY";
    iALvlstr = "Easy";
}

function normalOverHandler() {
    htmlSoloTxt.innerText = "NOOOORRRRMMMAAAAAALLL";
    iALvlstr = "Normal";
}

function hardOverHandler() {
    htmlSoloTxt.innerText = "HAAAAAAAAAAAAAARD";
    iALvlstr = "Hard";
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
        div.appendChild(h2);
        player.appendChild(div);

        div = document.createElement("div");
        div.classList.add("horizontal-container", "hand");
        player.appendChild(div);
        i++;
    });

    htmlHands = document.querySelectorAll(".hand");
    //htmlPlayerInfos = document.querySelectorAll(".infos");
    htmlPlayerName = document.querySelectorAll(".name");
    htmlPlayerWireBomb = document.querySelectorAll(".wire-bomb");

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
}

//function to distribute card to the players
function giveCards(handsize) {
    htmlHands = document.querySelectorAll(".hand");
    htmlHands.forEach(player => player.innerHTML = "");

    let j = 0; //index of remainingcards
    let k = 0; //index of board.players

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

        //if claims
        htmlPlayerWireBomb[k].innerText = isClaim ? `Wire: ${board.players[k].hand.filter(card => card.isWire).length} ~ Bomb: ${board.players[k].hand.filter(card => card.isBomb).length === 1 ? "YES" : "NO"}` : "";

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
    //TODO : check if value is correct return false
    nbplayer = htmlSoloNbPlayer.value;
    playerNames = [];
    playerNames.push(htmlSoloName.value);
    isClaim = htmlSoloClaim.checked;
    return true;
    //claims is check...
}

function getMultiParameters() {
    //TODO : check if value is correct return false
    nbplayer = htmlMultiNbPlayer.value;
    playerNames = [];
    htmlMultiHumanNames = document.querySelectorAll(".multi-name-player");

    let i = 0;
    htmlMultiHumanNames.forEach(HtmlName => {
        playerNames.push(HtmlName.value === "" ? `Player ${i}` : HtmlName.value);
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
    //claims is check...
}

function returnHandler() {
    returnCard(htmlCards[0]);
}

function showPlayerCards(event) {
    let playerCards = event.target.parentElement.querySelectorAll(".card");
    playerCards.forEach(card => card.classList.remove("recto"));
    event.target.classList.remove("back-role");
}

function hidePlayerCards(event) {
    let playerCards = event.target.parentElement.querySelectorAll(".card");
    playerCards.forEach(card => card.classList.add("recto"));
    event.target.classList.add("back-role");
}

function showAllCards() {
    htmlCards = document.querySelectorAll(".card");
    htmlCards.forEach(card => card.classList.remove("recto"));
    htmlRoles = document.querySelectorAll(".card-role");
    htmlRoles.forEach(card => card.classList.remove("back-role"));
}
//#endregion