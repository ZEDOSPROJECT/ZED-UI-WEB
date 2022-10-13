import React from 'react';
import NoNotifications from './noNotif.png';
import Notif from './Notif.png';
import NotificationArea from './NotificationArea/NotificationArea';

export default class NotificationIcon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
        this.onToggle = this.onToggle.bind(this);
        this.toggleNotificationArea = this.toggleNotificationArea.bind(this);
    }

    onToggle() {
        this.setState({
            visible: !this.state.visible
        })
    }

    toggleNotificationArea() {
        this.setState({
            visible: false
        })
    }

    render() {
        let Icon = undefined;
        if (sessionStorage.Notifications === undefined) {
            Icon = (<div>
                <img
                    alt=""
                    draggable=""
                    src={NoNotifications}
                    style={{ paddingTop: 5, width:17,height:"100%"}}
                ></img>
            </div>)
        } else {
            Icon = (<div>
                <img
                    alt=""
                    draggable=""
                    src={Notif}
                    onClick={this.onToggle}
                    style={{ paddingTop: 5, width:17,height:"100%"}}
                ></img>
            </div>)
        }
        return (<div>
            {Icon}
            {this.state.visible ? (
                <NotificationArea toggleNotificationArea={this.toggleNotificationArea} />
            ) : null}
        </div>);
    }
}