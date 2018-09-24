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
                    className="Buttons"
                >[-]</div>
                <div 
                    className="Buttons"
                >-</div>
            </div>
        );
    } 
} 

export default Controls;