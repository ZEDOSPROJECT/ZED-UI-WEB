import React from 'react';
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
        };

        this.openModal = this.openModal.bind(this);
        this.onClose = this.onClose.bind(this);
        this.sendToFront = this.sendToFront.bind(this);
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
    
    render(){
        return(
            <Rnd
                default={{
                    x: 15,
                    y: 15,
                    width: 640,
                    height: 480
                }}
                style={{ zIndex: this.state.currentZIndex }} 
            >
                <div className="window" initWidth={800} initHeight={400} onRequestClose={this.closeModal}>
                    <div onClick={this.sendToFront} >
                        <img alt="" src={this.props.icon} className="icon" width="16" height="16" ></img>
                        <div className="title">
                            {this.props.title}
                        </div>
                        <Controls
                            onClose={this.onClose} 
                        />
                    </div>
                    <div className="body">
                        <iframe className="frame" src={this.props.url} >

                        </iframe>
                    </div>
                </div>
            </Rnd>
        );
    } 
} 

export default Window;