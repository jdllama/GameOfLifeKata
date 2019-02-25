let Game = {};

let rows = [];

function Cell(currentState) {
    let _currentState = currentState;
    let _nextState = null;
    this.currentState = () => {
        return _currentState;
    };
    this.nextState = () => {
        return _nextState;
    };
    this.setState = (newState) => {
        _nextState = newState;
        return this;
    };
    this.reverseState = () => {
        _nextState = !_currentState;
        return this;
    }
    this.processState = () => {
        if (_nextState == null) {
            _nextState = _currentState;
        }
        _currentState = _nextState;
        _nextState = null;
        return this;
    };
}

Game.precreate = (arrOfArrs) => {
    rows = [];
    arrOfArrs.forEach(row => {
        let myRow = [];
        row.forEach(cell => {
            myRow.push(new Cell(cell));
        });
        rows.push(myRow);
    });
    return rows;
}

Game.create = (rowLen = 6, colLen = 8) => {
    rows = [];
    for (let i = 0; i < rowLen; i++) {
        let row = [];
        for (let j = 0; j < colLen; j++) {
            row.push(new Cell(Math.random() < 0.5));
        }
        rows.push(row);
    }
    return rows;
};

Game.nextStep = () => {
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let prevRow = rows[i - 1] || null;
        let nextRow = rows[i + 1] || null;

        for (let j = 0; j < row.length; j++) {
            let aliveCount = 0;
            let currentCell = row[j];
            let testCell;

            let currentState = currentCell.currentState();
            if (prevRow != null) {
                for (let k = 1; k > -2; k--) {
                    testCell = prevRow[j - k] || null;
                    if (testCell != null) {
                        if (testCell.currentState() == true) aliveCount++;
                    }
                }
            } 
            if (nextRow != null) {
                for (let k = 1; k > -2; k--) {
                    testCell = nextRow[j - k] || null;
                    if (testCell != null) {
                        if (testCell.currentState() == true) aliveCount++;
                    }
                }
            }

            testCell = row[j - 1] || null;
            if (testCell != null) {
                if (testCell.currentState() == true) aliveCount++;
            }

            testCell = row[j + 1] || null;
            if (testCell != null) {
                if (testCell.currentState() == true) aliveCount++;
            }

            if (currentState == true) {
                if (aliveCount < 2 || aliveCount > 3) {
                    currentCell.setState(false);
                }
            }
            else {
                if (aliveCount == 3) {
                    currentCell.setState(true);
                }
            }
        }
    }
};

Game.process = () => {
    rows.forEach(row => {
        row.forEach(cell => {
            cell.processState();
        });
    });
}

Game.render = () => {
    $("#playfield").html("");
    rows.forEach(row => {
        let rowDiv = $("<div class='row'>");
        row.forEach(cell => {
            let cellDiv = $("<div style='width:50px;'>");
            if (cell.currentState() == true) {
                cellDiv.html("O");
            }
            else {
                cellDiv.html(".");
            }
            
            rowDiv.append(cellDiv);
        });
        $("#playfield").append(rowDiv);
    });
};

$(() => {
    $("#prebuilt").click(() => {
        Game.precreate([
            [false, false, false, false, false, false, true, false],
            [true, true, true, false, false, false, true, false],
            [false, false, false, false, false, false, true, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, true, true, false, false, false],
            [false, false, false, true, true, false, false, false],
        ]);

        Game.render();
    });

    $("#step").click(() => {
        Game.nextStep();
        Game.process();
        Game.render();
    });
})


var assert = chai.assert;

let myAliveCell = new Cell(true);
let myDeadCell = new Cell(false);
assert.equal(myAliveCell.currentState(), true, "Cell is alive");
assert.equal(myDeadCell.currentState(), false, "Cell is dead");
assert.equal(myDeadCell.setState(true).processState().currentState(), true, "Dead cell should be alive again");
assert.equal(myDeadCell.reverseState().processState().currentState(), false, "Since the cell was set to alive again in the previous test, it should be dead again");