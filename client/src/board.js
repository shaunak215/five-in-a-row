import React, {useEffect, useState} from "react";
import Square from "./square";
import io from "socket.io-client";
import './index.css';

const socket = io.connect('http://localhost:5000');

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

export default Board;