/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/*********************** View-Model **********************/
"use strict";
function ViewModel(){
    let _game = null;

    this.rowsPreset = gameDataManagerSingleton.getInstance().getRows();
    this.columnsPreset = gameDataManagerSingleton.getInstance().getColumns();

    this.init = function(){
        _game = new Game();
        _game.startTurn();
    };

    this.getFieldCells = function(){
        return _game.getState().getFieldCells();
    };

    this.getCurrentStatus = function(){
        let gameStatus = _game.getState().currentStatus;
        let playerName = gameStatus === 'Tie' ? 'It' : _game.getState().getCurrentPlayerName();
        return  playerName + ' is ' + gameStatus;
    };

    this.finishTurn = function(row, col){
        if(_game){
            _game.finishTurn(row, col);
        }
    };
}