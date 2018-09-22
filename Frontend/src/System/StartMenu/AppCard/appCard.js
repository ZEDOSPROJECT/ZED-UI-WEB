import React from 'react'
import { REST_URL } from './../../../REST_URL';
import './appCard.css';

class appCard extends React.Component{
    render(){
        const appIcon=REST_URL+"/APPS/"+this.props.appName+"/favicon.png";
        return(
            <div className="appCard">
                <img alt="" className="appCardIcon" src={appIcon}  /><div>{this.props.appName} </div>
            </div>
        )
    }  
}  

export default appCard;