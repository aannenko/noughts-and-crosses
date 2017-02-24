/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/*********************** View-Model **********************/
"use strict";
function ViewModel() {
    this.init = function () {
        let firstTestPlayer = 'First';
        let secondTestPlayer = 'Second';
        this.game = new Game(false, firstTestPlayer, secondTestPlayer);
        this.gameInfo = new GameInfo(this.game);
        this.game.startTurn();
        this.finishTurn = function (id) {
            this.game.finishTurn(id);
        };
    };

    this.getCurrentPlayer = function () {
        return  this.gameInfo.getCurrentPlayer().playerName;
    };

    this.getCurrentStatus = function () {
        let gameStatus = this.gameInfo.currentStatus();
        let playerName = gameStatus == 'Tie' ? 'It' : this.getCurrentPlayer();
        return  playerName + ' is ' + gameStatus;
    };
}

function GameInfo(game){
    this.getCurrentPlayer = function () {
        return game.currentPlayer;
    };
    this.getFieldCells = function(){
        return game.getFieldCells();
    };
    this.currentStatus = function () {
        return game.currentStatus;
    }
}




