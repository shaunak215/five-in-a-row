import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          squares: Array(19).fill().map(() => Array(19).fill(null)),
          xIsNext: true,
          winner: false,
        };
    }

    handleClick(i, j) {
        if (this.state.squares[i][j]) return;
        const squares = this.state.squares.slice();
        squares[i][j] = this.state.xIsNext ? 'W' : 'B';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
            winner: calculateWinner(this.state.squares, i, j)
        });
    }

    renderSquare(i, j) {
        return (
            <Square
                value={this.state.squares[i][j]}
                onClick={() => this.handleClick(i, j)}
            />
    );
    }

    renderBoard() {
        let board = [];
        let i;
        for (i = 0; i < 19; i++) {
            let j;
            board[i] = new Array(19);
            for (j = 0; j < 19; j++) {
                board[i][j] = this.renderSquare(i, j);
            }
        }

        return board;
    }

    render() {
        const status = 'Next player: ' + (this.state.xIsNext ? 'White' : 'Black');
        const winner = this.state.winner ? 'True' : 'False';
        return (
            <div>
                <div className="status">{status}</div>
                <div className="winner">{winner}</div>
                <div className="board">{this.renderBoard()}</div>
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div>
                    <Board />
                </div>
            </div>
        );
    }
}


function calculateWinner(squares, i , j) {
    const iReset = i;
    const jReset = j;
    //left & right
    let count = 0;
    let curr = squares[i][j];
    //left
    while (j >= 0) {
        if (squares[i][j] === curr) {
            count++;
            if (count === 5) return true;
            j--;
        } else {
            //no more going left
            break;
        }
    }
    //right
    j = jReset + 1;
    while (j < squares.length) {
        if (squares[i][j] === curr) {
            count++;
            if (count === 5) return true;
            j++;
        } else {
            break;
        }
    }

    //up & down
    j = jReset;
    count = 0;
    //up
    while (i >= 0) {
        if (squares[i][j] === curr) {
            count++;
            if (count === 5) return true;
            i--;
        } else {
            //no more going left
            break;
        }
    }
    //down
    i = iReset + 1;
    while (i < squares.length) {
        if (squares[i][j] === curr) {
            count++;
            if (count === 5) return true;
            i++;
        } else {
            break;
        }
    }

    //diagonal1
    j = jReset;
    i = iReset;
    count = 0;
    //up left
    while (i >= 0 && j >= 0) {
        if (squares[i][j] === curr) {
            count++;
            if (count === 5) return true;
            i--;
            j--;
        } else {
            //no more going left
            break;
        }
    }
    //down right
    i = iReset + 1;
    j = jReset + 1;
    while (i < squares.length && j < squares.length) {
        if (squares[i][j] === curr) {
            count++;
            if (count === 5) return true;
            i++;
            j++;
        } else {
            break;
        }
    }

    //diagonal2
    j = jReset;
    i = iReset;
    count = 0;
    //up right
    while (i >= 0 && j < squares.length) {
        if (squares[i][j] === curr) {
            count++;
            if (count === 5) return true;
            i--;
            j++;
        } else {
            //no more going left
            break;
        }
    }
    //down left
    i = iReset + 1;
    j = jReset - 1;
    while (i < squares.length && j >= 0) {
        if (squares[i][j] === curr) {
            count++;
            if (count === 5) return true;
            i++;
            j--;
        } else {
            break;
        }
    }

    return false;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


