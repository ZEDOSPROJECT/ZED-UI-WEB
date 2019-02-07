import React from 'react';
// ICONS
import myDocuments from '../../../Icons/ModernXP (16).png';
import myPictures from '../../../Icons/ModernXP (62).png';
import myMusic from '../../../Icons/ModernXP (38).png';
import myVideos from '../../../Icons/ModernXP (66).png';
import myComputer from '../../../Icons/ModernXP (10).png';
/////////////////////////////
import Combo from './Combo/combo';
import './leftBar.css';

class LeftBar extends React.Component {
    render(){
        return(<div className="leftBar">
            <Combo title="Tasks" open >Hello World</Combo>
            <Combo title="Other Places" open >
                <div className="link" onClick={data => this.props.listFolder("/")}><img alt="" src={myComputer} className="miniIcon"></img>My Computer</div>
                <div className="link" onClick={data => this.props.listFolder(this.props.userDirs["music"])}><img alt="" src={myMusic} className="miniIcon"></img>My Music</div>
                <div className="link" onClick={data => this.props.listFolder(this.props.userDirs["picture"])}><img alt="" src={myPictures} className="miniIcon"></img>My Picture</div>
                <div className="link" onClick={data => this.props.listFolder(this.props.userDirs["videos"])}><img alt="" src={myVideos} className="miniIcon"></img>My Videos</div>
                <div className="link" onClick={data => this.props.listFolder(this.props.userDirs["documents"])}><img alt="" src={myDocuments} className="miniIcon"></img>My Documents</div>
            </Combo>
            <Combo title="Details" >Hello World</Combo>
        </div>);
    } 
} 

export default LeftBar;