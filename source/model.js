/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/********************** Model **********************/
"use strict";
function Field() {
    let self = this;
    let cellsCount = 9;
    this.fieldCells = [];

    this.updateCell = function (id, symbol) {
        return self.fieldCells[id] != null ? false : self.fieldCells[id] = symbol;
    };

    this.getEmptyCells = function () {
        let emptyCells = [];
        for (let i = 0; i < cellsCount; i++) {
            if (self.fieldCells[i] == null) {
                emptyCells.push(i);
            }
        }
        return emptyCells;
    };

    this.areCellsAvailable = function () {
        return self.getEmptyCells().length > 0;
    }
}

function WinnerChecker(field) {
    let winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    let currentWinCombination = null;

    this.getWinner = function (id, symbol) {
        let winArray = [];
        for (let i = 0; i < winCombinations.length; i++) {
            if (winCombinations[i].indexOf(id) != -1) {
                winArray.push(winCombinations[i]);
            }
        }
        for (let key in winArray) {
            let isWinnerFound = true;
            for (let i = 0; i < winArray[key].length; i++) {
                if (field.fieldCells[winArray[key][i]] != symbol) {
                    isWinnerFound = false;
                    break;
                }
            }
            if (isWinnerFound) {
                return currentWinCombination = winArray[key];
            }
        }
        return false;
    }
}

function Player(name, symbol, field) {
    this.playerName = name;
    this.playerSymbol = symbol;
    this.gameField = field;
    this.myGame = null;

    this.startMove = function () { };
    this.finishMove = function (id) {
        return this.gameField.updateCell(id, this.playerSymbol);
    };
}

function ComputerPlayer(name, symbol, field) {
    Player.apply(this, arguments);

    this.startMove = function () {
        let identifier = cellFinder();
        this.myGame.finishTurn(identifier);
    };

    function cellFinder() {
        let emptyCellsArr = field.getEmptyCells();
        let min = 0;
        let max = emptyCellsArr.length > 0 ? emptyCellsArr.length - 1 : 0;
        let random = Math.floor(Math.random() * (max - min + 1)) + min;
        return emptyCellsArr[random];
    }
}

ComputerPlayer.prototype = Object.create(Player.prototype);
ComputerPlayer.prototype.constructor = ComputerPlayer;


function Game(humanPlayer, firstPlayerName, secondPlayerName) {
    let self = this;
    let currentPlayerIndex = 0;
    let gameStatuses = ['Playing', 'Winner', 'Tie'];
    let field = new Field();
    let winnerChecker = new WinnerChecker(field);
    let players = playerCreator();

    this.currentPlayer = players[currentPlayerIndex];
    this.currentStatus = gameStatuses[0];

    this.getFieldCells = function(){
        return field.fieldCells.slice(0);
    };

    this.startTurn = function () {
        players[currentPlayerIndex].startMove();
    };

    this.finishTurn = function (id) {
        if (self.currentStatus == gameStatuses[0] && self.currentPlayer.finishMove(id)) {
            if (winnerChecker.getWinner(id, self.currentPlayer.playerSymbol)) {
                self.currentStatus = gameStatuses[1];
            } else if (!field.areCellsAvailable()) {
                self.currentStatus = gameStatuses[2];
            } else {
                currentPlayerIndex = currentPlayerIndex == 0 ? 1 : 0;
                self.currentPlayer = players[currentPlayerIndex];//??
                self.startTurn();
            }
        }
    };

    function playerCreator() {
        let playersArr = [];
        playersArr.push(new Player(firstPlayerName, 'X', field));

        let secondPlayer;
        if (humanPlayer) { //true
            secondPlayer = new Player(secondPlayerName, 'O', field);
        } else {
            secondPlayer = new ComputerPlayer('Computer', 'O', field);
        }
        secondPlayer.myGame = self;
        playersArr.push(secondPlayer);

        return playersArr;
    }
}




