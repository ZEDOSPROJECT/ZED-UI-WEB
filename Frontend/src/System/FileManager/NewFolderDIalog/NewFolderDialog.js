import React, { Component } from 'react';
import './NewFolderDialog.css';

export default class NewFolderDialog extends Component {
    constructor(props){
        super(props);

        this.state = {
            newFolder: 'New Folder',
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
                newFolder: 'New Folder'
            });
        }
        if(e.key === "Enter"){
            let newFolderName=this.state.newFolder.slice();
            this.props.onENTER(newFolderName);
            this.setState({
                newFolder: 'New Folder'
            });
        }
    }

    render() {
        if(this.props.visible){
            return (
                <div onClick={this.props.onESQ} className="NewFolderDialog">
                    <div className="NewFolderDialogModal">
                        Name of new folder: 
                        <input 
                            className="NewFolderDialogInput"
                            type="text"
                            autoFocus
                            value={this.state.newFolder}
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
