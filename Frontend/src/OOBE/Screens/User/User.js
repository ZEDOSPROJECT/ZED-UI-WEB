import React from 'react';
import './User.css';

export default class User extends React.Component {
    render(){
        return(<div>
            <h1>About you</h1>
            <p>You wil now create your user account</p>
            <p>Your Username: <input defaultValue={window.u} autoFocus onChange={this.props.onUsername} /></p>
            <p>Your Password: <input defaultValue={window.r} onChange={this.props.onPass} type="password" /></p>
            <p>Repeat Password: <input defaultValue={window.rp} onChange={this.props.onPassRep} type="password" /></p>
        </div>)
    }
}