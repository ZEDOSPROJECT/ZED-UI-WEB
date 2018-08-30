import React from 'react';

class Battery extends React.Component{

    constructor(props){
        super(props);
        this.state={
            
        }   
    })

    updateAllBatteryInfo() {
        updateChargeInfo();
        updateLevelInfo();
        updateChargingInfo();
        updateDischargingInfo();
    }
      
    updateChargingInfo() {
        console.log("Battery charging time: " + battery.chargingTime + " seconds");
    }
      
    updateChargeInfo() {
        console.log("Battery charging? " + (battery.charging ? "Yes" : "No"));
        if (battery.charging) {
            if (!batteryElement.classList.contains('charging')) {
            batteryElement.classList.add('charging');
            }
        } else {
            if (batteryElement.classList.contains('charging')) {
            batteryElement.classList.remove('charging');
            }
        }
    }
      
    updateDischargingInfo() {
        console.log("Battery discharging time: " + battery.dischargingTime + " seconds");
    }
      
    updateLevelInfo() {
        console.log("Battery level: " + parseFloat(battery.level * 100).toPrecision(2) + "%");
        var percent = batteryElement.getElementsByTagName('span')[0];
        var percentNumber = parseInt(battery.level * 100);
        if (parseInt(percentNumber) > 100) {
            percentNumber = 100;
        }
        percent.className = 'percent-' + percentNumber.toString();
    }
    render(){
        return(
            <i class="material-icon battery">
			    <span class="percent-20"></span>
		    </i>
        );
    } 
} 

export default Battery;