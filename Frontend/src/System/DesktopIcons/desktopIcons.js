import React from 'react';
import Icon from './Icon/icon';
import { v4 as getUUID } from 'uuid';
import './desktopIcons.css';

class DesktopIcons extends React.Component {
    desktopRefeshTimer=0;
    constructor(props){
        super(props);
        setInterval(() => {
            this.render();
        }, 900);
    }
    shouldComponentUpdate(){
        this.desktopRefeshTimer++;
        if(this.desktopRefeshTimer===10){
            this.desktopRefeshTimer=0;
            return true;
        }else{
            return false;
        }
    }
    render(){
        let storedIcons=[];
        let fianlRender=null;
        if(localStorage[localStorage.currentLAN+"|favoriteIcons"]){
            storedIcons=JSON.parse(localStorage[localStorage.currentLAN+"|favoriteIcons"]).favorites;
            fianlRender = storedIcons.map((element) => {
                return <Icon
                    key={getUUID()}
                    onClickApp = {this.props.onClickApp}
                    Exec = ""
                    WindowSize = {element.WindowSize}
                    Icon = {element.Icon}
                    Name = {element.Name}
                    RequireInternet = {element.RequireInternet}
                />
            });
        }
        return(
            <div className="desktopIcons">
                {fianlRender}
            </div>
        );
    }
}

export default DesktopIcons;