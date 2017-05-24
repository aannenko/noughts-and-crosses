/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/********************** View **********************/
"use strict";
function View(){
    let viewModel = new ViewModel();
    let cells = document.getElementsByClassName("cell");
    let occupiedCells;

    this.init = function(){
        let rowsUserSet = viewModel.rowsPreset;
        let columnsUserSet = viewModel.columnsPreset;

        viewModel.init();
        createPlayField(rowsUserSet, columnsUserSet);
        createOccupiedCells(rowsUserSet, columnsUserSet);
        setListenerToCells();
        changeCurrentStatus();
    };

    function createPlayField(rows, columns){
        let playField = document.getElementById('play_field');
        let fieldTbl = document.createElement('table');

        playField.appendChild(fieldTbl);

        for (let r = 0; r < rows; r++) {
            let rowField = document.createElement('tr');
            rowField.setAttribute('class', 'row');
            fieldTbl.appendChild(rowField);

            for (let c = 0; c < columns; c++) {
                let cellField = document.createElement('td');
                cellField.setAttribute('class', 'cell');
                cellField.setAttribute('id', r+'-'+c);
                rowField.appendChild(cellField);
            }
        }
    }

    function createOccupiedCells(rows, columns){
        let arr = new Array(rows);

        for (let i = 0; i < rows; i++) {
            arr[i] = new Array(columns);
        }
        occupiedCells = arr;
    }

    function setListenerToCells(){
        for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener("click", function(){
                let cellsRow = cells[i].id.split('-')[0];
                let cellsCol= cells[i].id.split('-')[1];

                viewModel.finishTurn(+cellsRow, +cellsCol);
                updateCellContent();
                changeCurrentStatus();
            });
        }
    }

    function updateCellContent(){
        let fieldCellsArr = viewModel.getFieldCells();

        for (let r = 0; r < fieldCellsArr.length; r++) {
            for (let c = 0; c < fieldCellsArr[r].length; c++) {
                if (fieldCellsArr[r][c] !== undefined
                    && fieldCellsArr[r][c] !== occupiedCells[r][c]) {
                    cells[r+'-'+c].innerHTML = fieldCellsArr[r][c];
                }
                occupiedCells[r][c] = fieldCellsArr[r][c];
            }
        }
    }

    function changeCurrentStatus(){
        let statusField = document.getElementById("gameStatus");
        statusField.innerHTML = viewModel.getCurrentStatus();
    }
}