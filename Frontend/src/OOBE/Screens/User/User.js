import React from 'react';
import './User.css';

export default class User extends React.Component {
    render(){
        return(<div>
            <h1>About you</h1>
            <p>You wil now create your user account</p>

            <table style={{width: 390}}>
                <tbody>
                    <tr>
                    <td style={{width: 355}}>Your Username:</td>
                    <td style={{width: 300}}><input defaultValue={window.u} autoFocus onChange={this.props.onUsername} /></td>
                    </tr>
                    <tr>
                    <td style={{width: 355}}>Your Password:</td>
                    <td style={{width: 300}}><input defaultValue={window.r} onChange={this.props.onPass} type="password" /></td>
                    </tr>
                    <tr>
                    <td style={{width: 355}}>Repeat Password:</td>
                    <td style={{width: 300}}><input defaultValue={window.rp} onChange={this.props.onPassRep} type="password" /></td>
                    </tr>
                </tbody>
            </table>
        </div>)
    }
}