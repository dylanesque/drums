import React, { Component } from "react";

import "./App.css";
import Display from "./Display";
import Button from "./Button";

const data = ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display: "Press a key to play the drums!"
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(name) {
    console.log(name);
  }

  render() {
    return (
      <div id="drum-machine">
        <Display display={this.state.display} />
        <div className="drum-buttons">
          {data.map(button => (
            <Button
            handleClick={this.handleClick}
            display={this.state.display}
            name={button}
            key={button} />
          ))}
        </div>
      </div>
    );
  }
}

export default App;

//  Within each .drum-pad, there should be an HTML5 audio element which has a src attribute
// pointing to an audio clip, a class name of clip, and an id corresponding to the inner
// text of its parent .drum-pad (e.g. id="Q", id="W", id="E" etc.).

// When I click on a .drum-pad element, the audio clip contained in its child audio element should be triggered.

// When I press the trigger key associated with each .drum-pad, the audio clip contained in
// its child audio element should be triggered (e.g. pressing the Q key should trigger the
// drum pad which contains the string "Q", pressing the W key should trigger the drum pad
// which contains the string "W", etc.).

// When a .drum-pad is triggered, a string describing the associated audio clip is displayed
// as the inner text of the #display element (each string must be unique).
