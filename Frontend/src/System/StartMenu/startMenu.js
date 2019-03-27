import React from 'react';
import onClickOutside from 'react-onclickoutside';
import isElectron from 'is-electron';
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

let searchTimer=null;

class StartMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            Apps: [],
            searchBox: '',
            visible: false
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
            this.setState({visible: this.props.visible });
        },100);
    } 

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps !== this.props || nextState !== this.state ){
            return true;
        }
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
        const query=e.target.value;
        if (searchTimer) {
            clearTimeout(searchTimer);
        }
        searchTimer = setTimeout(() => {
            this.setState({
                searchBox:query
            });
            this.refreshApps(query);
            searchTimer = undefined;
        }, 200);
    } 

    handleClickOutside() {
        if(this.props.visible)
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
            let show=true;
            if(isElectron()){
                if(!app.Platforms.includes("DESKTOP")){
                    show=false;
                }
            }else{
                if(!app.Platforms.includes("WEB")){
                    show=false;
                }
            }
            if(app.Name !== "Settings" && show) {
                let newDiv=<div></div>;
                if(this.state.searchBox === ""){
                    if(app.Name.charAt(0).toUpperCase() !== lastLeter.toUpperCase()) {
                        lastLeter=app.Name.charAt(0);
                        newDiv=<div key={"stmenu_"+app.Name} style={{ color: invert(window.systemColor0, true)}} className="startLeter"><b>{lastLeter}</b></div>
                    }
                } 
                return <div key={"stmenu_"+app.Name}>{newDiv}<AppCard onClickApp={this.props.onClickApp} appName={app.Name}  /></div>
            }else{
                return null;
            } 
        });
        const visible=this.state.visible ? "startMenu" : "startMenu hidden";
        return(
            <div>
                <div className={visible} style={{ zIndex: window.maxZIndex+10,backgroundColor: this.convertHex(window.systemColor0,60) }}>
                    <div className="topMenu" style={{ backgroundColor: this.convertHex(window.systemColor0,95) }}>
                        <div>
                            <img alt="" className="userPicture" height="32" src={UserIcon}></img>
                            <div style={{ color: invert(window.systemColor0, true)}} className="userName"><b>Administrator</b></div>
                        </div>
                    </div>
                    <div className="middleMenu">
                        <div className="AppsList" style={{ color: invert(window.systemColor0, true)}}>
                            {appList} 
                        </div>
                        <div className="systemMenu" style={{ backgroundColor: this.convertHex(window.systemColor0,35), color: invert(window.systemColor0, true)}}>
                            <div onClick={event => this.props.onClickApp(event,"","MyDocuments",REST_URL+"/Icons/ModernXP (35).png")} style={{ color: invert(window.systemColor0, true)}} className="systemItem">
                                <img alt="" src={myDocuments} ></img>
                                <div>My Documents</div>
                            </div>
                            <div onClick={event => this.props.onClickApp(event,"","MyPictures",REST_URL+"/Icons/ModernXP (35).png")} style={{ color: invert(window.systemColor0, true)}} className="systemItem">
                                <img alt="" src={myPictures} ></img>
                                <div>My Pictures</div>
                            </div>
                            <div onClick={event => this.props.onClickApp(event,"","MyMusic",REST_URL+"/Icons/ModernXP (35).png")} style={{ color: invert(window.systemColor0, true)}} className="systemItem">
                                <img alt="" src={myMusic} ></img>
                                <div>My Music</div>
                            </div>
                            <div onClick={event => this.props.onClickApp(event,"","MyComputer",REST_URL+"/Icons/ModernXP (35).png")} style={{ color: invert(window.systemColor0, true)}} className="systemItem">
                                <img alt="" src={myComputer} ></img>
                                <div>My Computer</div>
                            </div>
                            <hr></hr>
                            <div onClick={event => this.props.onClickApp(event,REST_URL+"/APPS/Settings/index.php","Settings",REST_URL+"/API/SYSTEM/ICONS/ModernXP (41).png")} style={{ color: invert(window.systemColor0, true)}} className="systemItem">
                                <img alt="" src={controlPanel} ></img>
                                <div>Control Panel</div>
                            </div>
                        </div>
                    </div>
                    <div className="bottomMenu" style={{ backgroundColor: this.convertHex(window.systemColor0,95) }}>
                        <input id="searchBox" autoFocus onChange={this.handleSearchChange} placeholder="Type to search . . ." type="text"></input>
                        <img alt="" className="logoff" src={logoff} width="32" height="32" ></img>
                        <img alt="" className="shutdown" src={shutdown} width="32" height="32" ></img>
                    </div>
                </div>
            </div>
        );
    }
}

export default onClickOutside(StartMenu)
