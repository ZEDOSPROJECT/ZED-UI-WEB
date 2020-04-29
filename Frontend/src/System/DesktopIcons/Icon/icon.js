import React from 'react';
import { REST_URL } from '../../../REST_URL';
import './icon.css';

class Icon extends React.Component {
    constructor(props){
        super(props);
        this.processClick = this.processClick.bind(this);
    }

    processClick(){
        this.props.onClickApp(null,REST_URL+"/APPS/"+this.props.Name+"/",this.props.Name,REST_URL+"/APPS/"+this.props.Name+"/favicon.png",this.props.WindowSize,false);
    }


    render(){
        let finalIR;
        if(this.props.RequireInternet !== undefined){
            finalIR = this.props.RequireInternet;
        }
        if(finalIR === "true" ){
            if(localStorage.hasInternet.toString() === "true"){
                return(
                    <div onClick={this.processClick} title={this.props.Name} className="desktopIcon">
                        <center>
                            <img draggable="false" alt="" className="desktopIconImage" src={this.props.Icon} />
                        </center>
                        <center><div className="desktopIconLabel">{this.props.Name}</div></center>
                    </div>
                );
            }else{
                return(
                    <div title={this.props.Name+" [NEED INTERNET CONNECTION]"} className="desktopIconOffline">
                        <center>
                            <img draggable="false" alt="" className="desktopIconImageOffline" src={this.props.Icon} />
                        </center>
                        <center><div className="desktopIconLabel">{this.props.Name}</div></center>
                    </div>
                );
            }
        }else{
            return(
                <div onClick={this.processClick} title={this.props.Name} className="desktopIcon">
                    <center>
                        <img draggable="false" alt="" className="desktopIconImage" src={this.props.Icon} />
                    </center>
                    <center><div className="desktopIconLabel">{this.props.Name}</div></center>
                </div>
            );
        }
    }
}

export default Icon;