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
        return _game.state.fieldCells;
    };

    this.getCurrentStatus = function(){
        let gameStatus = _game.state.currentStatus;
        let playerName = gameStatus === 'Tie' ? 'It' : _game.state.currentPlayerName;
        return  playerName + ' is ' + gameStatus;
    };

    this.finishTurn = function(row, col){
        if(_game){
            _game.finishTurn(row, col);
        }
    };
}