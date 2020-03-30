import React from 'react';
import './Buttons.css';

export default class Buttons extends React.Component {
    render(){
        return(<div className="Buttons" onClick={this.props.OnClick}>
                <img alt="" className="ButtonsImg" src={this.props.Bimg}>
                </img>
                <div className="ButtonsLabel">
                    {this.props.title}
                </div>  
                <img alt="" className="ButtonsImg" src={this.props.Nimg}>
                </img>
            </div>)
    }
}