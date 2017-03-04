/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/********************** Model **********************/
"use strict";

let singletonField = (function(){
    let instance;

    function createInstance(){
        return new Field();
    };

    function Field(){
        let self = this;
        let cellsCount = 9;
        this.fieldCells = [];

        this.updateCell = function(cellNum, symbol){
            return self.fieldCells[cellNum] != null ? false : self.fieldCells[cellNum] = symbol;
        };

        this.getEmptyCells = function(){
            let emptyCells = [];
            for (let i = 0; i < cellsCount; i++) {
                if (self.fieldCells[i] == null) {
                    emptyCells.push(i);
                }
            }
            return emptyCells;
        };

        this.areCellsAvailable = function(){
            return self.getEmptyCells().length > 0;
        }
    };

    return {
        getInstance: function(){
            if(!instance){
                instance = createInstance();
            }
            return instance;
        }
    };
})();

function WinnerChecker(field){
    let winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    this.getWinner = function (cellNum, symbol){
        let winArray = [];
        for (let i = 0; i < winCombinations.length; i++){
            if (winCombinations[i].indexOf(cellNum) != -1) {
                winArray.push(winCombinations[i]);
            }
        }
        for (let winSegment in winArray) {
            let isWinnerFound = true;
            for (let i = 0; i < winArray[winSegment].length; i++) {
                if (field.fieldCells[winArray[winSegment][i]] != symbol) {
                    isWinnerFound = false;
                    break;
                }
            }
            if (isWinnerFound) {
                return winArray[winSegment];
            }
        }
        return false;
    };
};

function Player(name, symbol){
    this.playerName = name;
    this.playerSymbol = symbol;

    this.startMove = function(game){ };
    this.finishMove = function (cellNum){
        return singletonField.getInstance().updateCell(cellNum, this.playerSymbol);
    };
};

function ComputerPlayer(name, symbol){
    Player.apply(this, arguments);

    this.startMove = function(game){
        let computerCellNum = cellFinder();
        game.finishTurn(computerCellNum);
    };

    function cellFinder(){
        let emptyCellsArr = singletonField.getInstance().getEmptyCells();
        let min = 0;
        let max = emptyCellsArr.length > 0 ? emptyCellsArr.length - 1 : 0;
        let random = Math.floor(Math.random() * (max - min + 1)) + min;
        return emptyCellsArr[random];
    };
}

ComputerPlayer.prototype = Object.create(Player.prototype);
ComputerPlayer.prototype.constructor = ComputerPlayer;

function Iterator(array) {
    let index = 0;

    this.getCurrent = function(){
        return array[index];
    };

    this.moveNext = function(){
        index = index == array.length-1 ? 0 : ++index;
    };
};

function Game(players){
    let self = this;
    let gameStatuses = ['Playing', 'Winner', 'Tie'];
    let field = singletonField.getInstance();
    let winnerChecker = new WinnerChecker(field);
    let iterator = new Iterator(players);

    this.currentStatus = gameStatuses[0];

    this.currentPlayerName = function(){
        return iterator.getCurrent().playerName;
    };

    this.getFieldCells = function(){
        return field.fieldCells.slice(0);
    };

    this.startTurn = function(){
        iterator.getCurrent().startMove(self);
    };

    this.finishTurn = function(cellNum){
        if (self.currentStatus == gameStatuses[0] && iterator.getCurrent().finishMove(cellNum)) {
            if (winnerChecker.getWinner(cellNum, iterator.getCurrent().playerSymbol)) {
                self.currentStatus = gameStatuses[1];
            } else if (!field.areCellsAvailable()) {
                self.currentStatus = gameStatuses[2];
            } else {
                iterator.moveNext();
                self.startTurn();
            }
        }
    };
};

function Factory(){
    let playerTypes = {
        'human' : 'Player',
        'computer' : 'ComputerPlayer'
    };

    this.createPlayer = function(type, name, symbol) {
        let player = null;
        type = type.toLowerCase();
        if(playerTypes[type] && playerTypes[type] !== undefined){
            player = new window[playerTypes[type]](name, symbol);
        }
        return player;
    };
};