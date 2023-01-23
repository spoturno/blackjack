import { cardsMap, audioSource, player, dealer } from './const'
import Deck from './deck'

export default class Blackjack {
    constructor() {
        this.player = player
        this.dealer = dealer
        this.draw = false
        this.cardsMap = cardsMap
        this.deck = new Deck()
        this.audio = new Audio(audioSource)
    }

    startGame() {
        this.toggleButton("stand", false);
        this.toggleButton("hit", false);
        this.deck.shuffle()

        document.querySelector("#deal-button").addEventListener("click", this.handleDealButton);
        document.querySelector("#hit-button").addEventListener("click", this.handleHitButton);
        document.querySelector("#stand-button").addEventListener("click", this.handleStandButton);
        document.querySelector("#bet-button").addEventListener("click", this.handleAddBet);
    }

    handleDealButton() {
        this.resetGame();

        this.dealCardsTimer(this.player, 1000);
        this.dealCardsTimer(this.dealer, 1500);
        this.dealCardsTimer(this.player, 2000);

        this.toggleButton("deal", false);
        this.toggleButton("hit", true);
        this.toggleButton("stand", true);
    }

    handleHitButton() {
        if (this.player.standing) return;
        this.dealCards(this.player);
        if (this.player.score > 21) this.computeWinner();
    }

    handleStandButton() {
        if (this.player.standing) return;
        this.player.standing = true;
        this.toggleButton("hit", false, true);

        const finalDeal = window.setInterval( () => {
            this.dealCards(this.dealer);
            if (this.dealer.score > 17) clearInterval(finalDeal);
        }, 750);
    }

    handleAddBet() {
        if (this.player.balance > 0 && this.player.balance > this.player.bet) {
            this.balance -= this.player.bet;
            document.querySelector(this.player.balanceSpan).textContent = this.player.balance;
        } else console.log("You don't have enough money to bet");
    }

    resetGame() {
        this.player.score = 0;
        this.player.standing = false;
        this.player.hand = []
        this.dealer.score = 0;
        this.dealer.hand = [];

        document.getElementById(this.player.div).innerHTML = "";
        document.querySelector(this.player.scoreSpan).textContent = " " + this.player.score;
        document.querySelector(this.player.scoreSpan).style.color = "black";

        document.getElementById(this.player.div).innerHTML = "";
        document.querySelector(this.player.scoreSpan).textContent = " " + this.player.score;
        document.querySelector(this.player.scoreSpan).style.color = "black";
    }

    dealCardsTimer(player, time) {
        window.setTimeout(function () {
            this.dealCARDS(player);
        }, time);
    }

    dealCards(player) {
        const card = this.deck.cards.pop();
        this.addCardToHand(player, card.value)
        this.showCard(player, card)
        this.updateScore(player, card.value)
        this.showScore(player)
        this.computeWinner()
    }

    addCardToHand(player, cardValue) {
        player.hand.push(cardValue);
    }

    showCard(player, card) {
        if (player.score <= 21) return;
        const cardImage = document.createElement("img");
        cardImage.src = `images/${card.value}${card.suit}.png`;
        cardImage.style.cssText = "height: 200px; width: 150px;";
        document.getElementById(player.div).appendChild(cardImage);
    }

    updateScore(player, cardValue) {
        if (cardValue === "A") player.score += player.score + 11 > 21 ? 1 : 11;

        else player.score += this.cardsMap[cardValue];

        if (player.hand[player.hand.length - 2] === "A" && player.hand.length > 1) player.score -=10;
    }

    showScore(player) {
        if (player.score <= 21) document.querySelector(player.scoreSpan).textContent = " " + player.score;
        else {
            document.querySelector(player.scoreSpan).textContent = "BUST";
            document.querySelector(player.scoreSpan).style.color = "red";
        }
    }

    computeWinner() {
        if (dealer.score < 17) return;

        let winner;
        if (this.player.score > 21) winner = this.dealer;
        
        else if (this.dealer.score > 21) winner = this.player;
    
        else if (this.player.standing) {
            if (this.dealer.score > this.player.score) winner = this.dealer;
            else if (this.player.score > this.dealer.score) winner = this.player;
            else winner = "DRAW";
        }

        if (!winner) return;

        else if (winner === this.player) {
            this.updateScoreDisplay(this.player, "WON");
            this.updateBalance(winner);
            this.upgradeStreak(winner);

        } else if (winner === this.dealer) {
            this.updateScoreDisplay(this.dealer, "WON");
            this.upgradeStreak(winner);

        } else {
            this.updateScoreDisplay(this.player, "DRAW");
            this.updateScoreDisplay(this.dealer, "DRAW");
            this.updateBalance(winner);
            this.upgradeStreak(winner);
        }

        this.toggleButton("deal", true);
        this.toggleButton("hit", false);
        this.toggleButton("stand", false);
    }

    updateScoreDisplay(player, status) {
        const scoreSpan = document.querySelector(player.scoreSpan);
        scoreSpan.textContent = `${status} (${player.score})`;
        if (status === "WON") scoreSpan.style.color = "green";
        else if (status === "DRAW") scoreSpan.style.color = "yellow";
    }

    updateBalance(winner) {
        if (winner === this.player) {
            this.player.balance += this.player.bet * 2;
            document.querySelector(this.player.balanceSpan).textContent = this.player.balance;

        } else if (this.draw) this.player.balance += this.player.bet;
    }

    updateStreak(winner) {
        if (winner === this.player) this.player.streak++;
        else if (winner === this.dealer) this.player.streak = 0;
        else if (this.draw) return;
        document.querySelector(this.player.streakSpan).textContent = this.player.streak;
    }

    toggleButton(name, state, instant) {
        if (typeof name !== "string") return false;

        const button = document.querySelector(`#${name}-button`);

        if (!button) return false;

        const toggle = () => {
            button.style.opacity = state ? "1" : "0";
            button.style.visibility = state ? "visible" : "hidden";
        };

        if (instant) toggle();
        else setTimeout(toggle, 300);

    }
}
