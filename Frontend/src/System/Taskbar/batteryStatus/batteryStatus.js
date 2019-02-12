import React from 'react';
import Battery from 'react-device-battery';
import './batteryStatus.css';
import charging from './charging.png';
import lowBattery from './lb.png';

class BatteryStatus extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            charging: false
        });

        this.updateChargeInfo = this.updateChargeInfo.bind(this);
        this.isLowerBattery = this.isLowerBattery.bind(this);

        navigator.getBattery().then((battery) => {
            this.updateChargeInfo(battery);
            battery.addEventListener('chargingchange', () => {
                this.updateChargeInfo(battery);
            });
        }); 
    } 

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps !== this.props || nextState !== this.state ){
            return true;
        }
    }

    isLowerBattery(lvl){
        if(!this.state.charging){
            if(lvl<16){
                return true;
            }else{
                return false;
            } 
        } else {
            return false;
        } 
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
                            { this.state.charging ? (<img alt="" className="batteryCharging" src={charging} ></img>) : null } 
                            { this.isLowerBattery(battery) ? (<img alt="" className="lowBattery" src={lowBattery} ></img>) : null } 
                        </center>
                    </div>
                    } 
                />
            </div>
        );
    } 
} 

export default BatteryStatus;