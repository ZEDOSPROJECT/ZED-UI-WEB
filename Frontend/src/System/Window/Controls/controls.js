import React from 'react';
import './controls.css';

class Controls extends React.Component{
    render(){
        return(
            <div className="Controls">
                <div 
                    className="Buttons"
                    onClick={this.props.onClose}  
                >X</div>
                <div
                    onClick={this.props.onToggleWindow} 
                    className="Buttons"
                >[-]</div>
                <div 
                    // onClick={this.props.onMinimize} 
                    className="Buttons"
                >-</div>
            </div>
        );
    } 
} 

export default Controls;