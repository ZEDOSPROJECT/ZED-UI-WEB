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
        this.closeModal = this.closeModal.bind(this);
        this.sendToFront = this.sendToFront.bind(this);
    }

    sendToFront() {
        this.props.sendToFront(this.state.uuid);
        this.setState({ currentZIndex: this.props.maxZIndex })
    } 

    openModal() {
        this.setState({modalIsOpen: true});
    }
    closeModal() {
        this.setState({modalIsOpen: false});
    }

    render(){
        return(
            <Rnd
                default={{
                    x: 0,
                    y: 0,
                    width: 320,
                    height: 200
                }}
                style={{ zIndex: 12 }} 
            >
                <div className="window" initWidth={800} initHeight={400} onRequestClose={this.closeModal}>
                    <div onClick={this.sendToFront} >
                        <img alt="" src={this.props.icon} className="icon" width="16" height="16" ></img>
                        <div className="title">
                            {this.props.title}
                        </div>
                        <Controls
                            onClose={this.closeModal} 
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