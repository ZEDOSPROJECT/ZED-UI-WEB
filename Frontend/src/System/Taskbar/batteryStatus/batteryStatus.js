import React from 'react';
import Battery from 'react-device-battery';
import './batteryStatus.css';
import b0 from './0.png';
import b1 from './1.png';
import b2 from './2.png';
import b3 from './3.png';
import b4 from './4.png';
import b5 from './5.png';
import b6 from './6.png';
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
        const batteryIcon=(<div>
           { batteryLevel<=8 ? (<img src={b0} ></img>) : null }
           { batteryLevel<=20 && batteryLevel>9 ? (<img src={b1} ></img>) : null } 
           { batteryLevel<=40 && batteryLevel>20 ? (<img src={b2} ></img>) : null } 
           { batteryLevel<=60 && batteryLevel>40 ? (<img src={b3} ></img>) : null }
           { batteryLevel<=80 && batteryLevel>60 ? (<img src={b4} ></img>) : null }
           { batteryLevel<=95 && batteryLevel>80 ? (<img src={b5} ></img>) : null }
           { batteryLevel>95 ? (<img src={b6} ></img>) : null }
        </div>);

        return(
            <div className="BatteryStatus">
                <Battery 
                    onChange={(battery ) => {
                        this.render();
                    }}
                    render={({ battery }) =>
                        <div>
                            { battery<=8 ? (<img src={b0} ></img>) : null }
                            { battery<=20 && battery>9 ? (<img src={b1} ></img>) : null } 
                            { battery<=40 && battery>20 ? (<img src={b2} ></img>) : null } 
                            { battery<=60 && battery>40 ? (<img src={b3} ></img>) : null }
                            { battery<=80 && battery>60 ? (<img src={b4} ></img>) : null }
                            { battery<=95 && battery>80 ? (<img src={b5} ></img>) : null }
                            { battery>95 ? (<img src={b6} ></img>) : null }
                        </div>
                    } 
                />
               {batteryIcon} 
               { this.state.charging ? (<img className="batteryCharging" src={charging} ></img>) : null }
            </div>
        );
    } 
} 

export default BatteryStatus;