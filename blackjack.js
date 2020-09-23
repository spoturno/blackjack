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
  you: { scoreSpan: "#your-bkj-result", div: "#your-box", score: 0 },
  dealer: { scoreSpan: "#dealer-bkj-result", div: "#dealer-box", score: 0 },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],
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

function hitButton() {
  var card = randomCard();
  showCard(card, YOU);
  updateScore(card, YOU);
  showScore(YOU);

  //auto deal
  if (YOU["score"] > 21) {
    standButton();
  }
}

function dealCARDS(playerD) {
  let carta = randomCard();
  showCard(carta, playerD);
  updateScore(carta, playerD);
  showScore(playerD);
}
function dealCardsTimer(player, time) {
  window.setTimeout(function () {
    dealCARDS(player);
  }, time);
}

function randomCard() {
  let i = Math.floor(Math.random() * 13);
  return blackjackGame["cards"][i];
}

function showCard(card, player) {
  if (player["score"] <= 21) {
    let image = document.createElement("img");
    image.src = `images/${card}.png`;
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
    document.querySelector(player["scoreSpan"]).textContent = player["score"];
  }
}

function standButton() {
  //fix
  const finalDeal = window.setInterval(function () {
    dealCARDS(DEALER);
    if (DEALER["score"] >= 17) clearInterval(finalDeal);
  }, 750);

  showWinner();
}

function dealButton() {
  // 1 for YOU > 1 for DEALER > 1 for YOU > face down for DEALER
  dealCardsTimer(YOU, 1000);
  dealCardsTimer(DEALER, 1500);
  dealCardsTimer(YOU, 2000);

  //button not visible
  var obj = document.querySelector("#blackjack-deal-btn");
  obj.style.opacity = "0";
  window.setTimeout(function removeThis() {
    obj.style.display = "none";
  }, 300);

  //make other buttons visible
  var btn1 = document.querySelector("#blackjack-hit-btn");
  var btn2 = document.querySelector("#blackjack-stand-btn");
  btn1.style.opacity = "1";
  btn2.style.opacity = "1";
  window.setTimeout(function addThis() {
    //name not necesary
    btn1.style.visibility = "visible";
    btn2.style.visibility = "visible";
  }, 300);

  //finish the game auto (TODO)
}

function computeWinner() {
  let winner;
  if (YOU["score"] <= 21) {
    if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) winner = YOU;
    else if (YOU["score"] < DEALER["score"]) winner = DEALER;
    else if (YOU["score"] === DEALER["score"]) winner = {}; //TODO }
  } else winner = DEALER;

  return winner;
}

function showWinner() {
  if (computeWinner() === YOU) {
    document.querySelector(YOU["scoreSpan"]).textContent = "WON";
    document.querySelector(YOU["scoreSpan"]).style.color = "green";
  } else if (computeWinner() === DEALER) {
    document.querySelector(DEALER["scoreSpan"]).textContent = "WON";
    document.querySelector(DEALER["scoreSpan"]).style.color = "green";
  }
}

function addBet() {}
