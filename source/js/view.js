/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/********************** View **********************/
"use strict";

let view = new View();
let playerInstanceBlock = document.getElementById('player_instance_block');
let playerInstanceList = document.getElementsByClassName('player_instance');
let playerSymbolList = document.getElementsByClassName('player_symbol');
let availableSymbolList = view.getAvailableSymbolList();
let playerTypeList = view.getPlayerTypeList();

let rowsInput = document.getElementById('rowsInput');
let columnsInput = document.getElementById('columnsInput');
let winLengthInput = document.getElementById('winLengthInput');

/************ Building rows and columns ************/
rowsInput.value = view.getRows();
columnsInput.value = view.getColumns();
winLengthInput.value = view.getWinLength();

function increaseRows() {
    rowsInput.value = view.setRows(+rowsInput.value + 1);
}

function increaseColumns() {
    columnsInput.value = view.setColumns(+columnsInput.value + 1);
}

function increaseWinLength() {
    winLengthInput.value = view.setWinLength(+winLengthInput.value + 1);
}

function decreaseRows() {
    rowsInput.value = view.setRows(+rowsInput.value - 1);
}

function decreaseColumns() {
    columnsInput.value = view.setColumns(+columnsInput.value - 1);
}

function decreaseWinLength() {
    winLengthInput.value = view.setWinLength(+winLengthInput.value - 1);
}

/************ Building players ************/
let tmpl = document.getElementById('player_instance_template');

function getPlayerInstanceTemplate(player) {
    if ('content' in document.createElement('template')) {
        playerInstanceBlock.appendChild(tmpl.content.cloneNode(true));

        let playerElem = playerInstanceList[playerInstanceList.length-1];
        let option = new Option(player.symbol, player.symbol);
        playerElem.setAttribute('id', player.id);
        playerElem.querySelector('.form-group .player_name').value = player.name;
        playerElem.querySelector('.form-group .player_symbol').appendChild(option);
        createSymbolList(playerElem.querySelector('.form-group .player_symbol'));
        createTypeList(playerElem.querySelector('.form-group .player_type'));
    }
}

function addPlayer() {
    let defaultType = 'human';
    let defaultName = 'Player';
    let defaultSymbol = availableSymbolList[0];
    if (view.addPlayer(defaultType, defaultName, defaultSymbol)) {
        let list = view.getPlayerList();
        let newPlayer = list[list.length - 1];//we need to get fresh playerList
        getPlayerInstanceTemplate(newPlayer);
        updateSymbolList();
    }
}

function removePlayer(element) {
    let playerToRemove = element.parentNode.parentNode;
    let id = parseInt(playerToRemove.id, 10);

    if (view.removePlayer(id)) {
        playerInstanceBlock.removeChild(playerToRemove);
    }
}

function createSymbolList(element) {
    let selectedSymbol = element.options[element.selectedIndex];
    if (element.options.length > 1) {
        element.options.length = 0;
    }
    if (selectedSymbol) element.appendChild(selectedSymbol);
    for (let k = 0; k < availableSymbolList.length; k++) {
        let option = new Option(availableSymbolList[k], availableSymbolList[k]);
        element.appendChild(option);
    }
}

function createTypeList(element) {
    let playerId = element.parentNode.parentNode.id;
    for (let k in playerTypeList) {
        if (playerTypeList.hasOwnProperty(k)) {
            let selectedType = view.getPlayerList()[playerId].type === k;
            let option = new Option(k, k, selectedType, selectedType);
            element.appendChild(option);
        }

    }
}

function updateSymbolList() {
    for (let i = 0; i < playerSymbolList.length; i++) {
        createSymbolList(playerSymbolList[i]);
    }
}

function updatePlayer(element, prop) {
    let playerInstance = element.parentNode.parentNode;
    let newVal = view.updatePlayer(playerInstance.id, prop, element.value);
    if (prop === 'name') {
        playerInstance.querySelector('.form-group .player_name').value = newVal;
    }
    if (prop === 'symbol') {
        updateSymbolList();
    }
}






/************ View ************///???????!!!!!!
function View() {
    let _viewModel = new ViewModel();
    let _cells = document.getElementsByClassName("cell");
    let _occupiedCells;

    this.getRows = function() {
        return _viewModel.getRows();
    };

    this.getColumns = function() {
        return _viewModel.getColumns();
    };

    this.getWinLength = function() {
        return _viewModel.getWinLength();
    };

    this.setRows = function(rows) {
        return _viewModel.setRows(rows);
    };

    this.setColumns = function(cols) {
        return _viewModel.setColumns(cols);
    };

    this.setWinLength = function(len) {
        return _viewModel.setWinLength(len);
    };

    this.getPlayerList = function() {
        return _viewModel.getPlayerList();
    };

    this.getAvailableSymbolList = function() {
        return _viewModel.getAvailableSymbolList();
    };

    this.updatePlayer = function(id, prop, value) {
        return _viewModel.updatePlayer(id, prop, value);
    };

    this.addPlayer = function(type, name, symbol) {
        return _viewModel.addPlayer(type, name, symbol);
    };

    this.removePlayer = function(name) {
        return _viewModel.removePlayer(name);
    };

    this.getPlayerTypeList = function() {
        return _viewModel.getPlayerTypeList();
    };


    this.init = function(rows, columns) {
        let rowsUserSet = rows;
        let columnsUserSet = columns;

        _viewModel.init();
        createPlayField(rowsUserSet, columnsUserSet);
        createOccupiedCells(rowsUserSet, columnsUserSet);
        setListenerToCells();
        changeCurrentStatus();
    };

    function createPlayField(rows, columns) {
        let playField = document.getElementById('play_field');
        let fieldTbl = playField.appendChild(document.createElement('tbody'));

        for (let r = 0; r < rows; r++) {
            let rowField = document.createElement('tr');
            rowField.setAttribute('class', 'row');
            fieldTbl.appendChild(rowField);

            for (let c = 0; c < columns; c++) {
                let cellField = document.createElement('td');
                cellField.setAttribute('class', 'cell');
                cellField.setAttribute('id', r + '-' + c);
                rowField.appendChild(cellField);
            }
        }
    }

    function createOccupiedCells(rows, columns) {
        let arr = new Array(rows);

        for (let i = 0; i < rows; i++) {
            arr[i] = new Array(columns);
        }
        _occupiedCells = arr;
    }

    function setListenerToCells() {
        for (let i = 0; i < _cells.length; i++) {
            _cells[i].addEventListener("click", function() {
                let cellsRow = _cells[i].id.split('-')[0];
                let cellsCol = _cells[i].id.split('-')[1];

                _viewModel.finishTurn(+cellsRow, +cellsCol);
                updateCellContent();
                changeCurrentStatus();
            });
        }
    }

    function updateCellContent() {
        let fieldCellsArr = _viewModel.getFieldCells();

        for (let r = 0; r < fieldCellsArr.length; r++) {
            for (let c = 0; c < fieldCellsArr[r].length; c++) {
                if (fieldCellsArr[r][c] !== undefined
                    && fieldCellsArr[r][c] !== _occupiedCells[r][c]) {
                    _cells[r + '-' + c].innerHTML = fieldCellsArr[r][c];
                }
                _occupiedCells[r][c] = fieldCellsArr[r][c];
            }
        }
    }

    function changeCurrentStatus() {
        let statusField = document.getElementById("gameStatus");
        statusField.innerHTML = _viewModel.getPlayerName() + ' is ' + _viewModel.getCurrentStatus();
    }
}

/************ Starting game ************/
function startGame() {
    view.init(view.getRows(rowsInput.value), view.getColumns(columnsInput.value));
}

window.onload = function() {
    let list = view.getPlayerList();
    for (let i = 0; i < list.length; i++) {
        getPlayerInstanceTemplate(list[i]);
    }
};


