import React, {useState} from "react";
import Board from "./board";
import './index.css';

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

export default Game;