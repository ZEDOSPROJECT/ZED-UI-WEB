import React from "react";
import "./Tab.css";

class Tab extends React.Component {
  constructor(props){
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    this.props.switchTab(this.props.id);
  }

  render() {
    if(this.props.selected)
      return <div onClick={this.handleClick} className="TabSelected">{this.props.title}</div>;
    else
      return <div onClick={this.handleClick} className="Tab">{this.props.title}</div>;
  }
}

export default Tab;
