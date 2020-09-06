import { Board, Card } from "./classes.js"

console.log("js loaded");


//declaration of variables && eventlistener
const htmlCards = document.querySelectorAll(".card"); //select all cards
htmlCards.forEach(card => card.onclick = cardClickHandler);

const shuffleBtn = document.getElementById("shuffle-btn");
const resetBtn = document.getElementById("reset-btn");
const restartBtn = document.getElementById("restart-btn");
shuffleBtn.onclick = shuffleBtnClickHandler;
resetBtn.onclick = resetBtnClickHandler;
restartBtn.onclick = () => document.location.reload(true);

let board = new Board();


//iife for initialisation of the board
let init = (function() {

    for (let i = 0; i < 4; i++) {
        board.cards.push(new Card(0));
    }
    var bombcard = new Card(2);
    board.cards.push(bombcard);

    //steps for initialising : 1 add neutral card, 2 add wire, 3 add bomb, 4 shuffle!



})();






//Html class manipulation
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

    setTimeout(() => {
        event.target.classList.toggle("recto");
    }, 350);

    setTimeout(() => event.target.classList.remove("flip-card"), 450);
};

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
    card.isReturned = htmlcard.classList.contains("recto");
}


//compare === with array of div, or add custom properties
function getIndexCards(card) {
    let index = 0;
    for (let htmlcard of htmlCards) {
        if (!(htmlcard === card)) {
            index++;
        } else if ((htmlcard === card)) {
            return index;
        }
    }
}






//handlers
function cardClickHandler(event) {
    flipCard(event); //animation for card flip and adding css class
    setCard(event.target, board.cards[getIndexCards(event.target)]);
    console.log(board.cards);
};

function shuffleBtnClickHandler() {
    console.log("shuffle click");
    let index = 0;

    board.shuffleCards();

    htmlCards.forEach(htmlcard => {
        setHtmlCard(board.cards[index], htmlcard);
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
}