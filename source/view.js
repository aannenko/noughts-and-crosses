/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/********************** View **********************/
"use strict";
function View(){
    let cells = document.getElementsByClassName("cell");
    let statusField = document.getElementById("gameStatus");
    let viewModel = new ViewModel();
    let occupiedCells = [];

    this.init = function(){
        viewModel.init();
        setListenersToCells();
        changeCurrentStatus();
    };

    function setListenersToCells(){
        for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener("click", function(){
                viewModel.finishTurn(i);
                updateCellContent();
                changeCurrentStatus();
            });
        }
    };

    function changeCurrentStatus(){
        statusField.innerHTML = viewModel.gameInfo.getCurrentStatus();
    };

    function updateCellContent(){
        let fieldCellsArr = viewModel.gameInfo.getFieldCells();
        for (let i = 0; i < fieldCellsArr.length; i++) {
            if (fieldCellsArr[i] != undefined && occupiedCells[i] != fieldCellsArr[i]) {
                cells[i].innerHTML = fieldCellsArr[i];
            }
            occupiedCells[i] = fieldCellsArr[i];
        }
    };
};