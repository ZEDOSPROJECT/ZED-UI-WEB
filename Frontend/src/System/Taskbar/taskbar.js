import React from 'react';
import Clock from '../Clock/clock';
import TaskButton from './Task/taskButton';
import NetworkStatus from './networkStatus/networkStatus';
import './taskbar.css';

class Taskbar extends React.Component {
    render(){
        const iconList = this.props.openedWindows.map((element) =>
            <TaskButton uuid={element.UUID} onToggleMinimize={this.props.onToggleMinimize} icon={element.WINDOW.props.icon} />
        );
        return(
            <div className="Taskbar">
                <div onClick={this.props.toggleMenu} className="StartMenu"></div>
                <div className="buttonsArea">
                   {iconList} 
                </div>
                <NetworkStatus />
                <Clock />
            </div>
        )
    }
}

export default Taskbar;