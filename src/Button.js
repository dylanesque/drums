import React from "react";

const Button = ({ handleClick, handleKeyDown, name, id, src }) => {
  return (
    <div
      onClick={() => handleClick(name, src)}
      onKeyDown={e => handleKeyDown(e, src)}
      className="drum-pad"
    >
      {id}
      <audio className="clip" id={id} data={src} />
    </div>
  );
};

export default Button;
