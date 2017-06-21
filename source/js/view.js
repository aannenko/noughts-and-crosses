/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/********************** View **********************/
"use strict";

let viewModel = new ViewModel();
let occupiedCells;
let playField = document.getElementById('play_field');
let rowsInput = document.getElementById('rowsInput');
let columnsInput = document.getElementById('columnsInput');
let winLengthInput = document.getElementById('winLengthInput');
let playerInstanceBlock = document.getElementById('player_instance_block');
let cells = document.getElementsByClassName("cell");
let availableSymbolList = viewModel.getAvailableSymbolList();

/************ Starting game ************/
window.onload = function() {
    let list = viewModel.getPlayerList();
    rowsInput.value = viewModel.getRows();
    columnsInput.value = viewModel.getColumns();
    winLengthInput.value = viewModel.getWinLength();

    for (let i = 0; i < list.length; i++) {
        getPlayerInstanceTemplate(list[i]);
    }
};

function getPlayerInstanceTemplate(player) {
    let template = document.getElementById('player_instance_template');
    let playerInstanceList = document.getElementsByClassName('player_instance');

    if ('content' in document.createElement('template')) {
        playerInstanceBlock.appendChild(template.content.cloneNode(true));

        let playerElem = playerInstanceList[playerInstanceList.length - 1];
        let optionSymbol = new Option(player.symbol, player.symbol);

        playerElem.setAttribute('id', player.id);
        playerElem.querySelector('.form-group .player_name').value = player.name;
        playerElem.querySelector('.form-group .player_symbol').appendChild(optionSymbol);
        createSymbolList(playerElem.querySelector('.form-group .player_symbol'));
        createTypeList(player, playerElem.querySelector('.form-group .player_type'));
    }
}

function createSymbolList(element) {
    let selectedSymbol = element.options[element.selectedIndex];

    if (element.options.length > 1) element.options.length = 0;
    if (selectedSymbol) element.appendChild(selectedSymbol);

    for (let i = 0; i < availableSymbolList.length; i++) {
        let option = new Option(availableSymbolList[i], availableSymbolList[i]);
        element.appendChild(option);
    }
}

function createTypeList(player, element) {
    let playerTypeList = viewModel.getPlayerTypeList();

    for (let k in playerTypeList) {
        if (playerTypeList.hasOwnProperty(k)) {
            let selectedType = (player.type === k);
            let option = new Option(k, k, selectedType, selectedType);
            element.appendChild(option);
        }
    }
}

function startGame() {
    if (playField.hasChildNodes()) {
        viewModel.refreshFieldCells();
        updatePlayerField();
    }
    init(rowsInput.value, columnsInput.value);
}

function reloadGame() {
    window.location.reload();
}

function updatePlayerField() {
    let oldTbody = document.getElementById('fieldTbody');
    if (oldTbody) {
        playField.removeChild(oldTbody);
    }
}

function init(rows, columns) {
    viewModel.init();
    createPlayField(rows, columns);
    createOccupiedCells(rows, columns);
    setListenerToCells();
    changeCurrentStatus();
}

function createPlayField(rows, columns) {
    let fieldTbody = playField.appendChild(document.createElement('tbody'));
    fieldTbody.setAttribute('id', 'fieldTbody');

    for (let r = 0; r < rows; r++) {
        let rowField = document.createElement('tr');
        fieldTbody.appendChild(rowField);

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
    occupiedCells = arr;
}

function setListenerToCells() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", function() {
            let cellsRow = cells[i].id.split('-')[0];
            let cellsCol = cells[i].id.split('-')[1];

            viewModel.finishTurn(+cellsRow, +cellsCol);
            updateCellContent();
            changeCurrentStatus();
        });
    }
}

function updateCellContent() {
    let fieldCellsArr = viewModel.getFieldCells();

    for (let r = 0; r < fieldCellsArr.length; r++) {
        for (let c = 0; c < fieldCellsArr[r].length; c++) {
            if (fieldCellsArr[r][c] !== undefined
                && fieldCellsArr[r][c] !== occupiedCells[r][c]) {
                cells[r + '-' + c].innerHTML = fieldCellsArr[r][c];
            }
            occupiedCells[r][c] = fieldCellsArr[r][c];
        }
    }
}

function changeCurrentStatus() {
    let statusField = document.getElementById("gameStatus");
    statusField.innerHTML = viewModel.getPlayerName() + ' is ' + viewModel.getCurrentStatus();
}

/************ Building rows and columns ************/
function increaseRows() {
    rowsInput.value = viewModel.setRows(+rowsInput.value + 1);
}

function increaseColumns() {
    columnsInput.value = viewModel.setColumns(+columnsInput.value + 1);
}

function increaseWinLength() {
    winLengthInput.value = viewModel.setWinLength(+winLengthInput.value + 1);
}

function decreaseRows() {
    rowsInput.value = viewModel.setRows(+rowsInput.value - 1);
}

function decreaseColumns() {
    columnsInput.value = viewModel.setColumns(+columnsInput.value - 1);
}

function decreaseWinLength() {
    winLengthInput.value = viewModel.setWinLength(+winLengthInput.value - 1);
}

/************ Building players ************/
function updatePlayer(element, prop) {
    let playerInstance = element.parentNode.parentNode;
    let newVal = viewModel.updatePlayer(playerInstance.id, prop, element.value);
    if (prop === 'name') {
        playerInstance.querySelector('.form-group .player_name').value = newVal;
    }
    if (prop === 'symbol') {
        updateSymbolList();
    }
}

function addPlayer() {
    let defaultType = 'human';
    let defaultName = 'Player';
    let defaultSymbol = availableSymbolList[0];
    if (viewModel.addPlayer(defaultType, defaultName, defaultSymbol)) {
        let list = viewModel.getPlayerList();
        let newPlayer = list[list.length - 1];
        getPlayerInstanceTemplate(newPlayer);
        updateSymbolList();
    }
}

function removePlayer(element) {
    let playerToRemove = element.parentNode.parentNode;
    let id = parseInt(playerToRemove.id, 10);

    if (viewModel.removePlayer(id)) {
        playerInstanceBlock.removeChild(playerToRemove);
    }
}

function updateSymbolList() {
    let playerSymbolList = document.getElementsByClassName('player_symbol');
    for (let i = 0; i < playerSymbolList.length; i++) {
        createSymbolList(playerSymbolList[i]);
    }
}
