import React from 'react';
import Clock from '../Clock/clock';
import TaskButton from './Task/taskButton';
import './taskbar.css';

class Taskbar extends React.Component {
    render(){
        const iconList = this.props.openedWindows.map((element) =>
            <TaskButton icon={element.WINDOW.props.icon} />
        );
        console.log(iconList);
        return(
            <div className="Taskbar">
                <div onClick={this.props.toggleMenu} className="StartMenu"></div>
                <div className="buttonsArea">
                   {iconList} 
                </div>
                <Clock />
            </div>
        )
    }
}

export default Taskbar;