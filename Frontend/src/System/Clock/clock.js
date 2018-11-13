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
        setInterval(this.update, 1000)       
    }

    update = () => { 
        this.setState({
            time: new Date()
        })   
    };

    switchCalendar(){
        this.setState({
            calendarVisible: !this.state.calendarVisible
        })  
    } 

    render(){
		const h = this.state.time.getHours()
        const mn = this.state.time.getMinutes()
        return(
            <div className='Clock' style={{ color: invert(window.systemColor, true)}}>
                <CalendarWindow 
                    visible={this.state.calendarVisible}
                    toggleCalendar={this.switchCalendar} 
                />
                <div onClick={this.switchCalendar} >{h % 12}:{(mn < 10 ? '0' + mn : mn)}</div>
            </div>
        );
    }
}

export default Clock;
