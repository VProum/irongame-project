import { Board, Card, Player } from "./js/classes.js"

console.log("js loaded");

//#region declaration of variables && eventlistener
const homePage = document.getElementById("main-page");
const gamePage = document.getElementById("game-page");
const soloOptPage = document.getElementById("solo-option-page");

const pages = [homePage, gamePage, soloOptPage];

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

const htmlSoloName = document.getElementById("solo-name");
const htmlSoloNbplayer = document.getElementById("solo-nb-players");
const htmlSoloClaim = document.getElementById("solo-claim");
const htmlEasyDiv = document.getElementById("solo-easy");
const htmlNormalDiv = document.getElementById("solo-normal");
const htmlHardDiv = document.getElementById("solo-hard");

htmlEasyDiv.onclick = soloClkHandler;
htmlNormalDiv.onclick = soloClkHandler;
htmlHardDiv.onclick = soloClkHandler;

const htmlBoard = document.getElementById("board");
const htmlRound = document.getElementById("round");
const htmlTurn = document.getElementById("turn");
const htmlUsedCards = document.getElementById("used-cards");
const htmlGameOver = document.getElementById("game-over");
const htmlCurrentPlayer = document.getElementById("current-player");

let htmlPlayers = document.querySelectorAll(".player");
let htmlHands = document.querySelectorAll(".hand");
let htmlPlayerInfos = document.querySelectorAll(".infos");
let htmlCards = document.querySelectorAll(".card");
let htmlRoles = document.querySelectorAll(".card-role");
let htmlScissors = document.querySelectorAll(".card-scissor");

const shuffleBtn = document.getElementById("shuffle-btn");
const resetBtn = document.getElementById("reset-btn");
const restartBtn = document.getElementById("restart-btn");
const clearBtn = document.getElementById("clear-btn");

shuffleBtn.onclick = shuffleBtnClickHandler;
resetBtn.onclick = resetBtnClickHandler;
restartBtn.onclick = () => document.location.reload(true);
//clearBtn.onclick = boardClear;

let board;
let nbplayer = 7;
let rolescard = [true, true, true, false, false]; //3 blue, 2 red
let playerNames = [];

//#endregion

//#region handlers
function cardClickHandler(event) {
    flipCard(event); //animation for card flip and adding css class
    setCard(event.target, board.remainingCards[getIndexCards(event.target)]);

    board.usedCards.push(board.remainingCards[getIndexCards(event.target)]);
    board.usedCards = [...new Set(board.usedCards)]; //dont add if the card is already there
    //board.remainingCards.splice(getIndexCards(event.target), 1); //issue, if we remove the array, the click dont work on the last cards

    //not working?
    event.target.removeEventListener("click", cardClickHandler);

    board.endTurn();

    //define new current player
    htmlCurrentPlayer.innerHTML = board.players.filter(player => player.hand.includes(board.remainingCards[getIndexCards(event.target)]))[0].name;

    console.log(getIndexCards(event.target));
    //new round
    if (board.turn === 0) { //new round, shuffle remaining card and distribute
        board.round++;
        //remove return card from remaining cards
        setTimeout(() => { //careful, status is updated after 350 ms....
            board.remainingCards = board.remainingCards.filter(card => !card.isReturned);
            board.shuffleCards();
            giveCards(5 - board.round);
        }, 500); // we have to wait for the status to update before filterring

    }
    displayStatus();
    setHtmlCurrentPlayer(event.target);
    console.log(board);
    setTimeout(() => {
        if (board.isGameOver() === -1) losePopup.classList.remove("hidden");
        else if (board.isGameOver() === 1) winPopup.classList.remove("hidden");
    }, 500);
}

function shuffleBtnClickHandler() {
    console.log("shuffle click");
    let index = 0;

    board.shuffleCards();

    htmlCards.forEach(htmlcard => {
        setHtmlCard(board.remainingCards[index], htmlcard);
        index++;
        //animation
        htmlcard.classList.add("wobble");
        htmlcard.classList.remove("flip-card");
        setTimeout(() => htmlcard.classList.remove("wobble"), 800);
    });
}

function resetBtnClickHandler() {
    console.log("reset click");
    //set all card to recto and show refresh animation
    init();
}

function tutorialClkHandler() {
    console.log("tuto click");
}

function singleplayerClkHandler() {
    console.log("single click");
    show(soloOptPage);
}

function multiplayerClkHandler() {
    console.log("multi click");
    show(gamePage);
    init();
}

function closePopup() {
    winPopup.classList.add("hidden");
    losePopup.classList.add("hidden");
}

function soloClkHandler() {
    console.log("solo level click");
    getSoloParameters();
    show(gamePage);
    init();
}

//#endregion 



//iife for initialisation of the board ?
function init() {
    board = new Board();
    htmlBoard.innerHTML = "";

    //getSoloParameters();

    //init rolecard (depends on number of players)
    if (nbplayer === 6) {
        rolescard = [true, true, true, true, false, false]; //4 blue, 2 red
    } else if (nbplayer > 6) {
        rolescard = [true, true, true, true, true, false, false, false]; //5 blue, 3 red
    }
    rolescard = board.shuffle(rolescard);

    //adding html players and hand
    for (let i = 0; i < nbplayer; i++) {
        //adding players to board
        board.players.push(new Player(`Player ${i}`, rolescard[i]));

        const div = document.createElement("div");
        div.classList.add("player");
        htmlBoard.appendChild(div);
        //htmlBoard.innerHTML += `<div id="player${i}" class="horizontal-container hand"></div>`;
    }
    htmlPlayers = document.querySelectorAll(".player");

    let i = 0;
    htmlPlayers.forEach(player => {

        const h2 = document.createElement("h2");
        h2.classList.add("infos");
        h2.innerText = board.players[i].name;
        player.appendChild(h2);

        const div = document.createElement("div");
        div.classList.add("horizontal-container");
        div.classList.add("hand");
        player.appendChild(div);
        i++;
    });

    htmlHands = document.querySelectorAll(".hand");
    htmlPlayerInfos = document.querySelectorAll(".infos");
    htmlCurrentPlayer.innerText = board.players[0].name;

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
        card.classList.remove("flip-card");
    });

    console.log(board);
}


//#region Html class manipulation

function boardClear() {
    htmlBoard.innerHTML = "";
}

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

function flipCard(event) {
    event.target.classList.add("flip-card");

    //add sound!!!!!

    setTimeout(() => {
        board.remainingCards[getIndexCards(event.target)].isReturned = !board.remainingCards[getIndexCards(event.target)].isReturned;
        event.target.classList.toggle("recto");
    }, 350);

    setTimeout(() => event.target.classList.remove("flip-card"), 450);
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
            //console.log("index of card is : ", index);
            return index;
        }
    }
    console.log("card is not found");
    return -1;
}

//function to distribute role to the players
function createHtmlRoles(index, rolearray, targetparent) {
    const div = document.createElement("div");
    div.classList.add("card-role");
    //div.classList.add("recto-role");
    // add according role to element
    rolearray[index] ? div.classList.add("blue-role") : div.classList.add("red-role");
    targetparent.appendChild(div);
    htmlRoles = document.querySelectorAll(".card-role"); //update the array of card
}

//function to create the scissors card
function createHtmlScissor(targetparent) {
    const div = document.createElement("div");
    div.classList.add("card-scissor");
    div.classList.add("hidden");
    div.innerHTML = "Current Player";
    targetparent.appendChild(div);
    htmlScissors = document.querySelectorAll(".card-scissor");
}

function setHtmlCurrentPlayer(eventtarget) {
    htmlScissors.forEach(scissor => scissor.classList.add("hidden"));
    let siblings = getSiblings(eventtarget);
    siblings[1].classList.remove("hidden");
}

//function to get the scissor card when we click on a card
function getSiblings(elem) {

    // Setup siblings array and get the first sibling
    let siblings = [];
    let sibling = elem.parentNode.firstChild;

    // Loop through each sibling and push to the array
    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== elem) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling
    }
    return siblings;
};

//function to distribute card to the players
function giveCards(handsize) {
    htmlHands = document.querySelectorAll(".hand");
    htmlHands.forEach(player => player.innerHTML = "");

    //console.log(htmlPlayer);

    let j = 0; //index of remainingcards
    let k = 0; //index of board.players

    htmlHands.forEach(player => {
        createHtmlRoles(k, rolescard, player);
        createHtmlScissor(player);
        board.players[k].hand = []; //reset player hand
        htmlPlayerInfos[k].innerText = ""; //reset player infos

        for (let i = 0; i < handsize; i++) {
            createHtmlCard(board.remainingCards[j], player);
            board.players[k].hand.push(board.remainingCards[j]);
            j++;
        }
        htmlPlayerInfos[k].innerText = `${board.players[k].name} => Number of wire : ${board.players[k].hand.filter(card => card.isWire).length} - Bomb ? ${board.players[k].hand.filter(card => card.isBomb).length === 1 ? "YES!" : "NO!"}`;
        k++;
    });



    htmlCards.forEach(card => card.onclick = cardClickHandler);
}

//function to display status of the board
function displayStatus() {
    htmlRound.innerText = board.round + 1;
    htmlTurn.innerText = board.turn + 1;

    //display remaining cards (we have to wait for the animation to finish to complete)
    setTimeout(() => {
        htmlUsedCards.innerHTML = "";
        board.usedCards.forEach(card => createHtmlCard(card, htmlUsedCards));
        htmlGameOver.innerText = board.isGameOver();
    }, 355);
}

function getSoloParameters() {
    //TODO : check if value is correct return false
    nbplayer = htmlSoloNbplayer.value;
    playerNames = [];
    playerNames.push(htmlSoloName.value);
    return true;
    //claims is check...
}

//#endregion