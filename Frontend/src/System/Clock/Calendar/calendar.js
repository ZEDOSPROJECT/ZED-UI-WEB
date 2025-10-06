import React from 'react';
import ReactDOM from 'react-dom';
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
    if (!this.props.visible) return null;
    
    return ReactDOM.createPortal(
      <div className="CalendarWrapper">
        <Calendar
          className="Calendar"
          onChange={this.onChange}
          value={this.state.date}
        />
      </div>,
      document.body
    );
  }
}

export default onClickOutside(CalendarWindow);
