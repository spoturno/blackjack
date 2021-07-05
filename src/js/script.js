import Deck from "./deck.js";

//set stand and hit buttons initially unabled
togButton("stand", false);
togButton("hit", false);

//target the buttons and set event listeners
document.querySelector("#deal-button").addEventListener("click", dealButton);
document.querySelector("#hit-button").addEventListener("click", hitButton);
document.querySelector("#stand-button").addEventListener("click", standButton);
document.querySelector("#bet-button").addEventListener("click", addBet);

//new audio object
const hitSound = new Audio("audio/swish.m4a");

//create blakcjack object for game 
let blackjack = {
    you: {
        scoreSpan: "#player-result",
        div: "#game__box-player",
        balanceSpan: "#game-money",
        streakSpan: "#game-streak",
        score: 0,
        standing: false,
        balance: 1000,
        streak: 0,
        hand: [],
    },
    dealer: {
        scoreSpan: "#dealer-result",
        div: "#game__box-dealer",
        score: 0,
        hand: [],
    },
    cardsMap: {
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        K: 10,
        J: 10,
        Q: 10,
        A: [1, 11],
    },
};

let YOU = blackjack["you"];
let DEALER = blackjack["dealer"];
let BET = parseInt(document.querySelector("#bet-input").value);
const deck = new Deck();
deck.shuffle();

function dealButton() {

  // Resets the players score and cards
    resetGame();

  // 1 for YOU > 1 for DEALER > 1 for YOU > face down for DEALER
    dealCardsTimer(YOU, 1000);
    dealCardsTimer(DEALER, 1500);
    dealCardsTimer(YOU, 2000);

  //deal button not visible
    togButton("deal", false);

  //make other buttons visible
    togButton("hit", true);
    togButton("stand", true);

  //finish the game auto (TODO)
}

function hitButton() {
  // If you pressed stand, then you shouldn't be able to request a new card
    if (YOU["standing"]) return;
    dealCARDS(YOU);
  //auto deal
    if (YOU["score"] > 21) standButton();
}

function addBet() {
    if (YOU["balance"] > 0 && YOU["balance"] > BET) {
        YOU["balance"] -= BET;
        console.log("betting:", YOU["balance"]);
        document.querySelector(YOU["balanceSpan"]).textContent = YOU["balance"];
    } else {
        // screen message (TODO)
        console.log("No balance aviable");
  }
}

// resetGame: restarts the game, function called every dealButton()
function resetGame() {
    YOU["score"] = 0;
    YOU["standing"] = false; // If you pressed stand, then you wont be able to pick more cards. Needed in order to make the game finish if no one is on "bust" state
    YOU["hand"] = [];
    document.getElementById("game__box-player").innerHTML = "";
    document.querySelector(YOU["scoreSpan"]).textContent = " " + YOU["score"];
    document.querySelector(YOU["scoreSpan"]).style.color = "black";

    DEALER["score"] = 0;
    DEALER["hand"] = [];
    document.getElementById("game__box-dealer").innerHTML = "";
    document.querySelector(DEALER["scoreSpan"]).textContent = " " + DEALER["score"];
    document.querySelector(DEALER["scoreSpan"]).style.color = "black";
}

function dealCardsTimer(player, time) {
    window.setTimeout(function () {
        dealCARDS(player);
    }, time);
}

function dealCARDS(player) {
    let card = deck.cards.pop();
    addCardToHand(player, card.value);
    showCard(card, player);
    updateScore(card.value, player);
    showScore(player);

  // After every card deal, the game should check if there's a winner
    computeWinner();
}

function standButton() {
  // If you pressed stand, then return to avoid bugs
    if (YOU["standing"]) return;
    YOU["standing"] = true;
    togButton("hit", false, true);

  //fix
    const finalDeal = window.setInterval(function () {
        dealCARDS(DEALER);
        if (DEALER["score"] >= 17) clearInterval(finalDeal);
    }, 750);
}

function addCardToHand(player, card) {
    //array of values without suit
    player["hand"].push(card);
}

function showCard(card, player) {
    if (player["score"] <= 21) {
        let image = document.createElement("img");
        image.src = `images/${card.value}${card.suit}.png`;
        image.style.height = "200px";
        image.style.width = "150px";
        //make cards stack in player box (fix position)
        document.querySelector(player["div"]).appendChild(image);
        hitSound.play();
    }
}

function updateScore(card, player) {
    //fix problem if As comes first
    //As is avalueted as 1 or 11 depending on player cards hand
    //when player draws an ace and the score exceedes 21, As value change to 1
    if (card === "A") {
        if (player["score"] + blackjack["cardsMap"][card][1] <= 21) {
            player["score"] += blackjack["cardsMap"][card][1];
        } else {
            player["score"] += blackjack["cardsMap"][card][0];
        }
    } else {
        player["score"] += blackjack["cardsMap"][card];
        if(player["hand"].length > 1){
            if(player["hand"][player["hand"].length - 2] === "A"){
                player["score"]-=10;
      }
    }
  }
}

function showScore(player) {
  //upgrade score span and win/lose message (TODO)
    if (player["score"] > 21) {
        document.querySelector(player["scoreSpan"]).textContent = "BUST";
        document.querySelector(player["scoreSpan"]).style.color = "red";
    } else {
        document.querySelector(player["scoreSpan"]).textContent = " " + player["score"];
    }
}

function computeWinner() {
  // A winner can't be choiced if the dealer score is less than 17, keep playing if that is the case
    if (DEALER["score"] < 17) return;

  // Otherwise, try to calculate a winner
    let winner;

  // If your score is greater than 21, the dealer wins
    if (YOU["score"] > 21) winner = DEALER;
  // If the dealer score is greater than 21, you win
    else if (DEALER["score"] > 21) winner = YOU;
  // If you decided to stand (neither you or the dealer have more than 21 points)
    else if (YOU["standing"]) {
        // Dealer wins by points
        if (DEALER["score"] > YOU["score"]) winner = DEALER;
        // You win by points
        else if (YOU["score"] > DEALER["score"]) winner = YOU;
        //Draw
        else if (YOU["score"] === DEALER["score"]) winner = "DRAW";
        //delete this?
        else {
            // TODO
            // This code will only make the game restart, this isn't how it should work
            // Make the buttons dissapear in order to avoid bugs
            togButton("deal", false, true);
            togButton("hit", false, true);
            togButton("stand", false, true);
        }
    }

  // Keep playing
    console.log(winner);
    if (!winner) {
        return;
    }
  // If you are the winner, then show it
    else if (winner === YOU) {
        document.querySelector(YOU["scoreSpan"]).textContent =
            "WON (" + YOU["score"] + ")";
        document.querySelector(YOU["scoreSpan"]).style.color = "green";
        winChangeBalance(winner);
        upgradeStreak(winner);
    }
  // If the dealer is the winner, then show it
    else if (winner === DEALER) {
        document.querySelector(DEALER["scoreSpan"]).textContent =
            "WON (" + DEALER["score"] + ")";
        document.querySelector(DEALER["scoreSpan"]).style.color = "green";
        upgradeStreak(winner);
    }
  //If it's a draw, then show it in both
    else if (winner === "DRAW") {
        document.querySelector(YOU["scoreSpan"]).textContent =
            "DRAW (" + YOU["score"] + ")";
        document.querySelector(DEALER["scoreSpan"]).textContent =
            "DRAW (" + DEALER["score"] + ")";
        document.querySelector(YOU["scoreSpan"]).style.color = "yellow";
        document.querySelector(DEALER["scoreSpan"]).style.color = "yellow";
        winChangeBalance(winner);
        upgradeStreak(winner);
    }
    togButton("deal", true);
    togButton("hit", false, true);
    togButton("stand", false, true);
}



// togButton: string name, bool state [[, bool instant]]
// name: button name
// state: if true then show the dealButton, false to hide it
// instant: make the tog instant, to avoid bugs, optional
function togButton(name, state, instant) {
    // Return false if the name is not an string in order to avoid console errors
    if (typeof name != "string") return false;

    // If instant wasn't declared as bool, then make it false
    if (typeof instant != "boolean") instant = false;

    // Get the button, if it does not exist then return false
    var btn = document.querySelector(`#${name}-button`);

    if (!btn) return false;

    // SHOW IT
    if (state) {
        btn.style.opacity = "1";
        // Make it appear in 0.3s
        if (!instant) {
            setTimeout(function addThis() {
                btn.style.visibility = "visible";
            }, 300);
        }
        // Make it appear instantly
        else btn.style.visibility = "visible";
    }
    // HIDE IT
    else {
        btn.style.opacity = "0";
        // Make it dissapear in 0.3s
        if (!instant) {
            setTimeout(function removeThis() {
                btn.style.visibility = "none";
            }, 300);
        }
        // Make it dissapear instantly
        else btn.style.visibility = "none";
    }
    return false;
}

function winChangeBalance(winner) {
    //if win return profit
    if (winner === YOU) {
        YOU["balance"] += BET * 2;
        document.querySelector(YOU["balanceSpan"]).textContent = YOU["balance"];
    } else if (winner === "DRAW") YOU["balance"] += BET;
    console.log("finale balance: ", YOU["balance"]);
}

function upgradeStreak(winner) {
    if (winner === YOU) YOU["streak"]++;
    else if (winner === "DRAW") return;
    else if (winner === DEALER) YOU["streak"] = 0;
    document.querySelector(YOU["streakSpan"]).textContent = YOU["streak"];
    console.log(YOU["streak"]);
}
