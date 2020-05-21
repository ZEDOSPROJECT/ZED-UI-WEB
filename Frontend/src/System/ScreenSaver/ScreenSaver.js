import React, { Component } from 'react';
import { REST_URL } from '../../REST_URL';
import './ScreenSaver.css';

export default class ScreenSaver extends Component {
    render() {
        if(this.props.timer>5){
            return(
                <div>
                    <video style={{zIndex: window.maxZIndex+100,opacity: 1,cursor: "none"}} className="ScreenSaver" src={REST_URL+"/Wallpapers/ScreenSaver.mp4"} loop autoPlay muted></video>
                </div>
            )
        }else{
            return null
           
        }
    }
}
