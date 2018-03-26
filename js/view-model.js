let occupiedCells;
let statusDOM = document.querySelector('#status');

window.onload = function() {
    canAddPlayer();
}

let updateFieldCellsContent = function() {
    let fieldCellsArr = VM.getFieldCells();
    for (let r = 0; r < fieldCellsArr.length; r++) {
        for (let c = 0; c < fieldCellsArr[r].length; c++) {
            if (fieldCellsArr[r][c] !== undefined && occupiedCells[r][c] !== true) {
                document.getElementById(r + '-' + c).innerHTML = fieldCellsArr[r][c];
                occupiedCells[r][c] = true;
            }
        }
    }
}

let canAddPlayer = function() {
    let playersLen = VM.getPlayersCollection().length;
    let rows = VM.getRows();
    let cols = VM.getColumns();
    let addPlayerBtn = document.querySelector('#addPlayerBtn');
    let decreaseRowsBtn = document.querySelector('#decreaseRowsBtn');
    let decreaseColumnsBtn = document.querySelector('#decreaseColumnsBtn');
    let increaseRowsBtn = document.querySelector('#increaseRowsBtn');
    let increaseColumnsBtn = document.querySelector('#increaseColumnsBtn');
    let increaseWinLenBtn = document.querySelector('#increaseWinLenBtn');
    let decreaseWinLenBtn = document.querySelector('#decreaseWinLenBtn');

    let buttonCollection = [addPlayerBtn, increaseRowsBtn, decreaseRowsBtn, increaseColumnsBtn, decreaseColumnsBtn,
        increaseWinLenBtn, decreaseWinLenBtn];

    let tipCollection = [{
            id: 'addPlayerBtn',
            tip: 'Add more columns and rows or remove some players'
        },
        {
            id: 'decreaseRowsBtn',
            tip: 'Remove some players or add more columns and rows'
        },
        {
            id: 'decreaseColumnsBtn',
            tip: 'Remove some players or add more columns and rows'
        },
        {
            id: 'increaseRowsBtn',
            tip: 'The number of rows must not be higher than 10'
        },
        {
            id: 'increaseColumnsBtn',
            tip: 'The number of columns must not be higher than 10'
        },
        {
            id: 'increaseWinLenBtn',
            tip: 'Add more columns and rows'
        },
        {
            id: 'decreaseWinLenBtn',
            tip: 'It should not be less than 3'
        },
    ];

    switch (true) {
        case rows > playersLen + 1 && cols > playersLen + 1:
            addPlayerBtn.disabled = false;
            decreaseRowsBtn.disabled = false;
            decreaseColumnsBtn.disabled = false;
            break;
        case rows === playersLen + 1 && cols === playersLen + 1:
            addPlayerBtn.disabled = true;
            decreaseRowsBtn.disabled = true;
            decreaseColumnsBtn.disabled = true;
            break;
        case rows > playersLen + 1 && cols === playersLen + 1:
            addPlayerBtn.disabled = true;
            decreaseColumnsBtn.disabled = true;
            break;
        case cols > playersLen + 1 && rows === playersLen + 1:
            addPlayerBtn.disabled = true;
            decreaseRowsBtn.disabled = true;
            break;
    }

    getAllTips(buttonCollection);

    function getAllTips(array) {
        for (let i = 0; i < array.length; i++) {
            array[i].querySelector('.tip').innerText = tipFinder(array[i]);
        }
    }

    function tipFinder(element) {
        for (let i = 0; i < tipCollection.length; i++) {
            if (tipCollection[i].id === element.id) {
                return tipCollection[i].tip;
            }
        }
    }
}

let PlayFieldSettings = function() {
    let self = this;
    self.rows = ko.observable(VM.getRows());
    self.columns = ko.observable(VM.getColumns());
    self.winLength = ko.observable(VM.getWinLength());

    self.isEnabled = function(data, btn) {
        switch (true) {
            case data() < 10 && btn === 'inc':
            case data() > 3 && btn === 'dec':
            case data() < getDiagonal() && btn === 'incWinLen':
                return true;
                break;
            case data() === getDiagonal() && btn === 'incWinLen':
                return false;
                break;
        }
    }

    self.increaseRows = function() {
        self.rows(VM.setRows(self.rows() + 1));
    };
    self.decreaseRows = function() {
        self.rows(VM.setRows(self.rows() - 1));
        self.winLength(VM.getWinLength());
    };
    self.increaseColumns = function() {
        self.columns(VM.setColumns(self.columns() + 1));
    };
    self.decreaseColumns = function() {
        self.columns(VM.setColumns(self.columns() - 1));
        self.winLength(VM.getWinLength());
    };
    self.increaseWinLength = function() {
        self.winLength(VM.setWinLength(self.winLength() + 1));
    };
    self.decreaseWinLength = function() {
        self.winLength(VM.setWinLength(self.winLength() - 1));
    };

    function getDiagonal() {
        let cols = self.columns();
        let rows = self.rows();
        return (cols - rows) < 0 ? cols : rows;
    }
};

let PlayerObject = function(obj) {
    let self = this;
    self.id = ko.observable(obj.id);
    self.name = ko.observable(obj.name);
    self.type = ko.observable(obj.type);
    self.symbol = ko.observable(obj.symbol);
    self.symbolVisibility = ko.observable(false);
    self.typeVisibility = ko.observable(false);
    self.symbolDisplay = function() {
        self.symbolVisibility() ? self.symbolVisibility(false) : self.symbolVisibility(true);
    };
    self.typeDisplay = function() {
        self.typeVisibility() ? self.typeVisibility(false) : self.typeVisibility(true);
    };
};

let PlayersList = function(playersCollection) {
    let self = this;
    self.players = ko.observableArray();
    self.symbolsList = ko.observable(getSymbols());
    self.addEnabled = ko.observable(false);
    
    let underlyingArray = self.players();
    for (let i = 0; i < playersCollection.length; i++) {
        underlyingArray.push(new PlayerObject(playersCollection[i]));
    }
    self.players.valueHasMutated();
    self.typeList = ko.observable(createTypeList());

    self.addPlayer = function() {
        let defaultType = 'human';
        let defaultName = 'Player';
        let defaultSymbol = getSymbols()[0];
        if (VM.addPlayer(defaultType, defaultName, defaultSymbol)) {
            let newList = VM.getPlayersCollection();
            let newPlayer = newList[newList.length - 1];
            underlyingArray.push(new PlayerObject(newPlayer));
        }
        self.players.valueHasMutated();
        updateSymbolList();
    };

    self.removePlayer = function(player) {
        if (VM.removePlayer(player.id())) {
            self.players.remove(player);
        }
        updateSymbolList();
        for (let i = 0; i < self.players().length; i++) {
            self.players()[i].symbolVisibility(false);
            self.players()[i].typeVisibility(false);
        }
    };

    self.updateName = function(player) {
        let newName = VM.updatePlayer(player.id(), 'name', player.name());
        player.name(newName);
    };

    self.updateSymbol = function(player, symbol) {
        let oldValue = player.symbol();
        let newValue = VM.updatePlayer(player.id(), 'symbol', symbol);
        if (oldValue !== newValue) {
            player.symbol(newValue);
            player.symbolVisibility(false);
            updateSymbolList();
        }
    };

    self.updateType = function(player, type) {
        let oldValue = player.type();
        let newValue = VM.updatePlayer(player.id(), 'type', type);
        if (oldValue !== newValue) {
            player.type(newValue);
            player.typeVisibility(false);
        }
    };

    self.visibilityControl = function(id, param) {
        for (let i = 0; i < self.players().length; i++) {
            if (self.players()[i].id() === id()) {
                if (param === 'symbol') self.symbolHideDropdowns(i);
                else if (param === 'type') self.typeHideDropdowns(i);
            } else {
                self.players()[i].symbolVisibility(false);
                self.players()[i].typeVisibility(false);
            }
        }
    };

    self.symbolHideDropdowns = function(index) {
        self.players()[index].symbolDisplay();
        self.players()[index].typeVisibility(false);

        window.onclick = function(event) {
            if (!event.target.matches('button.symbol') &&
                !event.target.matches('ul.symbol > li') &&
                self.players()[index] !== undefined) {

                self.players()[index].symbolVisibility(false);
            }
        }
    };

    self.typeHideDropdowns = function(index) {
        self.players()[index].typeDisplay();
        self.players()[index].symbolVisibility(false);

        window.onclick = function(event) {
            if (!event.target.matches('button.type') &&
                !event.target.matches('ul.type > li') &&
                self.players()[index] !== undefined) {

                self.players()[index].typeVisibility(false);
            }
        }
    };

    function getSymbols() {
        return VM.getAvailableSymbolsList();
    }

    function updateSymbolList() {
        self.symbolsList(getSymbols());
    }

    function createTypeList() {
        let typeList = [];
        for (let key in self.players()) {
            if (self.players().hasOwnProperty(key)) {
                typeList.push(self.players()[key].type());
            }
        }
        return typeList;
    }
};

let Cell = function(id) {
    let self = this;
    self.id = id;
    self.cellClickEvent = function() {
        let cellRow = self.id.split('-')[0];
        let cellCol = self.id.split('-')[1];
        VM.finishTurn(+cellRow, +cellCol);
        updateFieldCellsContent();
    }
};

let Status = function() {
    this.status;
    let symbol;
    let statusLine;
    let playerNamesArr = document.querySelectorAll('.player_instance input');
    let name = VM.getPlayerName();
    let move = 'Turn ' + VM.getCurrentMove();
    let currentStatus = VM.getCurrentStatus();

    for (let i = 0; i < playerNamesArr.length; i++) {
        if (playerNamesArr[i].value === name) {
            symbol = playerNamesArr[i].closest('.player_instance').querySelector('.symbol button span').innerHTML;
        }
    }
    statusLine = [move, ' - ', name, symbol];

    if (currentStatus === 'Tie') {
        statusLine = ['It is a', currentStatus.toLowerCase()];
    } else if (currentStatus === 'Winner') {
        statusLine = [name, symbol, ' wins on ', move.toLowerCase()];
    }
    this.status = (statusLine.join(' '));
};

let Field = function(rows, columns) {
    let self = this;
    self.cellsArray = [];
    for (let r = 0; r < rows; r++) {
        self.cellsArray[r] = {
            cells: []
        };
        for (let c = 0; c < columns; c++) {
            self.cellsArray[r].cells.push(new Cell(r + '-' + c));
        }
    }
    self.playFieldObservable = ko.observableArray(self.cellsArray);
    self.getStatus = function() {
        ko.cleanNode(statusDOM);
        ko.applyBindings(new Status(), statusDOM);
    };
};

let GameProcess = function() {
    let playField = document.querySelector('#playField');
    let settings = document.querySelector('#settings');

    this.startGame = function() {
        let rows = VM.getRows();
        let columns = VM.getColumns();
        VM.startGame();
        ko.cleanNode(playField);
        ko.cleanNode(statusDOM);
        ko.applyBindings(new Field(rows, columns), playField);
        ko.applyBindings(new Status(), statusDOM);
        buildOccupiedCellsArray(rows, columns);
        updateFieldCellsContent();
        if (!settings.classList.contains('hidden')) {
            settings.classList.add('hidden');
            playField.classList.remove('hidden');
        }
    };

    this.changeSettings = function() {
        if (settings.classList.contains('hidden')) {
            settings.classList.remove('hidden');
            playField.classList.add('hidden');
            document.querySelector('#gameStatus span').innerHTML = 'Game status';
        }
    }

    function buildOccupiedCellsArray(rows, columns) {
        let arr = new Array(rows);
        for (let i = 0; i < rows; i++) {
            arr[i] = new Array(columns);
        }
        occupiedCells = arr;
    }
};

let ViewModel = function() {
    let _game = null;

    this.startGame = function() {
        _game = new Game();
        _game.startTurn();
    };
    this.finishTurn = function(row, col) {
        if (_game) {
            _game.finishTurn(row, col);
        }
    };
    this.getPlayerName = function() {
        return _game.state.currentPlayerName;
    };
    this.getFieldCells = function() {
        return _game.state.fieldCells;
    };
    this.getCurrentMove = function() {
        return _game.state.currentMove;
    };
    this.getCurrentStatus = function() {
        return _game.state.currentStatus;
    };
    this.getPlayersCollection = function() {
        return gameDataManagerSingleton.getInstance().getPlayersCollection();
    };
    this.getAvailableSymbolsList = function() {
        return gameDataManagerSingleton.getInstance().getAvailableSymbolsList();
    };
    this.updatePlayer = function(id, prop, value) {
        return gameDataManagerSingleton.getInstance().updatePlayer(id, prop, value);
    };
    this.addPlayer = function(type, name, symbol) {
        return gameDataManagerSingleton.getInstance().addPlayer(type, name, symbol);
    };
    this.removePlayer = function(id) {
        return gameDataManagerSingleton.getInstance().removePlayer(id);
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
    this.setColumns = function(columns) {
        return gameDataManagerSingleton.getInstance().setColumns(columns);
    };
    this.setWinLength = function(len) {
        return gameDataManagerSingleton.getInstance().setWinLength(len);
    };
};

(function closestPolyfill(e) {
    e.closest = e.closest || function(css) {
        let node = this;

        while (node) {
            if (node.matches(css)) return node;
            else node = node.parentElement;
        }
        return null;
    }
})(Element.prototype);

(function matchesPolyfill(e) {
    e.matches || (e.matches = e.matchesSelector || function(selector) {
        let matches = document.querySelectorAll(selector),
            th = this;
        return Array.prototype.some.call(matches, function(e) {
            return e === th;
        });
    });

})(Element.prototype);

let VM = new ViewModel();
ko.applyBindings(new PlayersList(VM.getPlayersCollection()), document.querySelector('#playerList'));
ko.applyBindings(new PlayFieldSettings(), document.querySelector('#fieldSettings'));
ko.applyBindings(new GameProcess(), document.querySelector('#gameProcess'));