import React from 'react';
import onClickOutside from 'react-onclickoutside';
import invert from 'invert-color';
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
            Apps: [],
            searchBox: ''
        }
        
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.convertHex = this.convertHex.bind(this);
        this.refreshApps = this.refreshApps.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);

        this.refreshApps("");
        setInterval(() => {
            if(this.props.visible){
                this.refreshApps(this.state.searchBox);
            } 
	    else
	    {
		this.setState({searchBox: ''});
	    }
        },100);
    } 

    refreshApps(query){
        fetch(REST_URL+'/API/APPS/getAppsList.php?query='+query)
        .then(response => response.json())
        .then(json => {
            this.setState({
                Apps: json,
            });
        });
    } 

    handleSearchChange(e){
        this.setState({
            searchBox: e.target.value
        });
        this.refreshApps(e.target.value);
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
                    newDiv=<div style={{ color: invert(window.systemColor, true)}} className="startLeter"><b>{lastLeter}</b></div>
                }
                return <div>{newDiv}<AppCard onClickApp={this.props.onClickApp} appName={app}  /></div>
            }else{
                return null;
            } 
        });

        return(
            (this.props.visible ? (
                <div style={{ zIndex: window.maxZIndex+10 }} >
                    <div className="startMenu" style={{ backgroundColor: this.convertHex(window.systemColor,60) }}>
                        <div className="topMenu" style={{ backgroundColor: this.convertHex(window.systemColor,95) }}>
                            <div>
                                <img className="userPicture" height="32" src={UserIcon}></img>
                                <div style={{ color: invert(window.systemColor, true)}} className="userName"><b>Administrator</b></div>
                            </div>
                        </div>
                        <div className="middleMenu">
                            <div className="AppsList" style={{ color: invert(window.systemColor, true)}}>
                                {appList} 
                            </div>
                            <div className="systemMenu" style={{ backgroundColor: this.convertHex(window.systemColor,35), color: invert(window.systemColor, true)}}>
                                <div style={{ color: invert(window.systemColor, true)}} class="systemItem">
                                    <img src={myDocuments} ></img>
                                    <div>My Documents</div>
                                </div>
                                <div style={{ color: invert(window.systemColor, true)}} class="systemItem">
                                    <img src={myPictures} ></img>
                                    <div>My Pictures</div>
                                </div>
                                <div style={{ color: invert(window.systemColor, true)}} class="systemItem">
                                    <img src={myMusic} ></img>
                                    <div>My Music</div>
                                </div>
                                <div onClick={event => this.props.onClickApp(event,"MyComputer")} style={{ color: invert(window.systemColor, true)}} class="systemItem">
                                    <img src={myComputer} ></img>
                                    <div>My Computer</div>
                                </div>
                                <hr></hr>
                                <div onClick={event => this.props.onClickApp(event,"Settings")} style={{ color: invert(window.systemColor, true)}} class="systemItem">
                                    <img src={controlPanel} ></img>
                                    <div>Control Panel</div>
                                </div>
                            </div>
                        </div>
                        <div className="bottomMenu" style={{ backgroundColor: this.convertHex(window.systemColor,95) }}>
                            <input autoFocus onChange={this.handleSearchChange} placeholder="Type to search . . ." type="text"></input>
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
