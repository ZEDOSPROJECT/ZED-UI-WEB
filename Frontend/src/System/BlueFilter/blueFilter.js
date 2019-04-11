import React from 'react';
import './blueFilter.css'

class BlueLightFilter extends React.Component {
    constructor(props){
        super(props);
        setInterval(() => {
            this.render();
        }, 3000);
    }
    render(){
        const time = new Date();
        let showFilter=false;
        if(time.getHours()<=6 || time.getHours()>20){
            if(this.props.enabled)
            showFilter=true;
        } 
        return(
            <div className={ showFilter ? "blueFilter" : "blueFilterOff" }  style={{ zIndex: window.maxZIndex+1000 }}/>            
        );
    } 
} 

export default BlueLightFilter;