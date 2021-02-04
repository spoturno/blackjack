
import Deck from "./deck.js"

let balance = document.querySelector("#game-money")
let playButton = document.querySelector("#play")
let standButton = document.querySelector("#stand")
let hitButton = document.querySelector("#hit")
let betButton = document.querySelector("#bet") 
let gameCard = document.querySelector("#card-game")

const hitSound = new Audio("audio/swish.m4a")


betButton.addEventListener("click", () => {
    let image = document.createElement("img");
    image.src = `src/cardExample.png`;
    image.style.height = "200px";
    image.style.width = "150px"
    image.style.margin = "10px 10px 0 0";
    document.querySelector("#game__box-cards-dealer").appendChild(image);
    hitSound.play();

});


const cardStyle = () => {
    let suit = document.createElement("h2");
    let cardNumber = document.createElement("h2");
    cardNumber.innerText = `${deck.cards[1].value}`
    suit.innerText = `${deck.cards[1].suit}`;
    gameCard.appendChild(suit)
    gameCard.appendChild(cardNumber);
    console.log(suit);
}

const deck = new Deck()
deck.shuffle()
console.log(deck.cards)
console.log(1212)
cardStyle()