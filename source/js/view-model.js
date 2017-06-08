/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/*********************** View-Model **********************/
"use strict";
function ViewModel() {
    let _game = null;

    this.init = function() {
        _game = new Game();
        _game.startTurn();
    };

    this.finishTurn = function(row, col) {
        if (_game) {
            _game.finishTurn(row, col);
        }
    };

    this.getFieldCells = function() {
        return getGameState().fieldCells;
    };

    this.getCurrentStatus = function() {
        return getGameState().currentStatus;
    };

    this.getPlayerName = function() {
        return this.getCurrentStatus() === 'Tie' ? 'It' : getGameState().currentPlayerName;
    };

    this.getRows = function() {
        return gameDataManagerSingleton.getInstance().getRows();
    };

    this.getColumns = function() {
        return gameDataManagerSingleton.getInstance().getColumns();
    };

    this.getWinLength = function() {
        return gameDataManagerSingleton.getInstance().getWinLength();
    };

    this.setRows = function(rows) {
        return gameDataManagerSingleton.getInstance().setRows(rows);
    };

    this.setColumns = function(cols) {
        return gameDataManagerSingleton.getInstance().setColumns(cols);
    };

    this.setWinLength = function(len) {
        return gameDataManagerSingleton.getInstance().setWinLength(len);
    };

    this.getPlayerList = function() {
        return gameDataManagerSingleton.getInstance().getPlayerList();
    };

    this.updatePlayer = function(name, prop, value) {
        return gameDataManagerSingleton.getInstance().updatePlayer(name, prop, value);
    };

    this.addPlayer = function(type, name, symbol) {
        return gameDataManagerSingleton.getInstance().addPlayer(type, name, symbol);
    };

    this.removePlayer = function(name) {
        return gameDataManagerSingleton.getInstance().removePlayer(name);
    };

    function getGameState() {
        return _game.state;
    }
}


