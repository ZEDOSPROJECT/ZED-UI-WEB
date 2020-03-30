import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
import SoundIcon from '../../../Icons/Sound.png';
import { REST_URL } from '../../../REST_URL';
import testSound from '../../../Sounds/info.mp3';
import './VolumeControl.css';

class VolumeControl extends Component {
    constructor(props){
        super(props);

        this.state = {
            volumeScreen:false
        }

        this.toggleVolumeScreen = this.toggleVolumeScreen.bind(this);
        this.onVolumeChange = this.onVolumeChange.bind(this);

        if(!localStorage.systemVolume){
            localStorage.systemVolume=50;
        }
        fetch(REST_URL+'/API/SYSTEM/SETTINGS/setAudioVolume.php?volume='+localStorage.systemVolume);
    }

    toggleVolumeScreen(){
        this.setState({ volumeScreen: !this.state.volumeScreen });
        this.forceUpdate();
    }

    onVolumeChange(e){
        fetch(REST_URL+'/API/SYSTEM/SETTINGS/setAudioVolume.php?volume='+e.target.value);
        localStorage.systemVolume=e.target.value;
        let testSoundPLayer = new Audio(testSound);
        testSoundPLayer.play();
    }

    handleClickOutside() {
        this.setState({ volumeScreen: false });
    }

    render() {
        return (
            <div className="VolumeControl">
                <img onClick={this.toggleVolumeScreen} draggable="false" alt="" src={SoundIcon} width="32" height="32" />
                { this.state.volumeScreen ? (<div className="volumeScreen">
                    System Volume:<br/>
                    <input className="volumeScreenSlider" onMouseUp={this.onVolumeChange} defaultValue={localStorage.systemVolume} type="range" min="0" step="1" max="100"/>
                </div>) : null}
            </div>
        );
    }
}

export default onClickOutside(VolumeControl);