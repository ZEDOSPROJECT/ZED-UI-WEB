import React from 'react';
import './blueFilter.css'

class BlueLightFilter extends React.Component {
    render(){
        setInterval(() => {
            this.render();
        }, 300);
        const time = new Date();
        let showFilter=false;
        if(time.getHours()<=6 || time.getHours()>20){
            showFilter=true;
        } 
        return(
            <div className={ showFilter ? "blueFilter" : "blueFilterOff" }  style={{ zIndex: window.maxZIndex+1000 }}/>            
        );
    } 
} 

export default BlueLightFilter;