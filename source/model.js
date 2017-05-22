/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/********************** Model **********************/
"use strict";
let playerTypes = {
    'human' : 'Player',
    'computer' : 'ComputerPlayer'
};

let singletonGameDataManager;
singletonGameDataManager = (function () {
    let instance;

    function GameDataManager() {
        let symbolCollection = [
            'X', 'O', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
            'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Y', 'Z'
        ];

        let players = [
            {type: 'human', name: 'Player', symbol: symbolCollection[0]},
            {type: 'computer', name: 'Computer', symbol: symbolCollection[1]}
        ];

        let _rows = 3;
        let _columns = 3;
        let _winLength = 3;

        let availableSymbolsList = (function(){
            let collection = symbolCollection.slice(0);
            for (let j = 0; j < players.length; j++) {
                collection.splice(collection.indexOf(players[j].symbol), 1);
            }
            return collection;
        })();

        this.getRows = function () {
            return _rows;
        };

        this.getColumns = function () {
            return _columns;
        };

        this.getWinLength = function () {
            return _winLength;
        };

        this.setRows = function (rows) {
            if (Number.isInteger(rows) && rows > 2 && rows <= 10) {
                _rows = rows;
                validateWinLength(rows);
            }
        };

        this.setColumns = function (columns) {
            if (Number.isInteger(columns) && columns > 2 && columns <= 10) {
                _columns = columns;
                validateWinLength(columns);
            }
        };

        this.setWinLength = function (winLength) {
            if (Number.isInteger(winLength) && winLength > 2 && winLength <= getDiagonal()) {
                _winLength = winLength;
            }
        };

        this.getPlayerList = function () {
            return players.slice(0);
        };

        this.updatePlayer = function (name, prop, value) {
            let oldPlayerSymbol;
            prop = prop.toLowerCase();

            if (prop !== 'type') {
                let player = players.find(function (item){
                    return item.name === name;
                });
                if (player === undefined) {
                    return;
                }
                oldPlayerSymbol = player.symbol;
                player[prop] = value;
            }
            if (prop === 'symbol') {
                availableSymbolsList.splice(availableSymbolsList.indexOf(value), 1);
                availableSymbolsList.push(oldPlayerSymbol);
            }
        };

        this.addPlayer = function(type, name, symbol){
            let tempName = name;
            let index = 1;
            type = type.toLowerCase();
            if (canAddPlayer()
                && playerTypes[type]
                && playerTypes[type] !== undefined
                && getAvailableSymbols().includes(symbol)) {
                for (let i = 0; i < players.length; i++) {
                    if (players[i].name === tempName) {
                        tempName = name + '' + index;
                        index++;
                    }
                }
                let newPlayer = {type: type, name: tempName, symbol: symbol};
                players.splice(players.length, 0, newPlayer);
                availableSymbolsList.splice(availableSymbolsList.indexOf(symbol), 1);
            }
        };

        this.removePlayer = function(name){
            if (canRemovePlayer()) {
                for (let i = 0; i < players.length; i++) {
                    if (players[i].name === name) {
                        availableSymbolsList.push(players[i].symbol);
                        players.splice(i, 1);
                    }
                }
            }
        };

        function getAvailableSymbols() {
            return availableSymbolsList.slice(0);
        }

        function validateWinLength(x) {
            if (x < _winLength) {
                _winLength = x;
            }
        }

        function getDiagonal() {
            return (_columns - _rows) < 0 ? _columns : _rows;
        }

        function canAddPlayer() {
            return players.length < getDiagonal() - 1;
        }

        function canRemovePlayer() {
            return players.length > 2;
        }
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = new GameDataManager();
            }
            return instance;
        }
    };
})();

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
        }

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
                for (let c = 0; c < columns; c++) {
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
            let rows = singletonGameDataManager.getInstance().getRows();
            let columns = singletonGameDataManager.getInstance().getColumns();
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
            let currentCell = [{row: row, col: col, obj: obj}];
            winArray.push(currentCell);

            for (let j = 0; j < directionPairsList[i].length; j++) {
                let nextCell = getNextCell(currentCell, directionPairsList[i][j]);
                while (nextCell !== null) {
                    winArray.push(nextCell);
                    if (winArray.length === singletonGameDataManager.getInstance().getWinLength()){
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
                next = [{row: currentCell[0].row-1, col: currentCell[0].col, obj: currentCell[0].obj}];
                break;
            case 1: /*top right*/
                next = [{row: currentCell[0].row-1, col: currentCell[0].col+1, obj: currentCell[0].obj}];
                break;
            case 2: /*right*/
                next = [{row: currentCell[0].row, col: currentCell[0].col+1, obj: currentCell[0].obj}];
                break;
            case 3: /*down right*/
                next = [{row: currentCell[0].row+1, col: currentCell[0].col+1, obj: currentCell[0].obj}];
                break;
            case 4: /*down*/
                next = [{row: currentCell[0].row+1, col: currentCell[0].col, obj: currentCell[0].obj}];
                break;
            case 5: /*down left*/
                next = [{row: currentCell[0].row+1, col: currentCell[0].col-1, obj: currentCell[0].obj}];
                break;
            case 6: /*left*/
                next = [{row: currentCell[0].row, col: currentCell[0].col-1, obj: currentCell[0].obj}];
                break;
            case 7: /*top left*/
                next = [{row: currentCell[0].row-1, col: currentCell[0].col-1, obj: currentCell[0].obj}];
                break;
            default:
                next = null;
                break;
        }

        if (next !== null
            && isCellInField(next)
            && field.fieldCells[next[0].row][next[0].col] === currentCell[0].obj) {
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
}

function Player(name, symbol){
    this.playerName = name;
    this.playerSymbol = symbol;

    this.startMove = function(game){ };
    this.finishMove = function(row, col){
        return singletonField.getInstance().updateCell(row, col, this.playerSymbol);
    };
}

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
    }
}

ComputerPlayer.prototype = Object.create(Player.prototype);
ComputerPlayer.prototype.constructor = ComputerPlayer;

function Iterator(array) {
    let index = 0;

    this.getCurrent = function(){
        return array[index];
    };

    this.moveNext = function(){
        index = index === array.length - 1 ? 0 : ++index;
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
        let players = singletonGameDataManager.getInstance().getPlayerList();

        players.forEach(function(item){
            array.push(new window[playerTypes[item.type]](item.name, item.symbol));
        });
        return array;
    }

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
                iterator.moveNext();
                self.startTurn();
            }
        }
    };
}