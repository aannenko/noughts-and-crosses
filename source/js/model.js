/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/********************** Model **********************/
"use strict";
let playerTypes = {
    'human': 'Player',
    'computer': 'ComputerPlayer'
};

let gameDataManagerSingleton = (function() {
    let _instance;

    function GameDataManager() {
        let _symbolCollection = [
            'X', 'O', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
            'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Y', 'Z'
        ];

        let _playerList = [
            {type: 'human', name: 'Player', symbol: _symbolCollection[0]},
            {type: 'computer', name: 'Computer', symbol: _symbolCollection[1]}
        ];

        let _rows = 3;
        let _columns = 3;
        let _winLength = 3;

        let _availableSymbolsList = (function() {
            let collection = _symbolCollection.slice(0);
            for (let j = 0; j < _playerList.length; j++) {
                collection.splice(collection.indexOf(_playerList[j].symbol), 1);
            }
            return collection;
        })();

        this.getRows = function() {
            return _rows;
        };

        this.getColumns = function() {
            return _columns;
        };

        this.getWinLength = function() {
            return _winLength;
        };

        this.setRows = function(rows) {
            if (Number.isInteger(rows)
                && rows > 2
                && rows <= 10) {
                    _rows = rows;
                    validateWinLength(rows);
            }
            return _rows;
        };

        this.setColumns = function(columns) {
            if (Number.isInteger(columns)
                && columns > 2
                && columns <= 10) {
                    _columns = columns;
                    validateWinLength(columns);
            }
            return _columns;
        };

        this.setWinLength = function(winLength) {
            if (Number.isInteger(winLength)
                && winLength > 2
                && winLength <= getDiagonal()) {
                    _winLength = winLength;
            }
            return _winLength;
        };

        this.getPlayerList = function() {
            return _playerList.slice(0);
        };

        this.updatePlayer = function(name, prop, value) {
            let oldPlayerSymbol;
            prop = prop.toLowerCase();

            if (prop !== 'type') {
                let player = _playerList.find(function(item) {
                    return item.name === name;
                });
                if (player === undefined) {
                    return;
                }
                oldPlayerSymbol = player.symbol;
                player[prop] = value;
            }
            if (prop === 'symbol') {
                _availableSymbolsList.splice(_availableSymbolsList.indexOf(value), 1);
                _availableSymbolsList.push(oldPlayerSymbol);
            }
        };

        this.addPlayer = function(type, name, symbol) {
            let tempName = name;
            let index = 1;
            type = type.toLowerCase();
            if (canAddPlayer()
                && playerTypes[type]
                && playerTypes[type] !== undefined
                && getAvailableSymbols().includes(symbol)) {
                for (let i = 0; i < _playerList.length; i++) {
                    if (_playerList[i].name === tempName) {
                        tempName = name + '' + index;
                        index++;
                    }
                }
                let newPlayer = {type: type, name: tempName, symbol: symbol};
                _playerList.splice(_playerList.length, 0, newPlayer);
                _availableSymbolsList.splice(_availableSymbolsList.indexOf(symbol), 1);
            }
        };

        this.removePlayer = function(name) {
            if (canRemovePlayer()) {
                for (let i = 0; i < _playerList.length; i++) {
                    if (_playerList[i].name === name) {
                        _availableSymbolsList.push(_playerList[i].symbol);
                        _playerList.splice(i, 1);
                    }
                }
            }
        };

        function getAvailableSymbols() {
            return _availableSymbolsList.slice(0);
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
            return _playerList.length < getDiagonal() - 1;
        }

        function canRemovePlayer() {
            return _playerList.length > 2;
        }
    }

    return {
        getInstance: function() {
            if (!_instance) {
                _instance = new GameDataManager();
            }
            return _instance;
        }
    };
})();

let fieldSingleton = (function() {
    let _instance;

    function Field(rows, columns) {
        let _self = this;
        let _fieldCells = createFieldCells();

        this.fieldCells = getFieldCellsCopy();

        this.updateCell = function(row, col, obj) {
            if (_fieldCells[row][col] === undefined) {
                _fieldCells[row][col] = obj;
                _self.fieldCells = getFieldCellsCopy();
                return true;
            }
            else {
                return false;
            }
        };

        this.getEmptyCells = function() {
            let emptyCells = [];

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < columns; c++) {
                    if (_fieldCells[r][c] === undefined) {
                        emptyCells.push({row: r, col: c});
                    }
                }
            }
            return emptyCells;
        };

        this.areCellsAvailable = function() {
            return _self.getEmptyCells().length > 0;
        };

        function createFieldCells() {
            let cells = new Array(rows);
            for (let i = 0; i < rows; i++) {
                cells[i] = new Array(columns);
            }
            return cells;
        }

        function getFieldCellsCopy() {
            return _fieldCells.map(function(arr) {
                return arr.slice();
            });
        }
    }

    return {
        getInstance: function() {
            let rows = gameDataManagerSingleton.getInstance().getRows();
            let columns = gameDataManagerSingleton.getInstance().getColumns();
            if (!_instance) {
                _instance = new Field(rows, columns);
            }
            return _instance;
        }
    };
})();

function WinnerChecker() {
    let _field = fieldSingleton.getInstance();
    let _winningLength = gameDataManagerSingleton.getInstance().getWinLength();
    let _directionPairsList = [
        [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    this.isWinnerFound = function(row, col, obj) {
        for (let i = 0; i < _directionPairsList.length; i++) {
            let winArray = [];
            let currentCell = [{row: row, col: col, obj: obj}];
            winArray.push(currentCell);

            for (let j = 0; j < _directionPairsList[i].length; j++) {
                let nextCell = getNextCell(currentCell, _directionPairsList[i][j]);
                while (nextCell !== null) {
                    winArray.push(nextCell);
                    if (winArray.length === _winningLength) {
                        return true;
                    }
                    nextCell = getNextCell(nextCell, _directionPairsList[i][j]);
                }
            }
        }
        return false;
    };

    function getNextCell(currentCell, direction) {
        let next;
        switch (direction) {
            case 0: /*up*/
                next = [{row: currentCell[0].row - 1, col: currentCell[0].col, obj: currentCell[0].obj}];
                break;
            case 1: /*top right*/
                next = [{row: currentCell[0].row - 1, col: currentCell[0].col + 1, obj: currentCell[0].obj}];
                break;
            case 2: /*right*/
                next = [{row: currentCell[0].row, col: currentCell[0].col + 1, obj: currentCell[0].obj}];
                break;
            case 3: /*down right*/
                next = [{row: currentCell[0].row + 1, col: currentCell[0].col + 1, obj: currentCell[0].obj}];
                break;
            case 4: /*down*/
                next = [{row: currentCell[0].row + 1, col: currentCell[0].col, obj: currentCell[0].obj}];
                break;
            case 5: /*down left*/
                next = [{row: currentCell[0].row + 1, col: currentCell[0].col - 1, obj: currentCell[0].obj}];
                break;
            case 6: /*left*/
                next = [{row: currentCell[0].row, col: currentCell[0].col - 1, obj: currentCell[0].obj}];
                break;
            case 7: /*top left*/
                next = [{row: currentCell[0].row - 1, col: currentCell[0].col - 1, obj: currentCell[0].obj}];
                break;
            default:
                next = null;
                break;
        }

        if (next !== null
            && isCellInField(next)
            && _field.fieldCells[next[0].row][next[0].col] === currentCell[0].obj) {
            return next;
        } else {
            return null;
        }
    }

    function isCellInField(cellObject) {
        let row = cellObject[0].row;
        let col = cellObject[0].col;
        return row >= 0
            && col >= 0
            && row < _field.fieldCells.length
            && col < _field.fieldCells[0].length;
    }
}

function Player(name, symbol) {
    this.playerName = name;
    this.playerSymbol = symbol;

    this.startMove = function(game) {
    };
    this.finishMove = function(row, col) {
        return fieldSingleton.getInstance().updateCell(row, col, this.playerSymbol);
    };
}

function ComputerPlayer(name, symbol) {
    Player.apply(this, arguments);

    this.startMove = function(game) {
        let randomCell = findRandomCell();
        game.finishTurn(randomCell.row, randomCell.col);
    };

    function findRandomCell() {
        let emptyCellsArr = fieldSingleton.getInstance().getEmptyCells();
        let min = 0;
        let max = emptyCellsArr.length > 0 ? emptyCellsArr.length - 1 : 0;
        let random = Math.floor(Math.random() * (max - min + 1)) + min;
        return emptyCellsArr[random];
    }
}

ComputerPlayer.prototype = Object.create(Player.prototype);
ComputerPlayer.prototype.constructor = ComputerPlayer;

function Iterator(array) {
    let _index = 0;

    this.getCurrent = function() {
        return array[_index];
    };

    this.moveNext = function() {
        _index = _index === array.length - 1 ? 0 : ++_index;
    };
}

function State(status, player, field) {
    this.currentStatus = status;
    this.currentPlayerName = player;
    this.fieldCells = field;
}

function Game() {
    let _self = this;
    let _gameStatusList = ['Playing', 'Winner', 'Tie'];
    let _currentStatus = _gameStatusList[0];
    let _field = fieldSingleton.getInstance();
    let _winnerChecker = new WinnerChecker();
    let _iterator = new Iterator(getPlayersArray());

    this.state = getFreshState();

    this.startTurn = function() {
        _iterator.getCurrent().startMove(_self);
    };

    this.finishTurn = function(row, col) {
        if (_currentStatus === _gameStatusList[0] && _iterator.getCurrent().finishMove(row, col)) {
            if (_winnerChecker.isWinnerFound(row, col, _iterator.getCurrent().playerSymbol)) {
                _currentStatus = _gameStatusList[1];
            } else if (!_field.areCellsAvailable()) {
                _currentStatus = _gameStatusList[2];
            } else {
                _iterator.moveNext();
                _self.startTurn();
            }
            _self.state = getFreshState();
        }
    };

    function getPlayersArray() {
        let array = [];
        let players = gameDataManagerSingleton.getInstance().getPlayerList();

        players.forEach(function(item) {
            array.push(new window[playerTypes[item.type]](item.name, item.symbol));
        });
        return array;
    }

    function getFreshState() {
        let currentPlayerName = _iterator.getCurrent().playerName;
        return new State(_currentStatus, currentPlayerName, _field.fieldCells);
    }
}