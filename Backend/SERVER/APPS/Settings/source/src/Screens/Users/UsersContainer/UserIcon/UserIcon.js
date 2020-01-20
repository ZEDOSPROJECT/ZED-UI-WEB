import React from 'react';
import UserPNG from './User.jpg';
import './UserIcon.css';

export default class UserIcon extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return(<div className="UserIcon">
            <center>
                <img className="UserPNG" src={UserPNG} />
                <div>{this.props.uName}</div>
            </center>
        </div>)
    }
}