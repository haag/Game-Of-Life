import React, { Component } from 'react';
import "../style/Game.css";

const CELL_SIZE = 40
const WIDTH = 800
const HEIGHT = 600

class Game extends Component {
    render(){
        return(
            <div>
                <div className="Board"
                    style={{
                        width: WIDTH, 
                        height: HEIGHT,
                        backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}}
                    >

                </div>
            </div>
        )
    }
}

export default Game