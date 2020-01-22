import React from 'react';
import UserPNG from './User.jpg';
import './UserIcon.css';

export default class UserIcon extends React.Component {
    render(){
        return(<div
                className={this.props.selected ? 'UserIconSELECTED' : 'UserIcon'}
                onClick={ e => this.props.OnSelected(this.props.uName)}
            >
            <center>
                <img className="UserPNG" src={UserPNG} alt=""/>
                <div>{this.props.uName}</div>
            </center>
        </div>)
    }
}