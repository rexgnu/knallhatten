import React, { Component } from "react";

import Countdown from "./Countdown";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Countdown
          delivery="January 16, 2019 00:00:00"
          inception="April 11, 2018 00:00:00"
          color="#fff"
          alpha={0.9}
          size={300}
          onComplete={() => alert("Complete!")}
        />
      </div>
    );
  }
}

export default App;
