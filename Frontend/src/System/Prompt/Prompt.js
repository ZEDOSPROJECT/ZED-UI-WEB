import React, { Component } from 'react';
import './Prompt.css';

export default class NewFolderDialog extends Component {
    constructor(props){
        super(props);

        this.state = {
            newPrompt: this.props.placeholder,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleChange(e){
        this.setState({
            newFolder: e.target.value
        });
    }

    handleKeyDown(e){
        if(e.key === "Escape"){
            this.props.onESQ();
            this.setState({
                newPrompt: this.props.placeholder,
            });
        }
        if(e.key === "Enter"){
            let newPrompt=this.state.newPrompt.slice();
            this.props.onENTER(newPrompt);
            this.setState({
                newPrompt: this.props.placeholder,
            });
        }
    }

    render() {
        if(this.props.visible){
            return (
                <div onClick={this.props.onESQ} className="promptDialog">
                    <div className="promptDialogModal">
                        {this.props.label}
                        <input 
                            className="promptDialogInput"
                            type="text"
                            autoFocus
                            value={this.state.newPrompt}
                            onChange={this.handleChange}
                            onKeyDown={this.handleKeyDown}
                        />
                    </div>
                </div>
            ) 
        }else{
            return null;
        }
    }
}
