import React from 'react';
import invert from 'invert-color';
import isElectron from 'is-electron';
import onClickOutside from 'react-onclickoutside';
import { Rnd } from "react-rnd";
import CCLOSE from './CLOSE.png';
import CMAXIMIZE from './MAXIMIZE.png';
import CRESTORE from './RESTORE.png';
import CMINIMIZE from './MINIMIZE.png';
import FileManager from '../FileManager/fileManager';
import { REST_URL } from '../../REST_URL';
import './window.css';

class Window extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            url: this.props.url,
            modalIsOpen: true,
            draggable: false,
            uuid: this.props.uuid,
            currentZIndex: window.maxZIndex,
            maximized: false,
            x: 15,
            y: 15,
            width: 640,
            height: 480,
            active: true,
            systemColor0: window.systemColor0,
            systemColor1: window.systemColor1,
            gradient: 'on',
            myStyle: "window hidden"
        };
        setTimeout(() => {
            this.setState({myStyle: "window"});
        }, 40);

        this.openModal = this.openModal.bind(this);
        this.onClose = this.onClose.bind(this);
        this.sendToFront = this.sendToFront.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onResizeStart = this.onResizeStart.bind(this);
        this.onToggleWindow = this.onToggleWindow.bind(this);
        this.onToggleMinimize = this.onToggleMinimize.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onErrorFRAME = this.onErrorFRAME.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleClickInsideWindow = this.handleClickInsideWindow.bind(this);
        window.maxZIndex=window.maxZIndex+1;
        setInterval(() => {
            if(window.toFront){
                if(window.toFront === this.props.uuid){
                    let newIndex=this.state.currentZIndex;
                    while (newIndex<=window.maxZIndex) {
                        newIndex++;
                    }
                    window.maxZIndex=newIndex+1;
                    this.setState({ currentZIndex: newIndex+1 });
                    window.toFront=undefined;
                } 
            } 
            if(this.state.systemColor0 !== window.systemColor0){
                this.setState({ systemColor0: window.systemColor0 });
            } 
            if(this.state.gradient !== window.gradientEffect){
                this.setState({ gradient: window.gradientEffect });
            } 
            if(window.gradientEffect === "on"){
                if(this.state.systemColor1 !== window.systemColor1){
                    this.setState({ systemColor1: window.systemColor1 });
                } 
            }
        },10);
    }

    handleClickOutside() {
        this.setState({ active: false });
    }

    handleClickInsideWindow(){
        this.setState({ active: true });
    } 

    sendToFront() {
        setTimeout(() => {
            this.handleClickInsideWindow();
        }, 10);
        let newIndex=this.state.currentZIndex;
        while (newIndex<window.maxZIndex) {
            newIndex++;
        }
        window.maxZIndex=newIndex+1;
        this.setState({ currentZIndex: newIndex+1 });
    } 

    openModal() {
        this.setState({modalIsOpen: true});
    }
    onClose() {
        setTimeout(() => {
            this.props.onClose(this.state.uuid);
        }, 240);
        this.setState({myStyle: "window hidden"});
    }

    onTitleChange(e){
        const newTitle=e.target.title;
        if(newTitle !== ""){
            window.winTitle[this.state.uuid]=e.target.title; 
        } 
    } 

    onDragStart(){
        this.sendToFront();
    } 

    onResizeStart(){
        this.sendToFront();
    } 

    onToggleWindow(){
        this.setState({maximized: !this.state.maximized});
    } 

    onToggleMinimize(){
        this.props.onToggleMinimize(this.state.uuid);
    } 

    onErrorFRAME(){
        this.setState({url: REST_URL+'/API/APPS/onErrorLoad.html'});
    } 

    render(){

        let WindowContent;
        
        if(this.state.url !== "MyComputer" && this.state.url !== "MyMusic" && this.state.url !== "MyPictures" && this.state.url !== "MyDocuments"){
            if(!isElectron()){  
                WindowContent=(<iframe title={window.winTitle[this.state.uuid]}  onLoad={this.onTitleChange} className="frame" onError={this.onErrorFRAME} src={this.state.url}> </iframe>);
            } else {  
                WindowContent=(<webview onLoad={this.onTitleChange} useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/70.0.3538.77 Chrome/70.0.3538.77 Safari/537.36" className="frame" onError={this.onErrorFRAME} src={this.state.url} plugins allowpopups></webview>);
            }
        }else{
            WindowContent=<FileManager userDirs={this.props.userDirs} className="frame"/>
        } 

        let finalStyle={};

        if(window.gradientEffect !== "on"){
            finalStyle={ backgroundColor: this.state.systemColor0 };
        }else{
            finalStyle={ background: 'linear-gradient('+this.state.systemColor1+', '+this.state.systemColor0,} 
        } 
        return(
            <div>
                <Rnd
                    default={{
                        x: 15,
                        y: 15,
                        width: 640,
                        height: 480
                    }}
                    minWidth="200"
                    minHeight="200"
                    cancel=".frame"
                    disableDragging={this.state.maximized}  
                    style={{ zIndex: this.state.currentZIndex }} 
                    size={{ width: ( this.state.maximized ? '100%' : this.state.width ),  height: ( this.state.maximized ? '100%' : this.state.height ) }}
                    position={{ x: ( this.state.maximized ? '0' : this.state.x ), y: ( this.state.maximized ? '0' : this.state.y ) }}
                    onDragStart={this.onDragStart} 
                    onResizeStart={this.onResizeStart} 
                    onDragStop={(e, d) => { 
                        if(!this.state.maximized){
                            this.setState({
                                x: d.x, y: d.y 
                            }
                        ) 
                    }}}
                    onResize={(e, direction, ref, delta, position) => {
                        if(!this.state.maximized){
                            this.setState({
                                width: ref.offsetWidth,
                                height: ref.offsetHeight,
                                ...position,
                            });
                        } 
                    }}
                >
                <div className={this.state.myStyle}  initwidth={800} initheight={400} style={finalStyle}>
                    <table onClick={this.sendToFront} onDoubleClick={this.onToggleWindow} className="titleBar" >
                        <tbody>
                            <tr>
                                <td className="appIcon"><img alt="" className="appIcon" src={this.props.icon}></img></td>
                                <td className="appTitle" style={{ color: invert(window.systemColor1, true)}}>{window.winTitle[this.state.uuid]}</td>
                                <td className="appControls">
                                    <img alt="" className="btnXControl" onClick={this.onClose}  src={CCLOSE} ></img>
                                    <img alt="" className="btnControl" onClick={this.onToggleWindow} src={( this.state.maximized ? CRESTORE : CMAXIMIZE )}></img>
                                    <img alt="" className="btnControl" onClick={this.onToggleMinimize} src={CMINIMIZE}></img>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="body">
                        {WindowContent}  
                        {this.state.active ? 
                            null
                        :(
                            <div onClick={this.sendToFront}  className="overlay"></div>
                        )}
                    </div>
                </div>
            </Rnd>
            </div>            
        );
    } 
} 


export default onClickOutside(Window);
