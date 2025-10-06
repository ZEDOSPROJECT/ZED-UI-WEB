import React from 'react';
import ReactDOM from 'react-dom';
import './WindowPreview.css';

export default class WindowPreview extends React.Component {
    constructor(props){
        super(props);
        this.previewRef = React.createRef();
        this.convertHex = this.convertHex.bind(this);
        this.state = {
            position: { left: 0 }
        };
    }

    componentDidMount() {
        this.updatePosition();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.buttonRef !== this.props.buttonRef) {
            this.updatePosition();
        }
    }

    updatePosition() {
        // Calculate position based on the task button
        if (this.props.buttonRef && this.props.buttonRef.current) {
            const buttonRect = this.props.buttonRef.current.getBoundingClientRect();
            const previewWidth = 158; // Width from CSS
            const left = buttonRect.left + (buttonRect.width / 2) - (previewWidth / 2);
            
            this.setState({
                position: { left: Math.max(5, left) } // Keep at least 5px from left edge
            });
        }
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
        const previewImage = sessionStorage["w_WINDOW_"+this.props.uuid];
        
        // Don't render if no preview image exists
        if (!previewImage) {
            return null;
        }

        const previewContent = (
            <div
                ref={this.previewRef}
                style={{ 
                    zIndex: 99999,
                    backgroundColor: this.convertHex(window.systemColor0 || '#0078d4', 90),
                    left: this.state.position.left + 'px'
                }}
                className="WindowPreview"
                onClick={(e) => {
                    e.stopPropagation();
                    this.props.onToggleMinimize(this.props.uuid);
                }}
            >
                <img
                    alt="Window preview"
                    className="WindowPVW"
                    src={previewImage}
                />
            </div>
        );

        // Use Portal to render outside of parent container
        return ReactDOM.createPortal(previewContent, document.body);
    }
}