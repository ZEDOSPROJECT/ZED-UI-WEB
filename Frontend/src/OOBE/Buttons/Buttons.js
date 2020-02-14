import React from 'react';
import './Buttons.css';

export default class Buttons extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(<div className="Buttons" onClick={this.props.OnClick}>
                <div className="ButtonsLabel">
                    {this.props.title}
                </div>  
            </div>)
    }
}