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
let playerInstancesCollection = document.getElementById('player_instances_collection');
let cellsCollection = document.getElementsByClassName("cell");
let template = document.getElementById('player_instance_template');

function getAvailableSymbolsList() {
    return viewModel.getAvailableSymbolsList();
}

/************ Starting game ************/
window.onload = function() {
    rowsInput.value = viewModel.getRows();
    columnsInput.value = viewModel.getColumns();
    winLengthInput.value = viewModel.getWinLength();

    let list = viewModel.getPlayersCollection();
    for (let i = 0; i < list.length; i++) {
        addPlayerInstance(list[i]);
    }
    updateSymbolsList();
};

function addPlayerInstance(player) {
    playerInstancesCollection.appendChild(template.content.cloneNode(true));

    let playerInstancesList = document.getElementsByClassName('player_instance');
    let playerInstance = playerInstancesList[playerInstancesList.length - 1];
    let nameField = playerInstance.querySelector('.form-group .player_name');
    let symbolField = playerInstance.querySelector('.form-group .player_symbol');
    let symbolOption = new Option(player.symbol, player.symbol, true, true);
    let typeSelect = playerInstance.querySelector('.form-group .player_type');

    playerInstance.setAttribute('id', player.id);
    nameField.value = player.name;
    symbolField.appendChild(symbolOption);
    createTypeList(player.type, typeSelect);
}

function updateSymbolsList() {
    let selectsCollection = document.getElementsByClassName('player_symbol');
    let availableSymbols = getAvailableSymbolsList();

    for (let k = 0; k < selectsCollection.length; k++) {
        let selectedOption = selectsCollection[k].options[selectsCollection[k].selectedIndex];
        selectsCollection[k].options.length = 0;

        if (selectedOption) selectsCollection[k].appendChild(selectedOption);
        for (let i = 0; i < availableSymbols.length; i++) {
            let option = new Option(availableSymbols[i], availableSymbols[i]);
            selectsCollection[k].appendChild(option);
        }
    }
}

function createTypeList(playerType, select) {
    let playerTypeList = viewModel.getPlayerTypeList();

    for (let type in playerTypeList) {
        if (playerTypeList.hasOwnProperty(type)) {
            let selectedType = (playerType === type);
            let option = new Option(type, type, selectedType, selectedType);
            select.appendChild(option);
        }
    }
}

function startGame() {
    let rows = viewModel.getRows();
    let columns = viewModel.getColumns();

    viewModel.startGame();
    createPlayField(rows, columns);
    buildOccupiedCellsArray(rows, columns);
    updateFieldCellsContent();
    changeCurrentStatus();
}

function createPlayField(rows, columns) {
    playField.innerHTML = '';

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
            setListenerToCell(cellField);
        }
    }
}

function buildOccupiedCellsArray(rows, columns) {
    let arr = new Array(rows);

    for (let i = 0; i < rows; i++) {
        arr[i] = new Array(columns);
    }
    occupiedCells = arr;
}

function setListenerToCell(cell) {
    cell.addEventListener("click", function() {
        let cellsRow = cell.id.split('-')[0];
        let cellsCol = cell.id.split('-')[1];

        viewModel.finishTurn(+cellsRow, +cellsCol);
        updateFieldCellsContent();
        changeCurrentStatus();
    });
}

function updateFieldCellsContent() {
    let fieldCellsArr = viewModel.getFieldCells();

    for (let r = 0; r < fieldCellsArr.length; r++) {
        for (let c = 0; c < fieldCellsArr[r].length; c++) {
            if (fieldCellsArr[r][c] !== undefined
                && occupiedCells[r][c] !== true) {

                document.getElementById(r + '-' + c).innerHTML = fieldCellsArr[r][c];
                occupiedCells[r][c] = true;
            }
        }
    }
}

function changeCurrentStatus() {
    document.getElementById("gameStatus").innerHTML = viewModel.getPlayerName() + ' is ' + viewModel.getCurrentStatus();
}

(function templatePolyfill(d) {
    if ('content' in d.createElement('template')) {
        return false;
    }

    let templ = d.getElementsByTagName('template'),
        elementTempl,
        templContent,
        documentContent;

    for (let x = 0; x < templ.length; ++x) {
        elementTempl = templ[x];
        templContent = elementTempl.childNodes;
        documentContent = d.createDocumentFragment();

        while (templContent[0]) {
            documentContent.appendChild(templContent[0]);
        }

        elementTempl.content = documentContent;
    }
})(document);

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
        updateSymbolsList();
    }
}

function addPlayer() {
    let defaultType = 'human';
    let defaultName = 'Player';
    let defaultSymbol = getAvailableSymbolsList()[0];
    if (viewModel.addPlayer(defaultType, defaultName, defaultSymbol)) {
        let list = viewModel.getPlayersCollection();
        let newPlayer = list[list.length - 1];
        addPlayerInstance(newPlayer);
        updateSymbolsList();
    }
}

function removePlayer(element) {
    let playerToRemove = element.parentNode.parentNode;
    let id = parseInt(playerToRemove.id, 10);

    if (viewModel.removePlayer(id)) {
        playerInstancesCollection.removeChild(playerToRemove);
        updateSymbolsList();
    }
}
