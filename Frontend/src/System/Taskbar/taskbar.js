import React from 'react';
import Clock from '../Clock/clock';
import TaskButton from './Task/taskButton';
import NetworkStatus from './networkStatus/networkStatus';
import BatteryStatus from './batteryStatus/batteryStatus';
import VolumeControl from './volumeControl/VolumeControl';
import NotificationIcon from './NotificationIcon/NotificationIcon';
import Switch3D from './Switch3D/Switch3D';
import BGEffect from './BGEffect/BGEffect';
import './taskbar.css';

class Taskbar extends React.Component {
    constructor(props) {
        super(props);

        this.convertHex = this.convertHex.bind(this);
    }

    convertHex(hex, opacity) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        const result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
        return result;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps !== this.props || nextState !== this.state) {
            return true;
        }
    }

    render() {
        const iconList = this.props.openedWindows.map((element) => {
            if (element != null) {
                return (<TaskButton
                    key={"taskbtn_" + element.UUID}
                    uuid={element.UUID}
                    onToggleMinimize={this.props.onToggleMinimize}
                    title={element.WINDOW.props.title}
                    icon={element.WINDOW.props.icon}
                    onClose={this.props.onClose}
                />);
            }
            return false;
        }
        );
        return (
            <table cellspacing="0" className=" Taskbar" style={{ zIndex: window.maxZIndex + 10, backgroundColor: this.convertHex(window.systemColor0, 95) }}>
                < tbody >
                    <tr style={{ border: 'none', borderWidth: 0 }} >
                        <BGEffect />
                        <td style={{ width: 32, height: 20 }}><div title="Click to Start" onClick={this.props.toggleMenu} className="StartMenu" /></td>
                        <td className="buttonsArea">{iconList}</td>
                        <td style={{ width: 32, height: 20 }}><VolumeControl /></td>
                        <td style={{ width: 32, height: 20 }}><BatteryStatus /></td>
                        <td style={{ width: 32, height: 20 }}><NetworkStatus /></td>
                        <td style={{ width: 32, height: 20 }}><NotificationIcon /></td>
                        <td style={{ width: 32, height: 20 }}><Clock /></td>
                        <td style={{ width: 62, height: 20 }}><Switch3D onSwitch3DClick={this.props.onSwitch3DClick} notSwitch3Dlbl={this.props.notSwitch3Dlbl} /></td>
                    </tr>
                </tbody >
            </table >
        )
    }
}

export default Taskbar;
