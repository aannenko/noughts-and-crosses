/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/*********************** View-Model **********************/
"use strict";
function ViewModel(){
    this.game = null;

    this.getPlayersArray = function () {
        let array = [];
        let factory = new Factory();
        array.push(factory.createPlayer('human', 'First', 'X'));
        array.push(factory.createPlayer('computer', 'Computer', 'O'));
        return array;
    };

    this.init = function(){
        let playersArray = this.getPlayersArray();
        this.game = new Game(playersArray);
        this.gameInfo = new GameInfo(this.game);
        this.game.startTurn();
    };

    this.finishTurn = function(id){
        if(this.game){
            this.game.finishTurn(id);
        }
    };
};

function GameInfo(game){
    this.getFieldCells = function(){
        return game.getFieldCells();
    };

    this.getCurrentStatus = function(){
        let gameStatus = game.currentStatus;
        let playerName = gameStatus == 'Tie' ? 'It' : game.getCurrentPlayerName();
        return  playerName + ' is ' + gameStatus;
    };
};