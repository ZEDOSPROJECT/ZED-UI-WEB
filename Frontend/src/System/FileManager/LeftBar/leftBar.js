import React from 'react';
// ICONS
import myDocuments from '../../../Icons/ModernXP (16).png';
import myPictures from '../../../Icons/ModernXP (62).png';
import myMusic from '../../../Icons/ModernXP (38).png';
import myVideos from '../../../Icons/ModernXP (66).png';
import myComputer from '../../../Icons/ModernXP (10).png';
import createFolder from '../../../Icons/ModernXP (35).png';
import find from '../../../Icons/ModernXP (20).png';
import copy from '../../../Icons/243.ico';
import paste from '../../../Icons/256.ico';
import remove from '../../../Icons/240.ico';
import rename from '../../../Icons/242.ico';
/////////////////////////////
import Combo from './Combo/combo';
import './leftBar.css';

class LeftBar extends React.Component {
    render(){
        return(<div className="leftBar">
            <Combo title="Tasks" open >
                <div className="link" onClick={this.props.onCreateFolderOpen}><img alt="" src={createFolder} className="miniIcon"></img>New folder</div>
                <div className="link"><img alt="" src={find} className="miniIcon"></img>Find files and folders</div>
                {window.clipBoard !== "" ? (<div className="link" onClick={this.props.onPaste}><img draggable="false" alt="" src={paste} className="miniIcon"></img>Paste</div>) : null}
                {this.props.details ? (
                    <div>
                        <div className="link" onClick={this.props.onRenameOpen}><img draggable="false" alt="" src={rename} className="miniIcon"></img>Rename</div>
                        <div className="link" onClick={this.props.onCopy}><img draggable="false" alt="" src={copy} className="miniIcon"></img>Copy</div>
                        <div className="link" onClick={this.props.onRemoveOpen}><img draggable="false" alt="" src={remove} className="miniIcon"></img>Remove</div>
                    </div>
                ) : null }
            </Combo>
            <Combo title="Other Places" open >
                <div className="link" onClick={data => this.props.listFolder("My Computer")}><img draggable="false" alt="" src={myComputer} className="miniIcon"></img>My Computer</div>
                <div className="link" onClick={data => this.props.listFolder(this.props.userDirs["music"])}><img draggable="false" alt="" src={myMusic} className="miniIcon"></img>My Music</div>
                <div className="link" onClick={data => this.props.listFolder(this.props.userDirs["picture"])}><img draggable="false" alt="" src={myPictures} className="miniIcon"></img>My Picture</div>
                <div className="link" onClick={data => this.props.listFolder(this.props.userDirs["videos"])}><img draggable="false" alt="" src={myVideos} className="miniIcon"></img>My Videos</div>
                <div className="link" onClick={data => this.props.listFolder(this.props.userDirs["documents"])}><img draggable="false" alt="" src={myDocuments} className="miniIcon"></img>My Documents</div>
            </Combo>
            {this.props.details ? (
                <Combo title="Details" open>{this.props.details}</Combo>
            ) : null }
        </div>);
    } 
} 

export default LeftBar;