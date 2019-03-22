import React from "react";

const Button = ({ name, handleClick }) => {
    return (
        <button
        onClick={(handleClick(name))}
         className="drum-pad">
          {name}
        </button>
      );
}

export default Button;
