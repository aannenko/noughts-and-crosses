/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/*********************** View-Model **********************/
"use strict";
function GamePreset(){
    this.players = [
        {type : 'human', name : 'First', symbol : 'X'},
        {type : 'computer', name : 'Computer', symbol : 'O'}
    ];
};

function ViewModel(){
    this.game = null;

    this.getPlayersArray = function () {
        let array = [];
        let factory = new Factory();
        let gamePreset = new GamePreset();
        for(let i = 0; i < gamePreset.players.length; i++){
            array.push(factory.createPlayer(gamePreset.players[i].type, gamePreset.players[i].name, gamePreset.players[i].symbol));
        }
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