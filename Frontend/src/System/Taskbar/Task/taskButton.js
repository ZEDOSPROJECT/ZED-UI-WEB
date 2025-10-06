import React from 'react';
import VUGif from './vu.gif';
import invert from 'invert-color';
import { Portal } from 'react-portal';
import { ControlledMenu, MenuItem, useMenuState } from "@szhsin/react-menu";
import '@szhsin/react-menu/dist/index.css';
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
            <TaskButtonWithContextMenu 
                onToggleMinimize={this.props.onToggleMinimize}
                onClose={this.props.onClose}
                uuid={this.props.uuid}
                icon={this.props.icon}
                currentTitle={currentTitle}
                notifys={notifys}
                isPlaying={isPlaying}
                isTOP={isTOP}
                showPreview={this.state.showPreview}
                mouseOver={this.mouseOver}
                mouseLeave={this.mouseLeave}
            />
        );
    }
}

// Wrapper funcional para usar o hook useMenuState
function TaskButtonWithContextMenu(props) {
    const [menuState, toggleMenu] = useMenuState({ unmountOnClose: true });
    const [anchorPoint, setAnchorPoint] = React.useState({ x: 0, y: 0 });

    const handleContextMenu = (e) => {
        e.preventDefault();
        setAnchorPoint({ x: e.clientX, y: e.clientY });
        toggleMenu(true);
    };

    return (
        <div onMouseOver={props.mouseOver} onMouseLeave={props.mouseLeave}>
            {props.showPreview ? (
                <WindowPreview
                    onToggleMinimize={props.onToggleMinimize}
                    uuid={props.uuid}
                />
            ): null}
            <div 
                title={props.currentTitle} 
                onClick={(e) => {props.onToggleMinimize(props.uuid)}} 
                onContextMenu={handleContextMenu}
                style={{ 
                    color: invert(window.systemColor0, true), 
                    backgroundColor: (props.isTOP ? "rgba(0,0,0,0.2)" : "") 
                }} 
                className="taskButton"
            >
                {props.notifys !== null ? (
                    <div>
                        <div className="notifyAnimation"></div>
                    </div>
                ) : null}
                {props.isPlaying ? (<img draggable="false" alt="" className="taskSound" src={VUGif} />) : null}
                <img draggable="false" alt="" className="taskIcon" src={props.icon} />
                <div className="taskTitle">{props.currentTitle}</div>
                {props.notifys !== null ? (
                    <div>
                        <div className="notifys">{props.notifys}</div>
                    </div>
                ) : null}
            </div>
            
            <ControlledMenu 
                {...menuState} 
                anchorPoint={anchorPoint}
                onClose={() => toggleMenu(false)}
            >
                <MenuItem onClick={(e) => {props.onToggleMinimize(props.uuid); toggleMenu(false);}}>
                    Minimize
                </MenuItem>
                <MenuItem onClick={(e) => {props.onClose(props.uuid); toggleMenu(false);}}>
                    Close
                </MenuItem>
            </ControlledMenu>
        </div>
    );
}

export default TaskButton;