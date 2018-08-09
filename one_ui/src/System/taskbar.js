import React from 'react';
import './taskbar.css';
import startIcon from '../Icons/logo.png';
import Clock from './clock';
import StartMenu from './startMenu';

class Taskbar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showMenu: false
        }
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    toggleMenu(){
        this.setState({
            showMenu: !this.state.showMenu,
        });
    }

    render(){
        return(
            <div className="Taskbar">
                <img alt="" src={startIcon} onClick={this.toggleMenu} className="StartMenu"></img>
                <StartMenu visible={this.state.showMenu}/>
                <Clock />
            </div>
        )
    }
}

export default Taskbar;