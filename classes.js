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
        this.activeplayer = {};
        this.round = 0;
        this.cuts = 0;
    }

    shuffleCards() {
        let shuffledcards = [];

        var length = this.cards.length; //this is mandatory to fixe the size of the boucle for
        for (let i = 0; i < length; i++) {
            console.log(this.cards.length)
            let j = randomInt(this.cards.length);
            shuffledcards.push(this.cards[j]);
            this.cards.splice(j, 1);
        }
        this.cards = shuffledcards;
    }



}


function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}