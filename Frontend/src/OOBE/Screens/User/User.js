import React from 'react';
import './User.css';

export default class User extends React.Component {
    render(){
        return(<div>
            <h1>About you</h1>
            <p>Your Username: <input onChange={this.props.onUsername} /></p>
            <p>Your Password: <input onChange={this.props.onPass} type="password" /></p>
            <p>Repeat Password: <input onChange={this.props.onPassRep} type="password" /></p>
        </div>)
    }
}