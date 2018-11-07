import React from 'react';
import Battery from 'react-device-battery';
import './batteryStatus.css';
import charging from './charging.png';

let batteryLevel=0;

class BatteryStatus extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            charging: false
        });

        this.updateChargeInfo = this.updateChargeInfo.bind(this);

        navigator.getBattery().then((battery) => {
            this.updateChargeInfo(battery);
            battery.addEventListener('chargingchange', () => {
                this.updateChargeInfo(battery);
            });
        }); 
    } 

    updateChargeInfo(battery){
        this.setState({
            charging: battery.charging
        });
    }

    render(){
        return(
            <div className="BatteryStatus">
                <Battery 
                    onChange={(battery ) => {
                        this.render();
                    }}
                    render={({ battery }) =>
                    <div className="battery">
                        <center>
                            <div className="batteryTop">
                            </div>
                            <div className="batteryContaimer">
                                <div className="batteryCharge" style={{ height: battery+'%'}}>
                                </div>
                            </div>
                        </center>
                    </div>
                    } 
                />
               { this.state.charging ? (<img className="batteryCharging" src={charging} ></img>) : null }
            </div>
        );
    } 
} 

export default BatteryStatus;