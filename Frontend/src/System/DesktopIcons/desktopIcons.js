import React from 'react';
import Icon from './Icon/icon';
import getUUID from 'uuid';
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
        if(this.desktopRefeshTimer==10){
            this.desktopRefeshTimer=0;
            return true;
        }else{
            return false;
        }
    }
    render(){
        console.log()
        let storedIcons=[];
        let fianlRender=null;
        if(localStorage.favoriteIcons){
            storedIcons=JSON.parse(localStorage.favoriteIcons).favorites;
            fianlRender = storedIcons.map((element) => {
                return <Icon
                    key={getUUID()}
                    onClickApp = {this.props.onClickApp}
                    Exec = ""
                    WindowSize = {element.WindowSize}
                    Icon = {element.Icon}
                    Name = {element.Name}
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