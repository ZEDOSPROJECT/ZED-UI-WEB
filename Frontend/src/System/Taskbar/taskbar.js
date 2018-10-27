import React from 'react';
import Clock from '../Clock/clock';
import TaskButton from './Task/taskButton';
import NetworkStatus from './networkStatus/networkStatus';
import BatteryStatus from './batteryStatus/batteryStatus';
import './taskbar.css';

class Taskbar extends React.Component {
    render(){
        const iconList = this.props.openedWindows.map((element) =>{
            if(element!=null){
                return(<TaskButton uuid={element.UUID} onToggleMinimize={this.props.onToggleMinimize} icon={element.WINDOW.props.icon} />);
            } 
        }
        );
        return(
            <table className="Taskbar" style={{ backgroundColor: this.props.systemColor }}>
                <tr>
                    <td style={{ width: "32px" }}><div onClick={this.props.toggleMenu} className="StartMenu"></div></td>
                    <td className="buttonsArea">{iconList}</td>
                    <td><BatteryStatus /></td>
                    <td><NetworkStatus /></td>
                    <td><Clock /></td>
                </tr>
            </table>
        )
    }
}

export default Taskbar;