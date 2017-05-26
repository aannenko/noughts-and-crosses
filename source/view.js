/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/********************** View **********************/
"use strict";
function View(){
    let _viewModel = new ViewModel();
    let _cells = document.getElementsByClassName("cell");
    let _occupiedCells;

    this.init = function(){
        let rowsUserSet = _viewModel.rowsPreset;
        let columnsUserSet = _viewModel.columnsPreset;

        _viewModel.init();
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
        _occupiedCells = arr;
    }

    function setListenerToCells(){
        for (let i = 0; i < _cells.length; i++) {
            _cells[i].addEventListener("click", function(){
                let cellsRow = _cells[i].id.split('-')[0];
                let cellsCol= _cells[i].id.split('-')[1];

                _viewModel.finishTurn(+cellsRow, +cellsCol);
                updateCellContent();
                changeCurrentStatus();
            });
        }
    }

    function updateCellContent(){
        let fieldCellsArr = _viewModel.getFieldCells();

        for (let r = 0; r < fieldCellsArr.length; r++) {
            for (let c = 0; c < fieldCellsArr[r].length; c++) {
                if (fieldCellsArr[r][c] !== undefined
                    && fieldCellsArr[r][c] !== _occupiedCells[r][c]) {
                    _cells[r+'-'+c].innerHTML = fieldCellsArr[r][c];
                }
                _occupiedCells[r][c] = fieldCellsArr[r][c];
            }
        }
    }

    function changeCurrentStatus(){
        let statusField = document.getElementById("gameStatus");
        statusField.innerHTML = _viewModel.getCurrentStatus();
    }
}