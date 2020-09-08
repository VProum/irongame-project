export class Card {
    constructor(str) {
        this.isReturned = false;
        this.isBomb = str === "bomb";
        this.isWire = str === "wire";
    }
}

export class Player {
    constructor(name, role, position, isIA) {
        this.name = name;
        this.isBlue = role; //role is a boolean
        this.hand = [];
        this.isIA = isIA;
        this.position = position;
    }
}

export class Board {
    constructor() {
        this.players = [];
        this.cards = [];
        this.usedCards = [];
        this.remainingCards = [];
        this.turnCards = [];
        this.activeplayer = {};
        this.round = 0;
        this.turn = 0;
    }

    shuffleCards() {
        let shuffledcards = [];

        var length = this.remainingCards.length; //creation of variable is mandatory to fixe the size of the boucle for
        for (let i = 0; i < length; i++) {
            let j = randomInt(this.remainingCards.length);
            shuffledcards.push(this.remainingCards[j]);
            this.remainingCards.splice(j, 1);
        }
        this.remainingCards = shuffledcards;
    }

    shuffle(array) {
        let shuffled = [];

        var length = array.length; //creation of variable is mandatory to fixe the size of the boucle for
        for (let i = 0; i < length; i++) {
            let j = randomInt(array.length);
            shuffled.push(array[j]);
            array.splice(j, 1);
        }
        return shuffled;
    }

    endTurn() {
        return this.turn = this.usedCards.length % this.players.length;
    }

    endRound() {
        this.turnCards = [];
        return this.round++;
    }

    isGameOver() {
        if (this.usedCards.filter(card => card.isBomb).length === 1 ||
            this.round === 4) return -1;
        else if (this.usedCards.filter(card => card.isWire).length === this.players.length) return 1;
        else return 0;
    }

    playEasy() {
        console.log("position player", this.activeplayer.position);
        let randomCard = randomInt(this.remainingCards.length);

        while ((randomCard >= this.activeplayer.position * (5 - this.round) &&
                randomCard < this.activeplayer.position * (6 - this.round)) ||
            this.turnCards.includes(randomCard)) {
            console.log("playeasy while", randomCard)
            randomCard = randomInt(this.remainingCards.length);
        }

        this.turnCards.push(randomCard);
        return randomCard;
    }

    playNormal() {

    }

    playHard() {

    }

}


function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}