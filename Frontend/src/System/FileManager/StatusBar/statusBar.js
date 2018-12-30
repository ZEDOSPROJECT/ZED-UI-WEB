import React from "react";
import "./statusBar.css"

class StatusBar extends React.Component {
    constructor(props) {
        super(props);
    } 
    render() {
        return (
            <div className="statusBar">{this.props.items.length} items </div>
        );
    } 
} 

export default StatusBar;