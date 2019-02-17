import React from 'react';
import './blueFilter.css'

class BlueLightFilter extends React.Component {
    render(){
        const time = new Date();
        let showFilter=false;
        if(time.getHours()<=6 || time.getHours()>20){
            showFilter=true;
        } 
        return(
            (showFilter ? (
                <div className="blueFilter"  style={{ zIndex: window.maxZIndex+1000 }} />
            ) : null)
            
        );
    } 
} 

export default BlueLightFilter;