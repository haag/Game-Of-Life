import React, { Component } from 'react';
import "../style/Game.css";
import Cell from './Cell';


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
        width: 550,
        height: 600,
        size: 50,
        rows: '',
    }
    
    handleRow = (e) => {
        // console.log("HANDLEROW", e.target.value)
        // let rows = e.target.value * 50
        this.setState({rows: e.target.value})
        // console.log("state rows", this.state.rows)
    }
    updateRows = () => {
        let test = this.state.rows * 50
        this.setState({height: test})
        console.log("State width", this.state.height)
        console.log("State rows", this.state.rows)
        
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
    
    runIteration() {
        console.log('running iteration')
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
                    <label>
                        <br/><br/> Num of Rows <br/>
                            <input 
                                value={this.state.rows} 
                                onChange={this.handleRow} />
                    </label>
                        <input 
                            type="submit"
                            value="Submit"
                            onClick={this.updateRows} />
                </form>
                
                
                <br/><br/> Num of Cols: <br/> 
                <input 
                    value={this.cols} />
                <br/>
                <button onClick={() => window.location.reload()}>Reset</button>
                </div>
                <form>{this.count++}: Generations</form>

            </div>
        )
    }
}

export default Game