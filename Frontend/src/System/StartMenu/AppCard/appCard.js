import React from 'react'
import invert from 'invert-color';
import { REST_URL } from './../../../REST_URL';
import './appCard.css';

class appCard extends React.Component{
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render(){
        const appIcon=REST_URL+"/APPS/"+this.props.appName+"/favicon.png";
        const appName=this.props.appName;
        const windowSize=this.props.windowSize;
        return(
            <div onClick={(event) => (this.props.onClickApp(event,REST_URL+"/APPS/"+appName+"/",appName,REST_URL+"/APPS/"+appName+"/favicon.png",windowSize))}  className="appCard">
                <img alt="" style={{ color: invert(window.systemColor0, true)}} className="appCardIcon" src={appIcon}  /><div className="appCardTitle">{appName} </div>
            </div>
        )
    }  
}  

export default appCard;