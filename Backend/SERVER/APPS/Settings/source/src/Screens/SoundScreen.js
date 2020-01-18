import React from 'react';

export default class SoundScreen extends React.Component {
    render(){
        return(
            <div>
                <h2>Display:</h2>
                <select name="resolution" onChange={this.props.onChangeDisplayResolution}>
                    <option value="Auto">Disabled</option>
                </select>
            </div>
        )
    }
}