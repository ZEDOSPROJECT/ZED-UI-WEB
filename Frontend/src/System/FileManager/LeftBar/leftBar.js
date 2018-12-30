import React from 'react';
import Combo from './Combo/combo';
import './leftBar.css';

class LeftBar extends React.Component {
    render(){
        return(<div className="leftBar">
            <Combo title="Tasks" open >Hello World</Combo>
            <Combo title="Other Places" open >Hello World</Combo>
            <Combo title="Details" >Hello World</Combo>
        </div>);
    } 
} 

export default LeftBar;