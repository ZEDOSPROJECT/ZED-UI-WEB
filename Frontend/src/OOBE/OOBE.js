import React from 'react';
import TITLE from './title.mp3';
import ZEDLogo from '../Icons/logo.png';
import Buttons from './Buttons/Buttons';
import SRCUser from './Screens/User/User';
import SRCFinish from './Screens/Finish/Finish';
import BackgroundVideo from './bg.mp4';
import WelcomeVideo from './welcome.webm';
import Welcome from './Screens/Welcome/Welcome';
import BTNNext from './next.png';
import BTNBack from './back.png';
import { REST_URL } from '../REST_URL';
import './OOBE.css';

export default class OOBE extends React.Component {
    constructor(props){
        super(props);
        let TITLEPlayer = new Audio(TITLE);
        TITLEPlayer.play();

        setInterval(() => {
            if(this.state.endOOBE && TITLEPlayer.volume>0.002){
                TITLEPlayer.volume=TITLEPlayer.volume-0.001;
            }
        }, 9);

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
                        />,
                        <SRCFinish />],
            username: '',
            password: '',
            repeatPassword: '',
            endOOBE: false,
        }
    }

    onPass(e){
        this.setState({
            password: e.target.value
        })
        window.r=e.target.value;
    }

    onPassRep(e){
        this.setState({
            repeatPassword: e.target.value
        })
        window.rp=e.target.value;
    }

    onUsername(e){
        const tmp=e.target.value.toLowerCase();
        this.setState({
            username: tmp
        })
        window.u=tmp;
    }

    onNext(){
        if(this.state.currentScreen === this.state.Screens.length-1 ){
            fetch(REST_URL+'/API/SYSTEM/SETTINGS/USER/OOBEFinish.php?username="'+this.state.username+'"&password='+decodeURI(this.state.password));
            this.setState({ endOOBE: true});
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
        }else if(this.state.endOOBE){
            return(
                <div className="endOOBE">
                    <img alt="" src={ZEDLogo} className="endOOBELOGO"/><br/>
                    <p>Please wait . . .</p>
                </div>
            );
        }else{
            let blockNext=false;

            if(this.state.currentScreen===1){
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
                        <img alt="" draggable="false" className="ZEDLOGOPNG" src={ZEDLogo} /><div className="ZEDLOGOLABEL"> ZED <font color="red">XP</font></div>
                    </div>
                </div>
                <div className="OOBEContainer">
                    {this.state.Screens[this.state.currentScreen]}
                </div>
                <div className="OOBEBar bottom"> 
                    <div className="buttonsGrup">
                        {this.state.currentScreen !==0 ? (
                            <Buttons OnClick={this.onBack} Bimg={BTNBack} title="Back"/>  
                        ):null}
                        {this.state.Screens.length-1 === this.state.currentScreen ? (
                            <Buttons OnClick={this.onNext} Nimg={BTNNext} title="Finish"/>
                        ):(
                            <Buttons OnClick={this.onNext} Nimg={BTNNext} title="Next"/>
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