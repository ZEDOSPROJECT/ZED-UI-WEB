import React from 'react';
import onClickOutside from 'react-onclickoutside';
import UserIcon from '../../Icons/User.jpg';
import AppCard from './AppCard/appCard';
import { REST_URL } from './../../REST_URL';
import './startMenu.css';

class StartMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            Apps: []
        }
        
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.convertHex = this.convertHex.bind(this);
    } 
    componentWillMount(){
        fetch(REST_URL+'/API/APPS/getAppsList.php')
            .then(response => response.json())
            .then(json => {
                this.setState({
                    Apps: json,
                });
            });
    }

    handleClickOutside() {
        this.props.toggleMenu();
    }

    convertHex(hex,opacity){
        hex = hex.replace('#','');
        const r = parseInt(hex.substring(0,2), 16);
        const g = parseInt(hex.substring(2,4), 16);
        const b = parseInt(hex.substring(4,6), 16);
    
        const result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
        return result;
    }

    render(){
        let lastLeter="0";
        const appList = this.state.Apps.map((app) =>{ 
            if(app !== "." && app !== "..") {
                let newDiv;
                if(app.charAt(0).toUpperCase()!=lastLeter.toUpperCase()) {
                    lastLeter=app.charAt(0);
                    newDiv=<div className="startLeter"><b>{lastLeter}</b></div>
                }
                return <div>{newDiv}<AppCard onClickApp={this.props.onClickApp} appName={app}  /></div>
            }else{
                return null;
            } 
        });

        return(
            (this.props.visible ? (
                <div style={{ zIndex: this.props.maxZIndex+10 }} >
                    <div className="startMenu" style={{ backgroundColor: this.convertHex(this.props.systemColor,80) }}>
                        <div className="topMenu" style={{ backgroundColor: this.convertHex(this.props.systemColor,95) }}>
                            <div>
                                <img className="userPicture" width="32" src={UserIcon}></img>
                                <div className="userName">User Name</div>
                            </div>
                        </div>
                        <div className="middleMenu">
                            <div className="AppsList">
                                {appList} 
                            </div>
                            <div className="systemMenu">

                            </div>
                        </div>
                        <div className="bottomMenu" style={{ backgroundColor: this.convertHex(this.props.systemColor,95) }}>

                        </div>
                    </div>
                </div>
            ) : null)
        );
    }
}

export default onClickOutside(StartMenu)