import React, { Component } from "react";

import "./App.css";
import Display from "./Display";
import Button from "./Button";
import drumData from "./drumData";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display: "Press a key to play the drums!"
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = (e, src) => {
    console.log(src);
  };

  handleClick = (name, src) => {
    this.setState({ display: name });
    new Audio(src).play();
  };

  render() {
    return (
      <div id="drum-machine">
        <Display display={this.state.display} />
        <div className="drum-buttons">
          {drumData.map(button => (
            <Button
              handleClick={this.handleClick}
              handleKeyDown={this.handleKeyDown}
              display={this.state.display}
              name={button.name}
              key={button.key}
              id={button.key}
              src={button.src}
              tabIndex="0"
            />
          ))}
        </div>
      </div>
    );
  }
}

export default App;

// When I press the trigger key associated with each .drum-pad, the audio clip contained in
// its child audio element should be triggered (e.g. pressing the Q key should trigger the
// drum pad which contains the string "Q", pressing the W key should trigger the drum pad
// which contains the string "W", etc.).
