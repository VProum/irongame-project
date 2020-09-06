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

    //diplay html (create a function to create html element)

})();






//Html class manipulation
function createHtmlCard(card, targetparent) {
    targetparent.innerHTML += ``;
    setHtmlCard(card, targetparent.lastChild);
}


function setCardToRecto(htmlcard) {
    htmlcard.classList.add("recto");
    setCard(htmlcard, board.cards[getIndexCards(htmlcard)]); //update js objects classes
}

function setCardToNeutral(htmlcard) {
    htmlcard.classList.remove("recto");
    htmlcard.classList.add("neutral");
    htmlcard.classList.remove("bomb");
    htmlcard.classList.remove("wire");
    //setCard(htmlcard, board.cards[getIndexCards(htmlcard)]); //update js objects classes
}

function setCardToBomb(htmlcard) {
    htmlcard.classList.remove("recto");
    htmlcard.classList.remove("neutral");
    htmlcard.classList.add("bomb");
    htmlcard.classList.remove("wire");
    //setCard(htmlcard, board.cards[getIndexCards(htmlcard)]); //update js objects classes
}

function setCardToWire(htmlcard) {
    htmlcard.classList.remove("recto");
    htmlcard.classList.remove("neutral");
    htmlcard.classList.remove("bomb");
    htmlcard.classList.add("wire");
    //setCard(htmlcard, board.cards[getIndexCards(htmlcard)]); //update js objects classes
}

function flipCard(event) {
    event.target.classList.add("flip-card");

    //add sound!!!!!

    setTimeout(() => {
        event.target.classList.toggle("recto");
        board.cards[getIndexCards(event.target)].isReturned = !board.cards[getIndexCards(event.target)].isReturned;
    }, 350);

    setTimeout(() => event.target.classList.remove("flip-card"), 450);
};


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
    console.log("titi");
    if (!card.isReturned) {
        setCardToRecto(htmlcard);
        console.log("toto");
    }


}

function setCard(htmlcard, card) {
    card.isReturned = !htmlcard.classList.contains("recto");
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
    console.log(getIndexCards(event.target));
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