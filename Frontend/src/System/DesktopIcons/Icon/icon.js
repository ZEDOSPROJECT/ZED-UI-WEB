import React from 'react';
import invert from 'invert-color';
import { REST_URL } from '../../../REST_URL';
import './icon.css';

class Icon extends React.Component {
    constructor(props){
        super(props);
        this.processClick = this.processClick.bind(this);
    }

    processClick(){
        this.props.onClickApp(null,REST_URL+"/APPS/"+this.props.Name+"/",this.props.Name,REST_URL+"/APPS/"+this.props.Name+"/favicon.png",this.props.WindowSize);
    }

    render(){
        return(
            <div onClick={this.processClick} title={this.props.Name} className="desktopIcon" style={{ color: invert(window.systemColor1, true)}}>
                <center>
                    <img className="desktopIconImage" src={this.props.Icon} />
                </center>
                <center><div className="desktopIconLabel">{this.props.Name}</div></center>
            </div>
        );
    }
}

export default Icon;