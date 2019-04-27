import React, { Component } from "react";

import "./App.css";
import drumData from "./drumData";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display: "Press a key to play the drums!"
    };
  }

  changeDisplay = (name) => {
    this.setState({ display: name });
  }

  render() {
    return (
      <div id="drum-machine">
        <h3>{this.state.display}</h3>
        <div className="drum-buttons">
          {drumData.map(button => (
            <DrumPad
              changeDisplay={this.changeDisplay}
              name={button.name}
              key={button.key}
              id={button.key}
              src={button.src}
            />
          ))}
        </div>
      </div>
    );
  }
}

class DrumPad extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeydown);
    // window.focus();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeydown);
  }

  handleClick = () => {
    this.props.changeDisplay(this.props.id);
  };

  render() {;
    const {id, src} = this.props
    return (
      <div onClick={this.handleClick} className="drum-pad">
        {id}
        <audio className="clip" id={id} data={src} />
      </div>
    );
  }
}

export default App;

// When I press the trigger key associated with each .drum-pad, the audio clip contained in
// its child audio element should be triggered (e.g. pressing the Q key should trigger the
// drum pad which contains the string "Q", pressing the W key should trigger the drum pad
// which contains the string "W", etc.).
