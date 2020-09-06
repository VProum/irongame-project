import { Board, Card, Player } from "./classes.js"

console.log("js loaded");


//declaration of variables && eventlistener
let htmlCards = document.querySelectorAll(".card");
//htmlCards.forEach(card => card.onclick = cardClickHandler);

const htmlBoard = document.getElementById("board");
const htmlRound = document.getElementById("round");
const htmlTurn = document.getElementById("turn");
const htmlUsedCards = document.getElementById("used-cards");
const htmlGameOver = document.getElementById("game-over");
const htmlCurrentPlayer = document.getElementById("current-player");

let htmlPlayer = document.querySelectorAll(".hand");
let htmlPlayerInfos = document.querySelectorAll(".infos");

const shuffleBtn = document.getElementById("shuffle-btn");
const resetBtn = document.getElementById("reset-btn");
const restartBtn = document.getElementById("restart-btn");

shuffleBtn.onclick = shuffleBtnClickHandler;
resetBtn.onclick = resetBtnClickHandler;
restartBtn.onclick = () => document.location.reload(true);

let board;
let nbplayer = 4;


//iife for initialisation of the board ?
function init() {
    board = new Board();
    htmlBoard.innerHTML = "";

    //adding html players and hand
    for (let i = 0; i < nbplayer; i++) {
        //adding players to board
        board.players.push(new Player(`Player ${i}`));
        const h2 = document.createElement("h2");
        h2.classList.add("infos");
        h2.innerText = board.players[i].name;
        htmlBoard.appendChild(h2);

        const div = document.createElement("div");
        div.classList.add("horizontal-container");
        div.classList.add("hand");
        htmlBoard.appendChild(div);
        //htmlBoard.innerHTML += `<div id="player${i}" class="horizontal-container hand"></div>`;
    }
    htmlPlayerInfos = document.querySelectorAll(".infos");
    htmlCurrentPlayer.innerText = board.players[0].name;

    //calculating number of card required and pushing them to the array
    board.cards.push(new Card(2));
    for (let i = 0; i < nbplayer; i++) {
        board.cards.push(new Card(1));
    }
    for (let i = 0; i < nbplayer * 4 - 1; i++) {
        board.cards.push(new Card(0));
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
}
init();


//Html class manipulation

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

//function to distribute card to the players
function giveCards(handsize) {
    htmlPlayer = document.querySelectorAll(".hand");
    htmlPlayer.forEach(player => player.innerHTML = "");

    //console.log(htmlPlayer);

    let j = 0; //index of remainingcards
    let k = 0; //index of board.players
    htmlPlayer.forEach(player => {
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
    console.log(board.players.filter(player => player.hand.includes(board.remainingCards[getIndexCards(event.target)])));
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