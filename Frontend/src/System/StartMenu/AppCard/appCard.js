import React from 'react'
import invert from 'invert-color';
import { REST_URL } from './../../../REST_URL';
import './appCard.css';

class appCard extends React.Component{
    render(){
        const appIcon=REST_URL+"/APPS/"+this.props.appName+"/favicon.png";
        return(
            <div onClick={(event) => (this.props.onClickApp(event,this.props.appName))}  className="appCard">
                <img alt="" style={{ color: invert(window.systemColor, true)}} className="appCardIcon" src={appIcon}  /><div className="appCardTitle">{this.props.appName} </div>
            </div>
        )
    }  
}  

export default appCard;