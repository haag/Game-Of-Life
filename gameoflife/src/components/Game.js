import React, { Component } from 'react';
import "../style/Game.css";

const CELL_SIZE = 40
const WIDTH = 800
const HEIGHT = 600

class Cell extends Component {
    render(){
        console.log("props", this.props)
        const {x, y} = this.props
        return (
            <div className="Cell" style={{
                left: `${CELL_SIZE * x + 5}px`,
                top: `${CELL_SIZE * y + 1}px`,
                width: `${CELL_SIZE - 1}px`,
                height: `${CELL_SIZE - 1}px`,
            }} />
        )
    }
}


class Game extends Component {
    constructor(){
        super();
        this.rows = HEIGHT / CELL_SIZE
        this.cols = WIDTH / CELL_SIZE
        this.board = this.makeEmptyBoard()
    }
    state = { 
        cells: [],
        interval:100,
        inRunning: false, 
    }

    runGame = () => {
        this.this.setState({ isRunning: true })
        this.runIteration()
    }

    stopGame = () => {
        this.setState({ isRunning: false })
    }

    handleIntervalChange = (e) => {
        this.this.setState({ interval: e.target.value})
    }

    makeEmptyBoard(){
        let board = []
        for (let y = 0; y < this.rows; y++){
            board[y] = []
            for (let x = 0; x < this.cols; x++){
                board[y][x] = false
            }
        }
        return board
    }

    makeCells() {
        let cells = []
        for (let y = 0; y< this.rows; y++){
            for (let x = 0; x < this.cols; x++) {
                if(this.board[y][x]) {
                    cells.push({ x, y })
                }
            }
        }
        return cells
    }

    getElementOffset() {
        const rect = this.boardRef.getBoundingClientRect();
        const doc = document.documentElement
        return {
            x: (rect.left + window.pageXOffset) - doc.clientLeft,
            y: (rect.top + window.pageYOffset) - doc.clientTop,
        }
    }


    handleClick = (e) => {
        const elemOffset = this.getElementOffset()
        const offsetX = e.clientX - elemOffset.x
        const offsetY = e.clientY - elemOffset.y

        const x = Math.floor(offsetX / CELL_SIZE)
        const y = Math.floor(offsetY / CELL_SIZE)

        if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
            this.board[y][x] = !this.board[y][x]
        }
        this.setState({ cells: this.makeCells() })
    }


    render(){
        const { cells } = this.state
        return(
            <div>
                <div className="Board"
                    style={{
                        width: WIDTH, 
                        height: HEIGHT,
                        backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}}
                    onClick={this.handleClick}
                    ref={(n) => { this.boardRef = n }}
                        >
                    {cells.map(cell => (
                        <Cell 
                        x={cell.x} 
                        y={cell.y}
                        key={`${cell.x},${cell.y}`}

                        />
                    ))}
                    
                </div>
                <div className="controls">
                Update every <input 
                value={this.state.interval}
                onChange={this.handleIntervalChange} />  msec
                {this.state.isRunning ?
                <button className="button"
                    onClick={this.stopGame}> Stop </button> :
                <button className="button"
                    onClick={this.runGame}> Run </button>
                }
                </div>
            </div>
        )
    }
}

export default Game