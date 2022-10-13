import React from 'react';
import { REST_URL } from '../../../REST_URL';
import WindowStatic from '../../WindowStatic/WindowStatic';
import './FileProprieties.css';

export default class FileProprieties extends React.Component {
    constructor(props) {
        super(props);

        fetch(REST_URL + '/API/SYSTEM/IO/FILE/getFileProprieties.php?path=' + this.props.file)
            .then(response => response.json())
            .then(json => {
                this.setState({
                    fileName: json.fileName,
                    fileSize: json.fileSize,
                    fileMIMEType: json.fileMIMEType,
                    fileOwner: json.fileOwner,
                    filePath: json.filePath,
                    fileExtension: json.fileExtension,
                    fileLastDate: json.fileLastDate
                })
            });


        this.state = {
            fileName: undefined,
            fileSize: undefined,
            fileMIMEType: undefined,
            fileOwner: undefined,
            filePath: undefined,
            fileExtension: undefined,
            fileLastDate: undefined
        }
    }


    render() {
        return (<WindowStatic
            title={this.state.fileName + " Proprieties"}
            width={350}
            height={400}>
            <div>
                <div><b>Name:</b> {this.state.fileName}</div>
                <div><b>Size:</b> {this.state.fileSize}</div>
                <div><b>Type:</b> {this.state.fileMIMEType}</div>
                <div><b>Owner:</b> {this.state.fileOwner}</div>
                <div><b>Full path:</b> {this.props.file}</div>
                <div><b>Extension:</b> {this.state.fileExtension}</div>
                <div><b>Last modification:</b> {this.state.fileLastDate}</div>
                <br></br>

                <button className="FileProprietiesButton" onClick={this.props.onShowProprieties}>OK</button>
            </div>
        </WindowStatic>)
    }
}