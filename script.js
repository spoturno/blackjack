
import Deck from "./deck.js"

const deck = new Deck()
deck.shuffle()
console.log(deck.cards)

let balance = document.querySelector("#game-money")
let playButton = document.querySelector("#play")
let standButton = document.querySelector("#stand")
let hitButton = document.querySelector("#hit")
let betButton = document.querySelector("#bet") 

