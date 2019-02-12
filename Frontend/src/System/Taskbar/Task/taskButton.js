import React from 'react';
import invert from 'invert-color';
import './taskButton.css';

class TaskButton extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps !== this.props || nextState !== this.state ){
            return true;
        }
    }
    render(){
        return(
            <div onClick={ e => this.props.onToggleMinimize(this.props.uuid)} style={{ color: invert(window.systemColor0, true)}}   className="taskButton">
                <img alt="" className="taskIcon" src={this.props.icon}  />
                <div className="taskTitle">{window.winTitle[this.props.uuid]}</div>
            </div>
        );
    } 
} 

export default TaskButton;