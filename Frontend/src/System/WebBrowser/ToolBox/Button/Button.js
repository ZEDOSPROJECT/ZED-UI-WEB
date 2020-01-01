import React from "react";
import "./Button.css";

class ReactButton extends React.Component {
  constructor(props){
    super(props);

    this.handleClick=this.handleClick.bind(this);

  }

  handleClick(){
    if(this.props.DISABLED !== true){
      this.props.onClick();
    }
  }

  render() {
    return (
      <div onClick={this.handleClick} className="ReactButton">
        <img draggable="false" style={{ filter: ( this.props.DISABLED == true ? ("grayscale(100%)"):("grayscale(0%)")) }} src={this.props.icon} width="25" alt="" />
      </div>
    );
  }
}

export default ReactButton;
