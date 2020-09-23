import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import './index.css';
import io from "socket.io-client";

const socket = io.connect('http://localhost:5000');

function Square(props) {
    let color;
    if (!props.value) color = "#b37700";
    else if (props.value === 'W') color = 'white';
    else color = 'black';
    return (
        <button style={{background: color}}
                className="square"
                onClick={props.onClick}>
        </button>
    );
}

const Board = (props) => {
    const [squares, setSquares] = useState(Array(19).fill().map(() => Array(19).fill(null)));
    const [whiteTurn, setWhiteTurn] = useState(true);
    const [winner, setWinner] = useState(false);

    useEffect(() => {
        socket.on('message', (iPos, jPos, player, winner) => {
            const square = squares.slice();
            square[iPos][jPos] = (player === 'W' ? 'B' : 'W');
            setSquares(square);
            setWhiteTurn(player === 'W');
            // setWinner(calculateWinner(squares, iPos, jPos));
            setWinner(winner);
        });
        //disabling warning bc I need the dependency array to be empty to avoid an infinite render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClick = (i, j) => {
        let currPlayer = (whiteTurn === true ? 'W' : 'B');
        if (squares[i][j]  || winner === true || currPlayer !== props.playerPiece) return;
        socket.emit("message", {
            boardState : squares,
            iPos: i,
            jPos: j,
            currPlayer: whiteTurn ? 'W' : 'B',
            secret: props.secretKey,
            piece: props.playerPiece,
        });
    };

    const renderSquare = (i, j) => {
        return (
            <Square
                key = {i * 19 + j}
                value={squares[i][j]}
                onClick={() => handleClick(i, j)}
            />
        );
    };

    const renderBoard = () => {
        let board = [];
        let i;
        for (i = 0; i < 19; i++) {
            let j;
            board[i] = new Array(19);
            for (j = 0; j < 19; j++) {
                board[i][j] = renderSquare(i, j);
            }
        }

        return board;
    };

    let playMessage;
    const win = winner ? 'True' : 'False';
    if (win === 'True')
        playMessage = 'The winner is ' + (!whiteTurn ? 'White' : 'Black');
    else
        playMessage = 'Current player is: ' + (whiteTurn ? 'White' : 'Black');

    let player = props.playerPiece === 'W' ? 'White' : 'Black';
    return (
        <div>
            <div className = "status"> You are the {player} player.</div>
            <div className="status">{playMessage}</div>
            <div className="board">{renderBoard()}</div>
        </div>
    );
};

const Game = () => {
    let gameBoard;
    const [auth, setAuth] = useState(false);
    const [username, setUser] = useState('');
    const [secretKey, setKey] = useState(0);
    const [playerPiece, setPlayer] = useState('');
    const handleChange = (event) => {
        setUser(event.target.value);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const request = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'username': username})
        };
        const res = await fetch('http://localhost:5000/auth', request);

        const res_json = await res.json();
        if (res.ok) {
            setAuth(true);
            const val = res_json['Key'];
            setKey(val);
            const player = res_json['Player'];
            player === 'White' ? setPlayer('W') : setPlayer('B');
        } else {
            if (res_json['Player'] === 'Full')
                alert("The game already has two people");
            else
                alert("Invalid Username");
        }
    };

    if (auth) {
        gameBoard = (
            <div className="game">
                <div>
                    <Board
                    secretKey = {secretKey}
                    playerPiece = {playerPiece}
                    />
                </div>
            </div>
        )
    } else {
        gameBoard = (
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" value={username} onChange={handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        )
    }
    return (
        gameBoard
    );
};


// function calculateWinner(squares, i , j) {
//     const iReset = i;
//     const jReset = j;
//     //left & right
//     let count = 0;
//     let curr = squares[i][j];
//     //left
//     while (j >= 0) {
//         if (squares[i][j] === curr) {
//             count++;
//             if (count === 5) return true;
//             j--;
//         } else {
//             //no more going left
//             break;
//         }
//     }
//     //right
//     j = jReset + 1;
//     while (j < squares.length) {
//         if (squares[i][j] === curr) {
//             count++;
//             if (count === 5) return true;
//             j++;
//         } else {
//             break;
//         }
//     }
//
//     //up & down
//     j = jReset;
//     count = 0;
//     //up
//     while (i >= 0) {
//         if (squares[i][j] === curr) {
//             count++;
//             if (count === 5) return true;
//             i--;
//         } else {
//             //no more going up
//             break;
//         }
//     }
//     //down
//     i = iReset + 1;
//     while (i < squares.length) {
//         if (squares[i][j] === curr) {
//             count++;
//             if (count === 5) return true;
//             i++;
//         } else {
//             break;
//         }
//     }
//
//     //diagonal1
//     j = jReset;
//     i = iReset;
//     count = 0;
//     //up left
//     while (i >= 0 && j >= 0) {
//         if (squares[i][j] === curr) {
//             count++;
//             if (count === 5) return true;
//             i--;
//             j--;
//         } else {
//             //no more going left & up
//             break;
//         }
//     }
//     //down right
//     i = iReset + 1;
//     j = jReset + 1;
//     while (i < squares.length && j < squares.length) {
//         if (squares[i][j] === curr) {
//             count++;
//             if (count === 5) return true;
//             i++;
//             j++;
//         } else {
//             break;
//         }
//     }
//
//     //diagonal2
//     j = jReset;
//     i = iReset;
//     count = 0;
//     //up right
//     while (i >= 0 && j < squares.length) {
//         if (squares[i][j] === curr) {
//             count++;
//             if (count === 5) return true;
//             i--;
//             j++;
//         } else {
//             //no more going up & right
//             break;
//         }
//     }
//     //down left
//     i = iReset + 1;
//     j = jReset - 1;
//     while (i < squares.length && j >= 0) {
//         if (squares[i][j] === curr) {
//             count++;
//             if (count === 5) return true;
//             i++;
//             j--;
//         } else {
//             break;
//         }
//     }
//     return false;
// }


ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


