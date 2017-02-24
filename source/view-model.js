/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/*********************** View-Model **********************/
"use strict";
function ViewModel() {
    this.init = function () {
        let firstTestPlayer = 'First';
        let secondTestPlayer = 'Second';
        let game = new Game(false, firstTestPlayer, secondTestPlayer);
        this.gameInfo = new GameInfo(game);
        game.startTurn();
        this.finishTurn = function (id) {
            game.finishTurn(id);
        };
    };
}

function GameInfo(game){
    this.getFieldCells = function(){
        return game.getFieldCells();
    };
    this.getCurrentStatus = function () {
        let gameStatus = game.currentStatus;
        let playerName = gameStatus == 'Tie' ? 'It' : game.currentPlayer.playerName;
        return  playerName + ' is ' + gameStatus;
    }
}




