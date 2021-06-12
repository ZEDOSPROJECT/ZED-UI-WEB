import React from 'react';
import './WindowPreview.css';

export default class WindowPreview extends React.Component {
    constructor(props){
        super(props);
        this.convertHex = this.convertHex.bind(this);
    }

    convertHex(hex, opacity) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        const result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
        return result;
    }

    render(){
        return(<div
                style={{ zIndex: window.maxZIndex,backgroundColor: this.convertHex(window.systemColor0, 90) }}
                className="WindowPreview"
                onClick={e => this.props.onToggleMinimize(this.props.uuid)}
                >
            <img
                alt=""
                className="WindowPVW"
                src={sessionStorage["w_WINDOW_"+this.props.uuid]}
            />
        </div>);
    }
}