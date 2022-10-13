import React, { Component } from 'react';
import BPlay from '../../Images/play.png';
import BPause from '../../Images/pause.png';
import MaxTime from '../MaxTime/MaxTime';
import CurrentTime from '../CurrentTime/CurrentTime';
import './Controls.css';

class Controls extends Component {
    render() {
        return (
            <div className="Controls">
                <center>
                    <input
                        className="timeLine"
                        type="range"
                        min="0"
                        max="1"
                        step="0.000000001"
                        onChange={this.props.goToTime}
                        value={this.props.currentTime}
                    /><br />
                    { this.props.playing ? (
                        <img alt="" className="btnPPlay" src={BPause} onClick={this.props.handlePlayerClick}/>
                    ):(
                        <img alt="" className="btnPPlay" src={BPlay} onClick={this.props.handlePlayerClick}/>
                    )}
                    <MaxTime MaxTime={this.props.MaxTime}/> 
                    <CurrentTime CurrentTime={this.props.CurrentTime}/>          
                </center>
            </div>
        );
    }
}

export default Controls;