import React from "react";
import "./statusBar.css"

class StatusBar extends React.Component {
    render() {
        return (
            <div className="statusBar">{this.props.isReady ? this.props.items.length+" items" : "Loading items . . ."}</div>
        );
    } 
} 

export default StatusBar;