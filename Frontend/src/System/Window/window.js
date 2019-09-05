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
import WebBrowser from '../WebBrowser/WebBrowser';
import { REST_URL } from '../../REST_URL';
import './window.css';

class Window extends React.Component{
    constructor(props) {
        super(props);

        let windowSize=this.props.windowSize;
        let positionX=this.props.nextWindowX;
        let positionY=this.props.nextWindowY;

        let winName="";
        if(this.props.url === "MyComputer" || this.props.url === "MyMusic" || this.props.url === "MyPictures" || this.props.url === "MyDocuments"){
            winName=this.props.url;
        }else{
            winName=window.winTitle[this.props.uuid];
        }

        // If WindowSize in width and Height is equal ZERO has no manifest file
        if(windowSize.Width === 0 && windowSize.Height === 0){
            if(localStorage["WINDOW_"+winName+"_X"]){
                positionX=localStorage["WINDOW_"+winName+"_X"];
                positionY=localStorage["WINDOW_"+winName+"_Y"];
                windowSize.Width=localStorage["WINDOW_"+winName+"_W"];
                windowSize.Height=localStorage["WINDOW_"+winName+"_H"];
            }else{
                windowSize.Width=640;
                windowSize.Height=480;
            }
        }

        this.state = {
            url: this.props.url,
            modalIsOpen: true,
            draggable: false,
            uuid: this.props.uuid,
            currentZIndex: window.maxZIndex,
            maximized: false,
            x: positionX,
            y: positionY,
            width: windowSize.Width,
            height: windowSize.Height,
            active: true,
            systemColor0: window.systemColor0,
            systemColor1: window.systemColor1,
            gradient: 'on',
            myStyle: "window hidden"
        };
        setTimeout(() => {
            this.setState({myStyle: "window shadow"});
        }, 40);

        this.convertHex = this.convertHex.bind(this);
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
        this.onTitleChange = this.onTitleChange.bind(this);
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
            if(window.gradientEffect){
                if(this.state.systemColor1 !== window.systemColor1){
                    this.setState({ systemColor1: window.systemColor1 });
                } 
            }
        },800);
    }

    convertHex(hex,opacity){
        hex = hex.replace('#','');
        const r = parseInt(hex.substring(0,2), 16);
        const g = parseInt(hex.substring(2,4), 16);
        const b = parseInt(hex.substring(4,6), 16);
    
        const result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
        return result;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps !== this.props || nextState !== this.state ){
            return true;
        }
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
        let winName="";
        if(this.state.url === "MyComputer" || this.state.url === "MyMusic" || this.state.url === "MyPictures" || this.state.url === "MyDocuments"){
            winName=this.state.url;
        }else{
            winName=window.winTitle[this.state.uuid];
        }
        localStorage["WINDOW_"+winName+"_X"]=this.state.x;
        localStorage["WINDOW_"+winName+"_Y"]=this.state.y;
        localStorage["WINDOW_"+winName+"_W"]=this.state.width;
        localStorage["WINDOW_"+winName+"_H"]=this.state.height;
        let id=-1;
        let i=0
        window.soundsEmitter.forEach(element => {
            if(element === this.state.uuid)
                id=i;
            i++;
        });
        if(id>=0)
            window.soundsEmitter=window.soundsEmitter.splice(id, 1);
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
        let tmpStyle="window";
        if(this.state.maximized){
            tmpStyle="window shadow";
        }
        this.setState({
            maximized: !this.state.maximized,
            myStyle: tmpStyle
        });
    } 

    onToggleMinimize(){
        this.props.onToggleMinimize(this.state.uuid);
    } 

    onErrorFRAME(){
        this.setState({url: REST_URL+'/API/APPS/onErrorLoad.html'});
    } 

    onTitleChange(newTitle){
        window.winTitle[this.state.uuid]=newTitle;
        this.forceUpdate();
    }

    componentDidMount(){
        if(this.webview){
            this.webview.addEventListener('media-started-playing',() => {
                let found=false;
                window.soundsEmitter.forEach(element => {
                    if(element === this.state.uuid)
                        found=true;
                });
                if(!found)
                    window.soundsEmitter.push(this.state.uuid);
            });
            this.webview.addEventListener('page-title-updated', (e) => {
                this.onTitleChange(e.title);
                this.forceUpdate();
            });

            this.webview.addEventListener('console-message', (e) => {
                if(e.level===0){
                    this.props.onInfo(e.message);
                }
                if(e.level===1){
                    this.props.onWarn(e.message);
                }
                if(e.level===2){
                    this.props.onError(e.message);
                }
            });

            this.webview.addEventListener('media-paused', () => {
                let id=-1;
                let i=0
                window.soundsEmitter.forEach(element => {
                    if(element === this.state.uuid)
                       id=i;
                    i++;
                });
                if(id !== -1){
                    window.soundsEmitter.splice(id, 1);
                }
            });

            this.webview.addEventListener('crashed', (e) => {
                this.setState({url: REST_URL+'/API/APPS/onErrorLoad.html'});
                this.forceUpdate();
            });

            this.webview.addEventListener('plugin-crashed', (e) => {
                this.setState({url: REST_URL+'/API/APPS/onErrorLoad.html'});
                this.forceUpdate();
            });

            this.webview.addEventListener('did-fail-load', (e) => {
                this.setState({url: REST_URL+'/API/APPS/onErrorLoad.html'});
                this.forceUpdate();
            });
        }
    }

    render(){
        let WindowContent;
        if(this.state.url !== "Web Browser" && this.state.url !== "MyComputer" && this.state.url !== "MyMusic" && this.state.url !== "MyPictures" && this.state.url !== "MyDocuments"){
            if(!isElectron()){  
                WindowContent=(<iframe title={window.winTitle[this.state.uuid]}  onLoad={this.onTitleChange} className="frame dontMove" onError={this.onErrorFRAME} src={this.state.url}> </iframe>);
            } else {  
                WindowContent=(<webview ref={(input) => { this.webview = input; }} onLoad={this.onTitleChange} useragent="Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.120 Safari/537.36" className="frame dontMove" onError={this.onErrorFRAME} src={this.state.url} plugins="true" allowpopups="true"></webview>);
            }
        }else{
            if(this.state.url !== "Web Browser"){
                WindowContent=<FileManager onTitleChange={this.onTitleChange} userDirs={this.props.userDirs} className="frame dontMove"/>
            }else{
                WindowContent=<WebBrowser onTitleChange={this.onTitleChange} className="frame dontMove"/>
            }
        } 

        let finalStyle={};
        let finalBodyStyle="body";
        if(this.state.maximized){
            finalBodyStyle="body maximizedBody";
        }
        if(!window.gradientEffect){
            finalStyle={ backgroundColor: this.convertHex(this.state.systemColor0,80) };
        }else{
            finalStyle={ background: 'linear-gradient('+this.convertHex(this.state.systemColor1,80)+', '+this.convertHex(this.state.systemColor0,80)} 
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
                    cancel=".dontMove"
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
                    <div onClick={this.sendToFront} onDoubleClick={this.onToggleWindow} className="titleBar" >
                        <div style={{ maxHeight: 20,width: 20 }} className="appIcon"><img draggable="false" alt="" className="appIcon" src={this.props.icon}></img></div>
                        <div className="appTitle" style={{ color: invert(window.systemColor1, true)}}>{window.winTitle[this.state.uuid]}</div>
                        <div style={{ width: 150 }} className="appControls">
                            <img draggable="false" alt="" className="btnXControl dontMove" onClick={this.onClose}  src={CCLOSE} ></img>
                            <img draggable="false" alt="" className="btnControl dontMove" onClick={this.onToggleWindow} src={( this.state.maximized ? CRESTORE : CMAXIMIZE )}></img>
                            <img draggable="false" alt="" className="btnControl dontMove" onClick={this.onToggleMinimize} src={CMINIMIZE}></img>
                        </div>
                    </div>
                    <div onMouseDown={e => e.stopPropagation()} className={finalBodyStyle}>
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
