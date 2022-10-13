import React from 'react';
import './NotificationItem.css';

export default class NotificationItem extends React.Component {
    render() {
        let typeData = "";
        if (this.props.Data.Type === 0) {
            typeData = "notificationInfo";
        }
        if (this.props.Data.Type === 1) {
            typeData = "notificationWarn";
        }
        if (this.props.Data.Type === 2) {
            typeData = "notificationError";
        }
        return (<div className={"NotificationItem " + typeData}>
            <img
                alt=""
                src={this.props.Data.AppIcon}
                width="32"
                style={{ margin: 10, float: "left" }}
            ></img><div className="NotificationTitle"><b>{this.props.Data.AppName}</b></div>
            <br></br>
            <div className="NotificationsMessage">
                {this.props.Data.Message}
            </div>
        </div >)
    }
}