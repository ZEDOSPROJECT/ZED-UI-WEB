import React from 'react';
import TITLE from './title.mp3';
import ZEDLogo from '../Icons/logo.png';
import Buttons from './Buttons/Buttons';
import SRCWelcome from './Screens/Welcome/Welcome';
import BackgroundVideo from './bg.mp4';
import WelcomeVideo from './welcome.webm';
import './OOBE.css';
import Welcome from './Screens/Welcome/Welcome';

export default class OOBE extends React.Component {
    constructor(props){
        super(props);
        let TITLEPlayer = new Audio(TITLE);
        TITLEPlayer.play();

        this.state = {
            WelcomeVideo: true,
            currentScreen: 0,
            Screens: [<Welcome />]
        }
        this.onBack = this.onBack.bind(this);
        this.onNext = this.onNext.bind(this);
    }

    onNext(){
        this.setState({
            currentScreen: this.state.currentScreen+1
        })
    }

    onBack(){
        this.setState({
            currentScreen: this.state.currentScreen-1
        })
    }

    componentDidMount() {
        this.videoElement.addEventListener("ended", () => {
            this.setState({ WelcomeVideo: false})
        });
    }

    render(){
        if(this.state.WelcomeVideo){
            return(<div className="OOBE"><video ref={el => this.videoElement = el} width="101%" autoPlay className="WelcomeVideo" src={WelcomeVideo} /></div>)
        }else{
            return(<div className="OOBE">
                <video loop width="101%" autoPlay className="BackgroundVideo" src={BackgroundVideo} />
                <div className="OOBEBar top">
                    <div className="ZEDLOGO">
                        <img className="ZEDLOGOPNG" src={ZEDLogo} /><div className="ZEDLOGOLABEL"> ZED <font color="red">XP</font></div>
                    </div>
                </div>
                <div className="OOBEContainer">
                    {this.state.Screens[this.state.currentScreen]}
                </div>
                <div className="OOBEBar bottom"> 
                    <div className="buttonsGrup">
                        {this.state.currentScreen !==0 ? (
                            <Buttons OnClick={this.onBack} title="Back"/>  
                        ):null}
                        <Buttons OnClick={this.onNext} title="Next"/>
                    </div>
                </div>
            </div>)
        }
    }
}