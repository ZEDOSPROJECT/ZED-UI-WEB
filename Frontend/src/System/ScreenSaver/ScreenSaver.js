import React, { Component } from 'react';
import { REST_URL } from '../../REST_URL';
import './ScreenSaver.css';

export default class ScreenSaver extends Component {
    constructor(props){
        super(props);
    }
    render() {
        if(this.props.timer>5){
            return(
                <div>
                    <video style={{zIndex: window.maxZIndex,opacity: 1,cursor: "none"}} className="ScreenSaver" src={REST_URL+"/Wallpapers/Videos/Winter Lantern (Animated Wallpaper) - Wallpaper Engine.mp4"} loop autoPlay muted></video>
                </div>
            )
        }else{
            return null
           
        }
    }
}
