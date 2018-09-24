import React from 'react';
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
    render(){
        const appList = this.state.Apps.map((app) =>{ 
            if(app !== "." && app !== "..") {
                return <AppCard onClickApp={this.props.onClickApp} appName={app}  />
            }else{
                return null;
            } 
        });

        return(
            (this.props.visible ? (
                <div>
                    <div onClick={this.props.toggleMenu}  style={{ width: '100%' , height: '100%' , top: 0 , left: 0 , position: 'fixed' }} />
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

export default StartMenu;