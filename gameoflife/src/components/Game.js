import React, { Component } from 'react';
import Cell from './Cell';
import "../style/Game.css";


class Game extends Component {
    constructor(){
        super();
        this.rows = (this.state.height ) / this.state.size
        this.cols = (this.state.width )/ this.state.size
        this.board = this.makeEmptyBoard()
        this.count = 0
    }
    state = { 
        cells: [],
        interval: 100,
        inRunning: false, 
        width: 600,
        height: 600,
        size: 20,
        rows: '',
        cols: '',
    }
    
    //This Block Changes grid size
    handleRow = (e) => {
        e.preventDefault()
        this.setState({rows: e.target.value})
    }
    handleCol = (e) => {
        e.preventDefault()
        this.setState({cols: e.target.value})
    }
    
    updateRowsCols = (inp) => {
        if(inp === "row"){
            let new_height = this.state.rows * this.state.size
            this.setState({ height: new_height})
        } else {
            let new_width = this.state.cols * this.state.size
            this.setState({ width: new_width})
        }
    }


    runGame = () => {
        this.setState({ isRunning: true })
        this.runIteration()
    }

    stopGame = () => {
        this.setState({ isRunning: false })
        if ( this.timeoutHandler) {
            window.clearTimeout(this.timeoutHandler)
            this.timeoutHandler = null
        }
    }
    counter() {
        this.count += 1
    }
    runIteration() {
        console.log('running iteration')
        this.counter()
        let newBoard = this.makeEmptyBoard()

        for(let y =0; y < this.rows; y++) {
            for(let x =0; x< this.cols; x++) {
                let neighbors = this.calculateNeighbors(this.board, x, y)
                if(this.board[y][x]) {
                    if(neighbors === 2 || neighbors === 3){
                        newBoard[y][x] = true
                    } else{
                        newBoard[y][x] = false   
                    }
                } else{
                    if(!this.board[y][x] && neighbors === 3) {
                        newBoard[y][x] = true
                    }
                }
            }
        }

        this.board = newBoard
        this.setState({ cells: this.makeCells()})

        this.timeoutHandler = window.setTimeout(() => {
            this.runIteration()
        }, this.state.interval);
    }

    handleIntervalChange = (e) => {
        this.setState({ interval: e.target.value})
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

        const x = Math.floor(offsetX / this.state.size)
        const y = Math.floor(offsetY / this.state.size)

        if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
            this.board[y][x] = !this.board[y][x]
        }
        this.setState({ cells: this.makeCells() })
    }

      /**
     * Calculate the number of neighbors at point (x, y)
     * @param {Array} board 
     * @param {int} x 
     * @param {int} y 
     */
    calculateNeighbors(board, x, y) {
        let neighbors = 0;
        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            let y1 = y + dir[0];
            let x1 = x + dir[1];

            if (x1 >= 0 && x1 < this.cols && y1 >= 0 && y1 < this.rows && board[y1][x1]) {
                neighbors++;
            }
        }
        return neighbors;
    }

    render(){
        const { cells } = this.state
        console.log(this.state.width,this.state.height,this.state.size)
        return(
            <div className="TEST">
                <div className="Board"
                    style={{
                        width: this.state.width, 
                        height: this.state.height,
                        backgroundSize: `${this.state.size}px ${this.state.size}px`}}
                    onClick={this.handleClick}
                    ref={(n) => { this.boardRef = n }}
                        >
                    {cells.map(cell => (
                        <Cell 
                        size={this.state.size}
                        x={cell.x} 
                        y={cell.y}
                        key={`${cell.x},${cell.y}`}
                        />
                    ))}
                    
                </div>
                <div className="Controls">
                Frequency (msec): <br/> <input 
                value={this.state.interval}
                onChange={this.handleIntervalChange} />

                {this.state.isRunning ?
                <button className="button"
                    onClick={this.stopGame}>Stop</button> :
                <button className="button"
                    onClick={this.runGame}>Run</button>
                }

                <form onSubmit={this.handleRow}>
                    <br/> Num of Rows: <br/>
                        <input 
                            value={this.state.rows} 
                            onChange={this.handleRow}
                            placeholder={this.rows} />
                    <input type="submit" value="Submit"
                        onClick={() => this.updateRowsCols("row")} />
                </form>
                <form onSubmit={this.handleCol}>
                    <br/> Num of Cols: <br/>
                        <input 
                            value={this.state.cols} 
                            onChange={this.handleCol}
                            placeholder={this.cols} />
                    <input type="submit" value="Submit"
                        onClick={() => this.updateRowsCols("col")} />
                </form>
                
                <br/>
                <form>{this.count}: Generations</form>
    
                <button onClick={() => window.location.reload()}>Reset</button>
                </div>

            </div>
        )
    }
}

export default Game