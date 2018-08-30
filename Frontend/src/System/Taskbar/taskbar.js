import React from 'react';
import './taskbar.css';
import Clock from '../Clock/clock';

class Taskbar extends React.Component {
    render(){
        return(
            <div className="Taskbar">
                <div onClick={this.props.toggleMenu} className="StartMenu"></div>
                <Clock />
            </div>
        )
    }
}

export default Taskbar;