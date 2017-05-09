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
        let playerName = gameStatus === 'Tie' ? 'It' : game.getCurrentPlayerName();
        return  playerName + ' is ' + gameStatus;
    };
};

let gamePreset = {
    players: [
        {type : 'human', name : 'Player', symbol : 'X'},
        {type : 'computer', name : 'Computer', symbol : 'O'}
        // {type : 'human', name : 'Player2', symbol : 'O'}
    ],
    rowsInField: 3,
    columnsInField: 3,
    winCombinationLength: 3,

    findPlayer: function(playerName){
        return this.players.find(function(item){
            return item.name === playerName;
        });
    },

    updatePlayer: function(playerName, prop, value){
        this.findPlayer(playerName)[prop] = value;
    },

    addPlayer: function(type, name, symbol){
        let newPlayer = {
            type: type,
            name: name,
            symbol: symbol
        };
        this.players.splice(this.players.length, 0, newPlayer);
    },

    deletePlayer: function(name){
        for(let i = 0; i < this.players.length; i++){
            if(this.players[i].name === name){
                this.players.splice(i, 1);
            }
        }
    }
};

function ViewModel(){
    this.game = null;
    this.rowsInField = gamePreset.rowsInField;
    this.columnsInField = gamePreset.columnsInField;
    this.winCombinationLength = gamePreset.winCombinationLength;

    this.getPlayersArray = function () {
        let array = [];
        let factory = new Factory();

        gamePreset.players.forEach(function(item){
            array.push(factory.createPlayer(item.type, item.name, item.symbol));
        });
        return array;
    };

    this.init = function(rows, columns){
        let playersArray = this.getPlayersArray();
        this.game = new Game(playersArray, rows, columns, this.winCombinationLength);
        this.gameInfo = new GameInfo(this.game);
        this.game.startTurn();
    };

    this.finishTurn = function(row, col){
        if(this.game){
            this.game.finishTurn(row, col);
        }
    };
};
