import React, {Component} from 'react';
import "../style/Cell.css";

class Cell extends Component {
    render(){
        console.log("props", this.props)
        const { x, y, size } = this.props
        return (
            <div className="Cell" style={{
                left: `${size * x + 1 }px`,
                top: `${size * y + 1 }px`,
                width: `${size - 1}px`,
                height: `${size - 1}px`,

            }} />
        )
    }
}
export default Cell