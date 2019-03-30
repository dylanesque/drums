import React, { Component } from "react";

import "./App.css";
import Display from "./Display";
import Button from "./Button";
import drumData from './drumData';

const ref = React.createRef();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display: "Press a key to play the drums!"
    };
  }

  handleClick = (name) => {
    this.setState({ display: name });
    ref.play();
  };

  render() {
    return (
      <div id="drum-machine">
        <Display display={this.state.display} />
        <div className="drum-buttons">
          {drumData.map(button => (
            <Button
              handleClick={this.handleClick}
              display={this.state.display}
              name={button.name}
              drumKey={button.key}
              src={button.src}
              ref={ref}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default App;

// When I click on a .drum-pad element, the audio clip contained in its child audio element should be triggered.

// When I press the trigger key associated with each .drum-pad, the audio clip contained in
// its child audio element should be triggered (e.g. pressing the Q key should trigger the
// drum pad which contains the string "Q", pressing the W key should trigger the drum pad
// which contains the string "W", etc.).
