import React from 'react';
import VUGif from './vu.gif';
import invert from 'invert-color';
import './taskButton.css';

class TaskButton extends React.Component {
    constructor(props){
        super(props);
        setInterval(() => {
            this.forceUpdate();
        }, 800);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps !== this.props || nextState !== this.state ){
            return true;
        }
    }

    render(){
        let isPlaying=false;
        let isTOP=true;
        let currentTitle=window.winTitle[this.props.uuid];
        let notifys=null;
        if(window.topUUID !== this.props.uuid){
            isTOP=false;
        }

        if(!isTOP){
            if(currentTitle.indexOf("(")!==-1 && currentTitle.indexOf(")")!==-1){
                try {
                    notifys=Number(currentTitle.split('(').pop().split(')')[0]).toString();
                    if(notifys==="NaN"){
                        notifys=null;
                    }else{
                        if(Number(notifys)>9){    
                            notifys="9+";
                        }
                    }
                } catch (e) {}
            }
        }

        if(window.soundsEmitter.indexOf(this.props.uuid) !== -1){
            isPlaying=true;
        }
        return(
            <div title={currentTitle} onClick={ e => this.props.onToggleMinimize(this.props.uuid)} style={{ color: invert(window.systemColor0, true), backgroundColor: ( isTOP ? "rgba(0,0,0,0.2)" : "" ) }}   className="taskButton">
                {notifys !== null ? (
                    <div>
                        <div className="notifyAnimation"></div>
                    </div>
                ) : null }
                { isPlaying ? (<img draggable="false" alt="" className="taskSound" src={VUGif} />) : null }
                <img draggable="false" alt="" className="taskIcon" src={this.props.icon}  />
                <div className="taskTitle">{currentTitle}</div>
                {notifys !== null ? (
                    <div>
                        <div className="notifys">{notifys}</div>
                    </div>
                ) : null }
            </div>
        );
    } 
} 

export default TaskButton;