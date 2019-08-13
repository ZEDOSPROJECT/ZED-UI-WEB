import React from "react";
import "./Tab.css";

class Tab extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      id: this.props.id
    }

    this.handleClick = this.handleClick.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  handleClick(){
    this.props.switchTab(this.props.id);
  }

  onClose() {
    this.props.closeTab(this.state.id);
  }

  render() {
    if(this.props.selected)
      return <div onClick={this.handleClick} className="TabSelected">{this.props.title}</div>;
    else
      return <div onClick={this.handleClick} className="Tab">
                {this.props.title}
                <div className="closeBTN" onClick={this.onClose}>X</div>
              </div>;
  }
}

export default Tab;
