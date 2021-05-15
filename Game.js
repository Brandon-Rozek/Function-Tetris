//variables and functions for game state
Game = {
    currentLine: undefined,
    currentLevel: undefined,
    level: 1
}

Game.parabula = {
    fh: function () {
        return Math.floor(Math.random() * 9 - 4);
    },
    fk: function () {
        return Math.floor(Math.random() * 5 - 3);
    }
}