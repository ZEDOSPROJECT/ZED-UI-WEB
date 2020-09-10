import React from 'react';
import invert from 'invert-color';
import './clock.css';
import CalendarWindow from './Calendar/calendar';

class Clock extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            time: new Date(),
            calendarVisible: false
        }
        this.switchCalendar = this.switchCalendar.bind(this);
    }

    componentDidMount() {
        setInterval(this.update, 5000);
    }

    componentWillUnmount() { // delete the interval just before component is removed
        clearInterval(this.update);
    }

    update = () => {
        this.setState({
            time: new Date()
        })
    };

    switchCalendar() {
        this.setState({
            calendarVisible: !this.state.calendarVisible
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps !== this.props || nextState !== this.state) {
            return true;
        }
    }

    render() {
        const { time } = this.state;
        return (
            <div className='Clock' style={{ color: invert(window.systemColor0, true) }}>
                <CalendarWindow
                    visible={this.state.calendarVisible}
                    toggleCalendar={this.switchCalendar}
                />
                <div onClick={this.switchCalendar} > {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        );
    }
}

export default Clock;
