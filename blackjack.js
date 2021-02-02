document
  .querySelector("#blackjack-hit-btn")
  .addEventListener("click", hitButton);
document
  .querySelector("#blackjack-stand-btn")
  .addEventListener("click", standButton);
document
  .querySelector("#blackjack-deal-btn")
  .addEventListener("click", dealButton);

let blackjackGame = {
  you: { scoreSpan: "#your-bkj-result", div: "#your-box", score: 0, standing: false },
  dealer: { scoreSpan: "#dealer-bkj-result", div: "#dealer-box", score: 0 },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],
  suits: ["S", "C", "H", "D"],
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

let YOU = blackjackGame["you"];
let DEALER = blackjackGame["dealer"];

const hitSound = new Audio("audio/swish.m4a");

// resetGame: restarts the game, function called every dealButton()
function resetGame() {
	YOU["score"] = 0;
	YOU["standing"] = false; // If you pressed stand, then you wont be able to pick more cards. Needed in order to make the game finish if no one is on "bust" state
	document.getElementById("your-box").innerHTML = "";
	document.querySelector(YOU["scoreSpan"]).textContent = " " + YOU["score"];
	document.querySelector(YOU["scoreSpan"]).style.color = "black";
	
	DEALER["score"] = 0;
	DEALER["div"].innerHTML = "";
	document.getElementById("dealer-box").innerHTML = "";
	document.querySelector(DEALER["scoreSpan"]).textContent = " " + DEALER["score"];
	document.querySelector(DEALER["scoreSpan"]).style.color = "black";
}

function hitButton() {
  dealCARDS(YOU)

  //auto deal
  if (YOU["score"] > 21) {
    standButton();
  }
}

function dealCARDS(playerD) {
	let card = randomCard();
	showCard(card, playerD);
	updateScore(card[0], playerD);
	showScore(playerD);
	
	// After every card deal, the game should check if there's a winner
	computeWinner();
}

function dealCardsTimer(player, time) {
  window.setTimeout(function () {
    dealCARDS(player);
  }, time);
}

// randomCard: Returns array with [0] being the card number and [1] being the suit
function randomCard() {
  let i = Math.floor(Math.random() * 13); // Maybe instead of declaring a variable move this piece of code directly into the array?
  return [ blackjackGame["cards"][i], blackjackGame["suits"][Math.floor(Math.random()*4)] ];
}

function showCard(card, player) {
  if (player["score"] <= 21) {
    let image = document.createElement("img");
    image.src = `images/${card[0]}${card[1]}.png`;
    document.querySelector(player["div"]).appendChild(image);
    hitSound.play();
  }
}

function updateScore(card, player) {
  if (card === "A") {
    if (player["score"] + blackjackGame["cardsMap"][card][1] <= 21) {
      player["score"] += blackjackGame["cardsMap"][card][1];
    } else {
      player["score"] += blackjackGame["cardsMap"][card][0];
    }
  } else {
    player["score"] += blackjackGame["cardsMap"][card];
  }
}

function showScore(player) {
  if (player["score"] > 21) {
    document.querySelector(player["scoreSpan"]).textContent = "BUST";
    document.querySelector(player["scoreSpan"]).style.color = "red";
  } else {
    document.querySelector(player["scoreSpan"]).textContent = " " + player["score"];
  }
}

function standButton() {
	YOU["standing"] = true;
	
	//fix
	const finalDeal = window.setInterval(function () {
	dealCARDS(DEALER);
		if (DEALER["score"] >= 17) clearInterval(finalDeal);
	}, 750);
}

function dealButton() {
	// Resets the players score and cards
	resetGame();

	// 1 for YOU > 1 for DEALER > 1 for YOU > face down for DEALER
	dealCardsTimer(YOU, 1000);
	dealCardsTimer(DEALER, 1500);
	dealCardsTimer(YOU, 2000);

	//deal button not visible
	togButton("deal", false)

	//make other buttons visible
	togButton("hit", true)
	togButton("stand", true)

	//finish the game auto (TODO)
}

// togButton: string name, bool state [[, bool instant]]
// name: button name
// state: if true then show the dealButton, false to hide it
// instant: make the tog instant, to avoid bugs, optional
function togButton(name, state, instant) {
	// Return false if the name is not an string in order to avoid console errors
	if (typeof name != "string") {
		return false;
	}
	
	// If instant wasn't declared as bool, then make it false
	if (typeof instant != "boolean") {
		instant = false;
	}
	
	// Get the button, if it does not exist then return false
	var btn = document.querySelector("#blackjack-" + name + "-btn");
	if (!btn){
		return false;
	}
	
	// SHOW IT
	if (state){
		btn.style.opacity = "1";
		
		// Make it appear in 0.3s
		if (!instant) {
			setTimeout(function addThis() {
				btn.style.visibility = "visible";
			}, 300);
		}
		// Make it appear instantly
		else {
			btn.style.visibility = "visible";
		}
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
		else {
			btn.style.visibility = "none";
		}
	}
	
	return false;
}

// computeWinner: compute if a winner exists, if it does the game will stop, otherwise the game will continue. This function is called every deal.
function computeWinner() {
	// A winner can't be choiced if the dealer score is less than 17, keep playing if that is the case
	if (DEALER["score"] < 17) {
		return;
	}
	
	// Otherwise, try to calculate a winner
	let winner;
	
	// If your score is greater than 21, the dealer wins
	if (YOU["score"] > 21) {
		winner = DEALER;
	} 
	// If the dealer score is greater than 21, you win
	else if (DEALER["score"] > 21) {
		winner = YOU;
	}
	// If you decided to stand (neither you or the dealer have more than 21 points)
	else if (YOU["standing"]) {
		// Dealer wins by points
		if (DEALER["score"] > YOU["score"]) {
			winner = DEALER;
		}
		// You win by points
		else if (YOU["score"] > DEALER["score"]) {
			winner = YOU;
		}
		// Draw
		else {
			// TODO
			// This code will only make the game restart, this isn't how it should work
			
			// Make the buttons dissapear in order to avoid bugs
			togButton("deal", false, true);
			togButton("hit", false, true);
			togButton("stand", false, true);
			
			// Reset the game after 3 seconds 
			setTimeout(resetGame, 3000);
		}
	}
	
	// Keep playing
	if (!winner) {
		return;
	}
	
	// If you are the winner, then show it
	else if (winner === YOU) {
		document.querySelector(YOU["scoreSpan"]).textContent = "WON (" + YOU["score"] + ")";
		document.querySelector(YOU["scoreSpan"]).style.color = "green";
	} 
	// If the dealer is the winner, then show it
	else if (winner === DEALER) {
		document.querySelector(DEALER["scoreSpan"]).textContent = "WON (" + DEALER["score"] + ")";
		document.querySelector(DEALER["scoreSpan"]).style.color = "green";
	}
	
	togButton("deal", true);
	togButton("hit", false, true);
	togButton("stand", false, true);
}

// Not used anymore
function showWinner() {
	let winner = computeWinner();
	
	// If you are the winner, then show it
	if (winner === YOU) {
		document.querySelector(YOU["scoreSpan"]).textContent = "WON";
		document.querySelector(YOU["scoreSpan"]).style.color = "green";
	// If the dealer is the winner, then show it
	} else if (winner === DEALER) {
		document.querySelector(DEALER["scoreSpan"]).textContent = "WON";
		document.querySelector(DEALER["scoreSpan"]).style.color = "green";
	} else {
		// Keep playing
		return;
	}

	// Make deal button visible again, in order to play a new game
	var obj = document.querySelector("#blackjack-deal-btn");
	obj.style.opacity = "0";
	window.setTimeout(function removeThis() {
		obj.style.display = "none";
	}, 300);
}

function addBet() {}
