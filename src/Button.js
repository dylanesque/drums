import React from "react";

const Button = ({ handleClick, name, id, src }) => {
  return (
    <div onClick={() => handleClick(name, src)} className="drum-pad">
    {id}
    <audio className="clip" id={id} data={src} />
    </div>




  );
};

export default Button;
