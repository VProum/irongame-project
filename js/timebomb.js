import { Board, Card, Player } from "./classes.js"

console.log("js loaded");


//declaration of variables && eventlistener

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
let htmlRoles = document.querySelectorAll(".card-role")

const shuffleBtn = document.getElementById("shuffle-btn");
const resetBtn = document.getElementById("reset-btn");
const restartBtn = document.getElementById("restart-btn");
const clearBtn = document.getElementById("clear-btn");

shuffleBtn.onclick = shuffleBtnClickHandler;
resetBtn.onclick = resetBtnClickHandler;
restartBtn.onclick = () => document.location.reload(true);
clearBtn.onclick = boardClear;

let board;
let nbplayer = 7;
let rolescard = [true, true, true, false, false]; //3 blue, 2 red


//iife for initialisation of the board ?
function init() {
    board = new Board();
    htmlBoard.innerHTML = "";

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


//Html class manipulation

function boardClear() {
    htmlBoard.innerHTML = "";
}

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
    //console.log(board.remainingCards[getIndexCards(htmlcard)]);
    //console.log(board.remainingCards);
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

//function to distribute card to the players
function giveCards(handsize) {
    htmlHands = document.querySelectorAll(".hand");
    htmlHands.forEach(player => player.innerHTML = "");

    //console.log(htmlPlayer);

    let j = 0; //index of remainingcards
    let k = 0; //index of board.players

    htmlHands.forEach(player => {
        createHtmlRoles(k, rolescard, player);
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



//handlers
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
    console.log(board);
    setTimeout(() => board.isGameOver() ? window.prompt('GAME OVER!') : i++, 500);
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