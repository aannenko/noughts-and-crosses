/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/*********************** View-Model **********************/
"use strict";
function ViewModel(){
    let game = null;

    this.rowsPreset = singletonGameDataManager.getInstance().getRows();
    this.columnsPreset = singletonGameDataManager.getInstance().getColumns();

    this.init = function(){
        game = new Game();
        game.startTurn();
    };

    this.getFieldCells = function(){
        return game.getFieldCells();
    };

    this.getCurrentStatus = function(){
        let gameStatus = game.currentStatus;
        let playerName = gameStatus === 'Tie' ? 'It' : game.getCurrentPlayerName();
        return  playerName + ' is ' + gameStatus;
    };

    this.finishTurn = function(row, col){
        if(game){
            game.finishTurn(row, col);
        }
    };
}