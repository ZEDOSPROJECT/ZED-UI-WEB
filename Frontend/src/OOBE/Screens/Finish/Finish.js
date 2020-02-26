import React from 'react';
import FinishLogo from './done.png';
import './Finish.css';

export default class Finish extends React.Component {
    render(){
        return(<div>
            <center>
            <h1>All Done!</h1>
            <p><img className="FinishPNG" src={FinishLogo} /></p>
            <p>Now you will enter in your no ZED installation</p>   
            <br/>
            <hr/>
            <p>Tank you for "https://soundcloud.com/programmerofficial" to the background music</p>
            </center>
        </div>)
    }
}