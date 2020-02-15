import React from 'react';
import TITLE from './title.mp3';
import ZEDLogo from '../Icons/logo.png';
import Buttons from './Buttons/Buttons';
import SRCWelcome from './Screens/Welcome/Welcome';
import SRCUser from './Screens/User/User';
import BackgroundVideo from './bg.mp4';
import WelcomeVideo from './welcome.webm';
import './OOBE.css';
import Welcome from './Screens/Welcome/Welcome';

export default class OOBE extends React.Component {
    constructor(props){
        super(props);
        let TITLEPlayer = new Audio(TITLE);
        TITLEPlayer.play();

        this.onBack = this.onBack.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onUsername = this.onUsername.bind(this);
        this.onPass = this.onPass.bind(this);
        this.onPassRep = this.onPassRep.bind(this);

        this.state = {
            WelcomeVideo: true,
            currentScreen: 0,
            Screens: [<Welcome />,
                      <SRCUser onPass={this.onPass}
                               onUsername={this.onUsername}
                               onPassRep={this.onPassRep}
                        />],
            username: '',
            password: '',
            repeatPassword: ''
        }
    }

    onPass(e){
        this.setState({
            password: e.target.value
        })
    }

    onPassRep(e){
        this.setState({
            repeatPassword: e.target.value
        })
    }

    onUsername(e){
        const tmp=e.target.value.toLowerCase();
        this.setState({
            username: tmp
        })
    }

    onNext(){
        if(this.state.currentScreen === this.state.Screens.length-1 ){
            alert("End of OOBE");
        }else{
            this.setState({
                currentScreen: this.state.currentScreen+1
            })
        }
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
            return(<div className="video-container"><video ref={el => this.videoElement = el} width="101%" autoPlay className="WelcomeVideo" src={WelcomeVideo} /></div>)
        }else{
            let blockNext=false;

            if(this.state.currentScreen==1){
                if(this.state.username === "" || this.state.password === "" || this.state.repeatPassword === "" ){
                    blockNext=true;
                }else{
                    if(this.state.password !== this.state.repeatPassword){
                        blockNext=true;
                    }
                }
            }
            return(<div className="OOBE">
                <video loop width="101%" autoPlay className="BackgroundVideo" src={BackgroundVideo} />
                <div className="OOBEBar top">
                    <div className="ZEDLOGO">
                        <img draggable="false" className="ZEDLOGOPNG" src={ZEDLogo} /><div className="ZEDLOGOLABEL"> ZED <font color="red">XP</font></div>
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
                        {this.state.Screens.length-1 == this.state.currentScreen ? (
                            <Buttons OnClick={this.onNext} title="Finish"/>
                        ):(
                            <Buttons OnClick={this.onNext} title="Next"/>
                        )}
                    </div>
                </div>
                { blockNext ? (
                    <div className="blockNext"></div>
                ):null }
            </div>)
        }
    }
}