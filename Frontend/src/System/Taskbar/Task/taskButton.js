import React from 'react';
import VUGif from './vu.gif';
import invert from 'invert-color';
import './taskButton.css';

class TaskButton extends React.Component {
    constructor(props){
        super(props);
        setInterval(() => {
            this.render();
        }, 800);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps !== this.props || nextState !== this.state ){
            return true;
        }
    }

    render(){
        let isPlaying=false;
        if(window.soundsEmitter.indexOf(this.props.uuid) !== -1){
            isPlaying=true;
        }
        return(
            <div title={window.winTitle[this.props.uuid]} onClick={ e => this.props.onToggleMinimize(this.props.uuid)} style={{ color: invert(window.systemColor0, true)}}   className="taskButton">
                { isPlaying ? (<img alt="" className="taskSound" src={VUGif} />) : null }
                <img alt="" className="taskIcon" src={this.props.icon}  />
                <div className="taskTitle">{window.winTitle[this.props.uuid]}</div>
            </div>
        );
    } 
} 

export default TaskButton;