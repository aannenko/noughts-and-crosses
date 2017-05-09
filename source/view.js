/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/********************** View **********************/
"use strict";

function View(){
    let viewModel = new ViewModel();
    let cells = document.getElementsByClassName("cell");
    let occupiedCells;

    function getFieldCellsArr(){
        return viewModel.gameInfo.getFieldCells();
    };

    this.init = function(){
        let rowsUserSet = viewModel.rowsInField;
        let columnsUserSet = viewModel.columnsInField;
        viewModel.init(rowsUserSet, columnsUserSet);
        createPlayField(rowsUserSet, columnsUserSet);
        createOccupiedCells(rowsUserSet, columnsUserSet);
        setListenersToCells();
        changeCurrentStatus();
    };

    function createPlayField(rows, columns){
        let rowsCount = rows;
        let columnsCount = columns;
        let playField = document.getElementById('play_field');
        let fieldTbl = document.createElement('table');

        playField.appendChild(fieldTbl);

        for (let r = 0; r < rowsCount; r++) {
            let rowField = document.createElement('tr');
            rowField.setAttribute('class', 'row');
            fieldTbl.appendChild(rowField);
            for (let c = 0; c < columnsCount; c++) {
                let cellField = document.createElement('td');
                cellField.setAttribute('class', 'cell');
                cellField.setAttribute('id', r+'-'+c);
                rowField.appendChild(cellField);
            }
        }
    };

    function createOccupiedCells(rows, columns) {
        let arr = new Array(rows);
        for (let i = 0; i < rows; i++){
            arr[i] = new Array(columns);
        }
        occupiedCells = arr;
    };

    function setListenersToCells(){
        for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener("click", function(){
                let cellsRow = cells[i].id.split('-')[0];
                let cellsCol= cells[i].id.split('-')[1];
                viewModel.finishTurn(+cellsRow, +cellsCol);
                updateCellContent();
                changeCurrentStatus();
            });
        }
    };

    function updateCellContent(){
        for (let r = 0; r < getFieldCellsArr().length; r++) {
            for (let c = 0; c < getFieldCellsArr()[r].length; c++) {
                if (getFieldCellsArr()[r][c] !== undefined
                    && getFieldCellsArr()[r][c] !== occupiedCells[r][c]) {
                    cells[r+'-'+c].innerHTML = getFieldCellsArr()[r][c];
                }
                occupiedCells[r][c] = getFieldCellsArr()[r][c];
            }
        }
    };

    function changeCurrentStatus(){
        let statusField = document.getElementById("gameStatus");
        statusField.innerHTML = viewModel.gameInfo.getCurrentStatus();
    };
};

