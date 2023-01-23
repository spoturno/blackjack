export const cardsMap = {
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
}

export let player = {
    scoreSpan: "#player-result",
    div: "#game__box-player",
    balanceSpan: "#game-money",
    streakSpan: "#game-streak",
    score: 0,
    standing: false,
    balance: 1000,
    streak: 0,
    hand: [],
}

export let dealer = {
    scoreSpan: "#dealer-result",
    div: "#game__box-dealer",
    score: 0,
    hand: [],
}

export const audioSource = "audio/swish.m4a";