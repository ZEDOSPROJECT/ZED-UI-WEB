import React from 'react';
import questionIcon from './question.png';
import './question.css';

export default class Question extends React.Component {
    render(){
        if(this.props.visible){
            return(<div className="questionDialog">
                <img className="questionDialogMark"
                    alt=""
                    src={questionIcon}
                    draggable="false"
                />
                <div className="questionDialogLabel">
                    {this.props.label}
                </div>
                <div className="questionDialogBTNS">
                    <center>
                        <button onClick={this.props.onYes} className="questionDialogButton">
                            YES
                        </button>
                        <button onClick={this.props.onNo} className="questionDialogButton">
                            NO
                        </button>
                    </center>
                </div>
            </div>);
        }else{
            return null;
        }
    };
}