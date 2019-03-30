import React from "react";

const Button = React.forwardRef(({ handleClick, name, drumKey, src }, ref ) => {

  return (
    <div onClick={() => handleClick(name, drumKey, ref)} className="drum-pad">
      {drumKey}
      <audio
      src={src}
      className="clip"
      id={drumKey}
      ref={ref}/>
    </div>
  );
});

export default Button;
