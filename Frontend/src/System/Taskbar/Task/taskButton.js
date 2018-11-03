import React from 'react';
import './taskButton.css';

class TaskButton extends React.Component {
    render(){
        return(
            <div onClick={ e => this.props.onToggleMinimize(this.props.uuid)}  className="taskButton">
                <img alt="" className="taskIcon" src={this.props.icon}  />
                <div className="taskTitle">{this.props.title}</div>
            </div>
        );
    } 
} 

export default TaskButton;