/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/*********************** View-Model **********************/
"use strict";
function ViewModel() {
    let _game = null;

    this.rowsPreset = gameDataManagerSingleton.getInstance().getRows();
    this.columnsPreset = gameDataManagerSingleton.getInstance().getColumns();

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
        return _game.getRows();
    };

    this.getColumns = function() {
        return _game.getColumns();
    };

    this.getWinLength = function() {
        return _game.getWinLength();
    };

    this.setRows = function(rows) {
        return _game.setRows(rows);
    };

    this.setColumns = function(cols) {
        return _game.setColumns(cols);
    };

    this.setWinLength = function(len) {
        return _game.setWinLength(len);
    };

    this.getPlayerList = function() {
        return _game.getPlayerList();
    };

    this.updatePlayer = function(name, prop, value) {
        return _game.updatePlayer(name, prop, value);
    };

    this.addPlayer = function(type, name, symbol) {
        return _game.addPlayer(type, name, symbol);
    };

    this.removePlayer = function(name) {
        return _game.removePlayer(name);
    };

    function getGameState() {
        return _game.state;
    }
}

// let a = new singletonGameDataManager.getInstance();
// a.getRows();
// a.getColumns();
// a.getWinLength();
// a.setRows(6);
// a.setColumns(2);
// a.setWinLength(4);
// a.getPlayerList();
// a.addPlayer('computer', 'Test', 'T');
// a.removePlayer('Levi');
// a.updatePlayer('Levi', name, 'New');

