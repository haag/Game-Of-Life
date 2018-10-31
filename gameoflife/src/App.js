import React, { Component } from 'react';
import Game from "./components/Game";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="Title" style={{textAlign: "center"}}>
            Conway's Game of Life
          </h1>
          <div className="Game-container">
            <Game />
          </div>
  
        </header>
      </div>
    );
  }
}

export default App;
