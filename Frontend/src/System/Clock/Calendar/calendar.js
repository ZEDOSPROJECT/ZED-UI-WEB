import React, { Component } from 'react';
import Calendar from 'react-calendar';
import onClickOutside from 'react-onclickoutside';
import './calendar.css';
 
class CalendarWindow extends Component {
  state = {
    date: new Date(),
  }
 
  onChange = date => this.setState({ date })
 
    handleClickOutside(){
        this.props.toggleCalendar();
    }

  render(){  
    return (
        (this.props.visible ? (
            <div>
                <Calendar
                    style={{ zIndex: this.props.maxZIndex+10 }}
                    className="Calendar"
                    onChange={this.onChange}
                    value={this.state.date}
                />
            </div>
        ) : null)
    );
  }
}

export default onClickOutside(CalendarWindow);
