export class Card {
    constructor(i) {
        this.isReturned = false;
        this.isBomb = i === 2;
        this.isWire = i === 1;
    }
}

export class Player {
    constructor(name) {
        this.name = name;
        this.isBlue = true;
        this.hand = [];
    }
}

export class Board {
    constructor() {
        this.players = [];
        this.cards = [];
        this.usedCards = [];
        this.remainingCards = [];
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

    endTurn() {
        return this.turn = this.usedCards.length % this.players.length;
    }

    endRound() {
        return this.round++;
    }

    isGameOver() {
        return this.usedCards.filter(card => card.isBomb).length === 1 ||
            this.usedCards.filter(card => card.isWire).length === this.players.length ||
            this.round === 4
    }
}


function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}