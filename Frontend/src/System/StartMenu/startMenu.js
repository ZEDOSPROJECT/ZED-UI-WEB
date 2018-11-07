import React from 'react';
import onClickOutside from 'react-onclickoutside';
// ICONS
import UserIcon from '../../Icons/User.jpg';
import myDocuments from '../../Icons/ModernXP (16).png';
import myPictures from '../../Icons/ModernXP (62).png';
import myMusic from '../../Icons/ModernXP (38).png';
import myComputer from '../../Icons/ModernXP (10).png';
import controlPanel from '../../Icons/ModernXP (41).png';
import logoff from '../../Icons/ModernXP (3).png';
import shutdown from '../../Icons/ModernXP (2).png';
/////////////////////////////
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
            if(app !== "." && app !== ".." && app != "Settings") {
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
                <div style={{ zIndex: window.maxZIndex+10 }} >
                    <div className="startMenu" style={{ backgroundColor: this.convertHex(this.props.systemColor,60) }}>
                        <div className="topMenu" style={{ backgroundColor: this.convertHex(this.props.systemColor,95) }}>
                            <div>
                                <img className="userPicture" height="32" src={UserIcon}></img>
                                <div className="userName"><b>Administrator</b></div>
                            </div>
                        </div>
                        <div className="middleMenu">
                            <div className="AppsList">
                                {appList} 
                            </div>
                            <div className="systemMenu" style={{ backgroundColor: this.convertHex(this.props.systemColor,35) }}>
                                <div class="systemItem">
                                    <img src={myDocuments} ></img>
                                    <div>My Documents</div>
                                </div>
                                <div class="systemItem">
                                    <img src={myPictures} ></img>
                                    <div>My Pictures</div>
                                </div>
                                <div class="systemItem">
                                    <img src={myMusic} ></img>
                                    <div>My Music</div>
                                </div>
                                <div class="systemItem">
                                    <img src={myComputer} ></img>
                                    <div>My Computer</div>
                                </div>
                                <hr></hr>
                                <div onClick={event => this.props.onClickApp(event,"Settings")}  class="systemItem">
                                    <img src={controlPanel} ></img>
                                    <div>Control Panel</div>
                                </div>
                            </div>
                        </div>
                        <div className="bottomMenu" style={{ backgroundColor: this.convertHex(this.props.systemColor,95) }}>
                            <input autoFocus placeholder="Type to search . . ." type="text"></input>
                            <img className="logoff" src={logoff} width="32" height="32" ></img>
                            <img className="shutdown" src={shutdown} width="32" height="32" ></img>
                        </div>
                    </div>
                </div>
            ) : null)
        );
    }
}

export default onClickOutside(StartMenu)
