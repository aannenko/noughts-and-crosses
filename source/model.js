/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/********************** Model **********************/
"use strict";
let singletonField = (function(){
    let instance;

    function Field(rows, columns){
        let self = this;

        this.fieldCells = [];

        this.fieldCellsCreate = function(){
            this.fieldCells = new Array(rows);
            for (let i = 0; i < rows; i++){
                this.fieldCells[i] = new Array(columns);
            }
            return this.fieldCells;
        };
        this.fieldCellsCreate();

        this.updateCell = function(row, col, obj){
            if (self.fieldCells[row][col] === undefined) {
                self.fieldCells[row][col] = obj;
                return true;
            }
            else {
                return false;
            }
        };

        this.getEmptyCells = function(){
            let emptyCells = [];

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < columns; c++){
                    if (self.fieldCells[r][c] === undefined) {
                        emptyCells.push({ row : r, col : c});
                    }
                }
            }
            return emptyCells;
        };

        this.areCellsAvailable = function(){
            return self.getEmptyCells().length > 0;
        }
    };

    return {
        getInstance: function(rows, columns){
            if(!instance){
                instance = new Field(rows, columns);
            }
            return instance;
        }
    };
})();

function WinnerChecker(field, winCombinationLength){
    let directions = [
        [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    this.getWinner = function(row, col, obj){
        for (let i = 0; i < directions.length; i++) {
            let winArray = [];
            let currentCell = [{row: row, col: col, object: obj}];
            winArray.push(currentCell);
            for (let j = 0; j < directions[i].length; j++) {
                let nextGameCell = getNextCell(currentCell, directions[i][j]);
                while (nextGameCell !== null) {
                    winArray.push(nextGameCell);
                    if (winArray.length === winCombinationLength){
                        return true;
                    }
                    nextGameCell = getNextCell(nextGameCell, directions[i][j]);
                }
            }
        }
        return false;
    };

    function getNextCell(currentCell, direction){
        let nextCell;
        switch(direction){
            case 0: /*up*/
                nextCell = [{row: currentCell[0].row-1, col: currentCell[0].col, object: currentCell[0].object}];
                break;
            case 1: /*top right*/
                nextCell = [{row: currentCell[0].row-1, col: currentCell[0].col+1, object: currentCell[0].object}];
                break;
            case 2: /*right*/
                nextCell = [{row: currentCell[0].row, col: currentCell[0].col+1, object: currentCell[0].object}];
                break;
            case 3: /*down right*/
                nextCell = [{row: currentCell[0].row+1, col: currentCell[0].col+1, object: currentCell[0].object}];
                break;
            case 4: /*down*/
                nextCell = [{row: currentCell[0].row+1, col: currentCell[0].col, object: currentCell[0].object}];
                break;
            case 5: /*down left*/
                nextCell = [{row: currentCell[0].row+1, col: currentCell[0].col-1, object: currentCell[0].object}];
                break;
            case 6: /*left*/
                nextCell = [{row: currentCell[0].row, col: currentCell[0].col-1, object: currentCell[0].object}];
                break;
            case 7: /*top left*/
                nextCell = [{row: currentCell[0].row-1, col: currentCell[0].col-1, object: currentCell[0].object}];
                break;
            default:
                nextCell = null;
                break;
        }

        if (nextCell !== null &&
            isCellInField(nextCell) &&
            field.fieldCells[nextCell[0].row][nextCell[0].col] === currentCell[0].object){
            return nextCell;
        } else {
            return null;
        }
    }

    function isCellInField(cellObject){
        let row = cellObject[0].row;
        let col = cellObject[0].col;
        return row >= 0
            && col >= 0
            && row < field.fieldCells.length
            && col < field.fieldCells[0].length;
    }
};

function Player(name, symbol){
    this.playerName = name;
    this.playerSymbol = symbol;

    this.startMove = function(game){ };
    this.finishMove = function(row, col){
        return singletonField.getInstance(row, col).updateCell(row, col, this.playerSymbol);
    };
};

function ComputerPlayer(name, symbol){
    Player.apply(this, arguments);

    this.startMove = function(game){
        let computerCellNum = cellFinder();
        game.finishTurn(computerCellNum.row, computerCellNum.col);
    };

    function cellFinder(){
        let emptyCellsArr = singletonField.getInstance(/*row, col ???*/).getEmptyCells();//????
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
        index = index === array.length-1 ? 0 : ++index;
    };
};

function Game(players, rows, columns, winCombinationLength){
    let self = this;
    let gameStatuses = ['Playing', 'Winner', 'Tie'];
    let field = singletonField.getInstance(rows, columns);
    let winnerChecker = new WinnerChecker(field, winCombinationLength);
    let iterator = new Iterator(players);

    this.currentStatus = gameStatuses[0];

    this.getCurrentPlayerName = function(){
        return iterator.getCurrent().playerName;
    };

    this.getFieldCells = function(){
        return field.fieldCells.slice(0);
    };

    this.startTurn = function(){
        iterator.getCurrent().startMove(self);
    };

    this.finishTurn = function(row, col){
        if (self.currentStatus === gameStatuses[0] && iterator.getCurrent().finishMove(row, col)) {
            if (winnerChecker.getWinner(row, col, iterator.getCurrent().playerSymbol)) {
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