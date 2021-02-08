
import Deck from "./deck.js"


//Future implemantaion of Deck in blackjack.js

let balance = document.querySelector("#game-money")
let playButton = document.querySelector("#play")
let standButton = document.querySelector("#stand")
let hitButton = document.querySelector("#hit")
let betButton = document.querySelector("#bet") 
let gameCard = document.querySelector("#card-game")

const hitSound = new Audio("audio/swish.m4a")

const deck = new Deck()
deck.shuffle()
console.log(deck.cards)
console.log(1212)
cardStyle()