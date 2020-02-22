import React from 'react';
import './Buttons.css';

export default class Buttons extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(<div className="Buttons" onClick={this.props.OnClick}>
                <img className="ButtonsImg" src={this.props.Bimg}>
                </img>
                <div className="ButtonsLabel">
                    {this.props.title}
                </div>  
                <img className="ButtonsImg" src={this.props.Nimg}>
                </img>
            </div>)
    }
}