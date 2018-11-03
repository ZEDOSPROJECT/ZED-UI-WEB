import React from 'react';
import Clock from '../Clock/clock';
import TaskButton from './Task/taskButton';
import NetworkStatus from './networkStatus/networkStatus';
import BatteryStatus from './batteryStatus/batteryStatus';
import './taskbar.css';

class Taskbar extends React.Component {
    constructor(props){
        super(props);

        this.convertHex = this.convertHex.bind(this);
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
        const iconList = this.props.openedWindows.map((element) =>{
            if(element!=null){
                return(<TaskButton uuid={element.UUID} onToggleMinimize={this.props.onToggleMinimize} title={element.WINDOW.props.title} icon={element.WINDOW.props.icon} />);
            } 
        }
        );
        return(
            <table className="Taskbar" style={{ backgroundColor: this.convertHex(this.props.systemColor,90) }}>
                <tr>
                    <td style={{ width: "32px" }}><div onClick={this.props.toggleMenu} className="StartMenu"></div></td>
                    <td className="buttonsArea">{iconList}</td>
                    <td><BatteryStatus /></td>
                    <td><NetworkStatus /></td>
                    <td><Clock maxZIndex={this.props.maxZIndex}/></td>
                </tr>
            </table>
        )
    }
}

export default Taskbar;