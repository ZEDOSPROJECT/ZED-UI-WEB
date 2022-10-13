import React from 'react';
import onClickOutside from 'react-onclickoutside';
import NotificationItem from './NotificationItem/NotificationItem';
import './NotificationArea.css';

class NotificationArea extends React.Component {
    constructor(props) {
        super(props);
        this.convertHex = this.convertHex.bind(this);
        this.clearNotifications = this.clearNotifications.bind(this);
    }

    clearNotifications() {
        sessionStorage.removeItem("Notifications");
        this.handleClickOutside();
    }

    convertHex(hex, opacity) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        const result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
        return result;
    }

    handleClickOutside() {
        this.props.toggleNotificationArea();
    }

    render() {
        let Notifs;
        let RenderNotifys;
        if (sessionStorage.Notifications !== undefined) {
            Notifs = JSON.parse(sessionStorage.Notifications);
            RenderNotifys = Notifs.map(function (element) {
                return (<NotificationItem
                    Data={element}
                />);
            });
        }
        return (<div
            className="NotificationArea"
            style={{ backgroundColor: this.convertHex(window.systemColor0, 90) }}
        >
            <p className="clearNotifs" onClick={this.clearNotifications}>Clear Notifications</p>
            <div className="RenderNotifys">
                {RenderNotifys}
            </div>
        </div >)
    }
}

export default onClickOutside(NotificationArea)