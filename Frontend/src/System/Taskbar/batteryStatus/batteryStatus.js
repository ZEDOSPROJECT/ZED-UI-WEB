import React from 'react';
import './batteryStatus.css';
import charging from './charging.png';
import lowBattery from './lb.png';

class BatteryStatus extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            charging: false,
            chargingTime: undefined,
            dischargingTime: undefined,
            level: undefined
        });

        this.updateChargeInfo = this.updateChargeInfo.bind(this);
        this.isLowerBattery = this.isLowerBattery.bind(this);
        this.timeConvert = this.timeConvert.bind(this);

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
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
            level: battery.level*100
        });
    }

    timeConvert(n) {
        let hoursString="";
        var num = n;
        var hours = (num / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        if(rhours !== 0){
            hoursString = rhours + " hour(s) and ";
        }
        return hoursString+rminutes+" minute(s)"
    }

    render(){
        let label="";
        if(this.state.charging){
            label="Charging ("+Math.round(this.state.level)+"%), "+this.timeConvert((this.state.chargingTime/60))+" remaning";
        }else{
            label="Discharging ("+Math.round(this.state.level)+"%), "+this.timeConvert((this.state.dischargingTime/60))+" remaning";
        }
        return(
            <div className="BatteryStatus">
                <div title={label} className="battery">
                    <center>
                        <div className="batteryTop">
                        </div>
                        <div className="batteryContaimer">
                            <div className="batteryCharge" style={{ height: this.state.level+'%'}}>
                            </div>
                        </div>
                        { this.state.charging ? (<img draggable="false" alt="" className="batteryCharging" src={charging} ></img>) : null } 
                        { this.isLowerBattery(this.state.level) ? (<img draggable="false" alt="" className="lowBattery" src={lowBattery} ></img>) : null } 
                    </center>
                </div>
            </div>
        );
    } 
} 

export default BatteryStatus;