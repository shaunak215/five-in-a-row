import React from "react";
import './index.css';

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

export default Square;