import { Board, Card } from "./classes.js"

console.log("js loaded");


//declaration of variables && eventlistener
let htmlCards = document.querySelectorAll(".card");
//htmlCards.forEach(card => card.onclick = cardClickHandler);

const htmlBoard = document.getElementById("board");

let htmlPlayer = document.querySelectorAll(".hand");

const shuffleBtn = document.getElementById("shuffle-btn");
const resetBtn = document.getElementById("reset-btn");
const restartBtn = document.getElementById("restart-btn");

let board = new Board();
let nbplayer = 4;


//iife for initialisation of the board ?
let init = (function() {

    //adding html players
    for (let i = 0; i < nbplayer; i++) {
        htmlBoard.innerHTML += `<div id="player${i}" class="horizontal-container hand">
        </div>`;
    }

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


    shuffleBtn.onclick = shuffleBtnClickHandler;
    resetBtn.onclick = resetBtnClickHandler;
    restartBtn.onclick = () => document.location.reload(true);
    htmlCards.forEach(card => card.onclick = cardClickHandler); // add eventlistener

})();






//Html class manipulation
function createHtmlCard(card, targetparent) {
    targetparent.innerHTML += `<div class="card neutral recto"> A </div>`;
    setHtmlCard(card, targetparent.lastChild);
    htmlCards = document.querySelectorAll(".card"); //update the array of card


}

//notes : no need to update classes states, it is handle within the click handler
function setCardToRecto(htmlcard) {
    htmlcard.classList.add("recto");
    console.log(board.remainingCards[getIndexCards(htmlcard)]);
    console.log(board.remainingCards);
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
        event.target.classList.toggle("recto");
        board.remainingCards[getIndexCards(event.target)].isReturned = !board.remainingCards[getIndexCards(event.target)].isReturned;
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
            console.log("index of card is : ", index);
            return index;
        }
    }
    console.log("card is not found");
    return -1;
}

//function to distribute card to the players
function giveCards(handsize) {
    htmlPlayer = document.querySelectorAll(".hand");
    //htmlPlayer.forEach(player => player.innerHTML = "");

    console.log(htmlPlayer);

    let j = 0; //index of remainingcards
    htmlPlayer.forEach(player => {
        for (let i = 0; i < handsize; i++) {
            createHtmlCard(board.remainingCards[j], player);
            console.log(j);
            j++;
        }
    });
}




//handlers
function cardClickHandler(event) {
    flipCard(event); //animation for card flip and adding css class
    setCard(event.target, board.remainingCards[getIndexCards(event.target)]);
    console.log(getIndexCards(event.target));
    //console.log(board.cards);
}

function shuffleBtnClickHandler() {
    console.log("shuffle click");
    let index = 0;

    board.shuffleCards();

    htmlCards.forEach(htmlcard => {
        setHtmlCard(board.remainingCards[index], htmlcard);
        index++;
        //animation
        htmlcard.classList.add("refresh");
        htmlcard.classList.remove("flip-card");
        setTimeout(() => htmlcard.classList.remove("refresh"), 1000);

    });
}

function resetBtnClickHandler() {
    console.log("reset click");
    //set all card to recto and show refresh animation
    htmlCards.forEach(card => {
        setCardToRecto(card);
        card.classList.add("refresh");
        card.classList.remove("flip-card");
        setTimeout(() => card.classList.remove("refresh"), 1000)
    });

    //update classes state 
    board.cards.forEach(card => card.isReturned = false);
    board.remainingCards = board.cards;
    board.usedCards = [];
    board.shuffleCards();
}