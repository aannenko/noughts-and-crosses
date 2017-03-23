/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/*********************** View-Model **********************/
"use strict";
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

let gamePreset = {
    players: [
        {playerId : '01', type : 'human', name : 'First', symbol : 'X'},
        {playerId : '02', type : 'computer', name : 'Computer', symbol : 'O'}
    ],

    setPlayer: function(id, key, value){
        this.players.forEach(function(item){
            if(item.playerId == id){
                for(let i in item){
                    if(i == key && item.hasOwnProperty(i)){
                        item[i] = value;
                        break;
                    }
                }
            }
        });
        return this.players;
    },

    getPlayer: function(){
        return this.players;
    }
};


function ViewModel(){
    this.game = null;

    this.getPlayersArray = function () {
        let array = [];
        let factory = new Factory();

        gamePreset.getPlayers.forEach(function(item){
            array.push(factory.createPlayer(item.type, item.name, item.symbol));
        });
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

