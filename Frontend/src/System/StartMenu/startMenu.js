import React from 'react';
import onClickOutside from 'react-onclickoutside'
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
                <div>
                    <div className="startMenu">
                        <div className="leftPanel">
                            <img style={{ position: 'absolute',  bottom: 5 }} alt="" className="menuIcon" src={UserIcon}  />
                        </div>
                        <div className="AppsList">
                        {appList} 
                        </div>
                    </div>
                </div>
            ) : null)
        );
    }
}

export default onClickOutside(StartMenu)