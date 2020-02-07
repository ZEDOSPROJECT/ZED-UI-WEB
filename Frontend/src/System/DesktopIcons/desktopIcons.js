import React from 'react';
import Icon from './Icon/icon';
import getUUID from 'uuid';
import './desktopIcons.css';

class DesktopIcons extends React.Component {
    constructor(props){
        super(props);
        setInterval(() => {
            this.render();
        }, 9000);
    }
    shouldComponentUpdate(){
        return false;
    }
    render(){
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