import React from "react";

const Button = ({ name, handleClick }) => {
    return (
        <button
        onClick={e => handleClick(name)}
         className="drum-pad">
          {name}
        </button>
      );
}

export default Button;
