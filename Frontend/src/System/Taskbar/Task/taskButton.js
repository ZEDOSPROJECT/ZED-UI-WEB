import React from 'react';
import './taskButton.css';

class TaskButton extends React.Component {
    render(){
        return(
            <div onClick={ e => this.props.onToggleMinimize(this.props.uuid)}  className="taskButton">
                <img style={{ position: 'absolute',  bottom: 5 }} alt="" className="taskIcon" src={this.props.icon}  />
            </div>
        );
    } 
} 

export default TaskButton;