import React from 'react';
import isElectron from 'is-electron';
import { Rnd } from "react-rnd";
import CCLOSE from './CLOSE.png';
import CMAXIMIZE from './MAXIMIZE.png';
import CRESTORE from './RESTORE.png';
import CMINIMIZE from './MINIMIZE.png';
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
            currentZIndex: this.props.maxZIndex,
            maximized: false,
            x: 15,
            y: 15,
            width: 640,
            height: 480
        };

        this.openModal = this.openModal.bind(this);
        this.onClose = this.onClose.bind(this);
        this.sendToFront = this.sendToFront.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onResizeStart = this.onResizeStart.bind(this);
        this.onToggleWindow = this.onToggleWindow.bind(this);
        this.onToggleMinimize = this.onToggleMinimize.bind(this);
        this.onErrorFRAME = this.onErrorFRAME.bind(this);
    }

    sendToFront() {
        let newIndex=this.state.currentZIndex;
        while (this.props.sendToFront(newIndex)) {
            newIndex++;
        }
        this.setState({ currentZIndex: newIndex+1 });
    } 

    openModal() {
        this.setState({modalIsOpen: true});
    }
    onClose() {
        this.props.onClose(this.state.uuid);
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
                <div className="window" initWidth={800} initHeight={400} onRequestClose={this.closeModal}>
                    <table onClick={this.sendToFront} class="titleBar" style={{ backgroundColor: this.props.systemColor }} >
                        <tr>
                            <td class="appIcon"><img class="appIcon" src={this.props.icon}></img></td>
                            <td class="appTitle">{this.props.title}</td>
                            <td class="appControls">
                                <img class="btnXControl" onClick={this.onClose}  src={CCLOSE} ></img>
                                <img class="btnControl" onClick={this.onToggleWindow} src={( this.state.maximized ? CRESTORE : CMAXIMIZE )}></img>
                                <img class="btnControl" onClick={this.onToggleMinimize} src={CMINIMIZE}></img>
                            </td>
                        </tr>
                    </table>
                    <div className="body">
                    {!isElectron() ? (
                        <iframe className="frame" onError={this.onErrorFRAME} src={this.state.url} />
                     ):(
                        <webview className="frame" onError={this.onErrorFRAME} src={this.state.url} plugins></webview>
                    )}
                    </div>
                </div>
            </Rnd>
            </div>
            
        );
    } 
} 

export default Window;