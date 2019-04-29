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

  changeDisplay = name => {
    this.setState({ display: name });
  };

  render() {
    return (
      <div id="drum-machine">
        <h3 id="display">{this.state.display}</h3>
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
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeydown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeydown);
  }

  handleClick = () => {
    this.audio.play();
    this.props.changeDisplay(this.props.name);
  };

  handleKeydown = e => {
    if (e.keyCode === this.props.id.charCodeAt()) {
      this.audio.play();
      this.props.changeDisplay(this.props.name);
    }
  };

  render() {
    const { id, name, src } = this.props;
    return (
      <div onClick={this.handleClick} className="drum-pad" id={name}>
        {id}
        <audio
          ref={ref => (this.audio = ref)}
          className="clip"
          id={id}
          src={src}
        />
      </div>
    );
  }
}

export default App;

// When I press the trigger key associated with each .drum-pad, the audio clip contained in
// its child audio element should be triggered (e.g. pressing the Q key should trigger the
// drum pad which contains the string "Q", pressing the W key should trigger the drum pad
// which contains the string "W", etc.).
