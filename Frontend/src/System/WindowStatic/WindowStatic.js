import React from 'react';
import './WindowStatic.css';

export default class WindowStatic extends React.Component {
    render() {
        return (<div className="WindowStaticBG">
            <div className="WindowStaticModal"
                style={{ width: this.props.width, height: this.props.height, marginTop: -(this.props.height / 2), marginLeft: -(this.props.width / 2) }}>
                <div className="WindowStaticModalTitle">{this.props.title}</div>
                <div className="WindowStaticModalContainer">{this.props.children}</div>
            </div>
        </div>)
    }
}