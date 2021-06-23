import React, { Component } from 'react';
import Calendar from 'react-calendar';
import onClickOutside from 'react-onclickoutside';
import './calendar.css';
 
class CalendarWindow extends React.PureComponent {
  state = {
    date: new Date(),
    
  }
 
  onChange = date => this.setState({ date })
 
    handleClickOutside(){
        this.props.toggleCalendar();
    }

    shouldComponentUpdate(nextProps, nextState) {
      return true;
    }

  render(){  
    return (
        (this.props.visible ? (
            <div>
                <Calendar
                    style={{ zIndex: window.maxZIndex+10 }}
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
