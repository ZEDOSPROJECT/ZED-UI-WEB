import React from 'react';
import VUGif from './vu.gif';
import invert from 'invert-color';
import { Portal } from 'react-portal';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import './taskButton.css';
import WindowPreview from './WindowPreview/WindowPreview';

class TaskButton extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            showPreview: false
        };

        this.handle=undefined;

        setInterval(() => {
            this.forceUpdate();
        }, 800);

        this.mouseOver = this.mouseOver.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
    }

    mouseOver() {
        this.handle = setTimeout(() => {
            clearTimeout(this.handle);
            this.handle = undefined;
            this.setState({
                showPreview: true
            })
        }, 1000);
    }

    mouseLeave() {
        // if (this.handle) {
            clearTimeout(this.handle);
            this.handle = undefined;
            this.setState({
                showPreview: false
            })
        // }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps !== this.props || nextState !== this.state) {
            return true;
        }
    }

    render() {
        let isPlaying = false;
        let isTOP = true;
        let currentTitle = window.winTitle[this.props.uuid];
        let notifys = null;
        if (window.topUUID !== this.props.uuid) {
            isTOP = false;
        }

        if (!isTOP && currentTitle && typeof currentTitle === 'string') {
            if (currentTitle.indexOf("(") !== -1 && currentTitle.indexOf(")") !== -1) {
                try {
                    notifys = Number(currentTitle.split('(').pop().split(')')[0]).toString();
                    if (notifys === "NaN") {
                        notifys = null;
                    } else {
                        if (Number(notifys) > 9) {
                            notifys = "9+";
                        }
                    }
                } catch (e) { }
            }
        }

        if (window.soundsEmitter.indexOf(this.props.uuid) !== -1) {
            isPlaying = true;
        }
        return (
            <div onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave}>
                {this.state.showPreview ? (
                    <WindowPreview
                        onToggleMinimize={this.props.onToggleMinimize}
                        uuid={this.props.uuid}
                    />
                ): null}
                <ContextMenuTrigger id={"taskbar.task_" + this.props.uuid}>
                    <div title={currentTitle} onClick={(e) => {this.props.onToggleMinimize(this.props.uuid)}} style={{ color: invert(window.systemColor0, true), backgroundColor: (isTOP ? "rgba(0,0,0,0.2)" : "") }} className="taskButton">
                        {notifys !== null ? (
                            <div>
                                <div className="notifyAnimation"></div>
                            </div>
                        ) : null}
                        {isPlaying ? (<img draggable="false" alt="" className="taskSound" src={VUGif} />) : null}
                        <img draggable="false" alt="" className="taskIcon" src={this.props.icon} />
                        <div className="taskTitle">{currentTitle}</div>
                        {notifys !== null ? (
                            <div>
                                <div className="notifys">{notifys}</div>
                            </div>
                        ) : null}
                    </div>
                </ContextMenuTrigger>
                <Portal>
                    <ContextMenu id={"taskbar.task_" + this.props.uuid}>
                        <MenuItem onClick={(e) => {this.props.onToggleMinimize(this.props.uuid)}}>
                            Minimize
                        </MenuItem>
                        <MenuItem onClick={(e) => {this.props.onClose(this.props.uuid)}}>
                            Close
                        </MenuItem>
                    </ContextMenu>
                </Portal>
            </div>
        );
    }
}

export default TaskButton;