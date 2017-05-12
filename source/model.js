/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/********************** Model **********************/
"use strict";
function GamePreset() {
    this.players = [
        {type: 'human', name: 'Player', symbol: 'X'},
        {type: 'computer', name: 'Computer', symbol: 'O'}
    ];
    this.rows = 3;
    this.columns = 3;
    this.winningLineLength = 3;
};

let gamePreset = new GamePreset();

let singletonField = (function(){
    let instance;

    function Field(rows, columns){
        let self = this;
        this.fieldCells = createFieldCells();

        function createFieldCells(){
            let cells = new Array(rows);
            for (let i = 0; i < rows; i++){
                cells[i] = new Array(columns);
            }
            return cells;
        };

        this.updateCell = function (row, col, obj) {
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
        };
    }

    return {
        getInstance: function(){
            let rows = gamePreset.rows;
            let columns = gamePreset.columns;
            if(!instance){
                instance = new Field(rows, columns);
            }
            return instance;
        }
    };
})();

function WinnerChecker(){
    let field = singletonField.getInstance();
    let directionPairsList = [
        [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    this.isWinnerFound = function(row, col, obj){
        for (let i = 0; i < directionPairsList.length; i++) {
            let winArray = [];
            let currentCell = [{row: row, col: col, object: obj}];
            winArray.push(currentCell);
            for (let j = 0; j < directionPairsList[i].length; j++) {
                let nextCell = getNextCell(currentCell, directionPairsList[i][j]);
                while (nextCell !== null) {
                    winArray.push(nextCell);
                    if (winArray.length === gamePreset.winningLineLength){
                        return true;
                    }
                    nextCell = getNextCell(nextCell, directionPairsList[i][j]);
                }
            }
        }
        return false;
    };

    function getNextCell(currentCell, direction){
        let next;
        switch(direction){
            case 0: /*up*/
                next = [{row: currentCell[0].row-1, col: currentCell[0].col, object: currentCell[0].object}];
                break;
            case 1: /*top right*/
                next = [{row: currentCell[0].row-1, col: currentCell[0].col+1, object: currentCell[0].object}];
                break;
            case 2: /*right*/
                next = [{row: currentCell[0].row, col: currentCell[0].col+1, object: currentCell[0].object}];
                break;
            case 3: /*down right*/
                next = [{row: currentCell[0].row+1, col: currentCell[0].col+1, object: currentCell[0].object}];
                break;
            case 4: /*down*/
                next = [{row: currentCell[0].row+1, col: currentCell[0].col, object: currentCell[0].object}];
                break;
            case 5: /*down left*/
                next = [{row: currentCell[0].row+1, col: currentCell[0].col-1, object: currentCell[0].object}];
                break;
            case 6: /*left*/
                next = [{row: currentCell[0].row, col: currentCell[0].col-1, object: currentCell[0].object}];
                break;
            case 7: /*top left*/
                next = [{row: currentCell[0].row-1, col: currentCell[0].col-1, object: currentCell[0].object}];
                break;
            default:
                next = null;
                break;
        }

        if (next !== null &&
            isCellInField(next) &&
            field.fieldCells[next[0].row][next[0].col] === currentCell[0].object){
            return next;
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
        return singletonField.getInstance().updateCell(row, col, this.playerSymbol);
    };
};

function ComputerPlayer(name, symbol){
    Player.apply(this, arguments);

    this.startMove = function(game){
        let randomCell = findRandomCell();
        game.finishTurn(randomCell.row, randomCell.col);
    };

    function findRandomCell(){
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

    this.setNext = function(){
        index = index === array.length - 1 ? 0 : ++index;
    };
};

function PlayersCreator() {
    this.updatePlayer = function(playerName, prop, value){
        gamePreset.players.find(function(item){
            return item.name === playerName;
        })[prop] = value;
    };

    this.addPlayer = function(type, name, symbol){
        let newPlayer = {
            type: type,
            name: name,
            symbol: symbol
        };
        gamePreset.players.splice(gamePreset.players.length, 0, newPlayer);
    };

    this.deletePlayer = function(name){
        for(let i = 0; i < gamePreset.players.length; i++){
            if(gamePreset.players[i].name === name){
                gamePreset.players.splice(i, 1);
            }
        }
    };
}

function Game(){
    let self = this;
    let gameStatusList = ['Playing', 'Winner', 'Tie'];
    let field = singletonField.getInstance();
    let winnerChecker = new WinnerChecker();
    let iterator = new Iterator(getPlayersArray());

    function getPlayersArray(){
        let array = [];
        let factory = new Factory();
        let players = gamePreset.players.slice(0);

        players.forEach(function(item){
            array.push(factory.createPlayer(item.type, item.name, item.symbol));
        });
        return array;
    };

    this.currentStatus = gameStatusList[0];

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
        if (self.currentStatus === gameStatusList[0] && iterator.getCurrent().finishMove(row, col)) {
            if (winnerChecker.isWinnerFound(row, col, iterator.getCurrent().playerSymbol)) {
                self.currentStatus = gameStatusList[1];
            } else if (!field.areCellsAvailable()) {
                self.currentStatus = gameStatusList[2];
            } else {
                iterator.setNext();
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