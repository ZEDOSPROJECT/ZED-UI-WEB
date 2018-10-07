import React from 'react';
import isElectron from 'is-electron';
import Controls from './Controls/controls'; 
import { Rnd } from "react-rnd";
import './window.css';

class Window extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
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
                    <div onClick={this.sendToFront} >
                        <img alt="" src={this.props.icon} className="icon" width="16" height="16" ></img>
                        <div className="title">
                            {this.props.title}
                        </div>
                        <Controls
                            onClose={this.onClose} 
                            onToggleWindow={this.onToggleWindow} 
                            onToggleMinimize={this.onToggleMinimize} 
                        />
                    </div>
                    <div className="body">
                    {!isElectron() ? (
                        <iframe className="frame" src={this.props.url} />
                     ):(
                        <webview className="frame" src={this.props.url} plugins></webview>
                    )}
                    </div>
                </div>
            </Rnd>
            </div>
            
        );
    } 
} 

export default Window;