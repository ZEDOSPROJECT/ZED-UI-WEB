import React from "react";
import "./combo.css";

class Combo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open
    };
    this.switchCombo = this.switchCombo.bind(this);
  }

  switchCombo() {
    this.setState({ open: !this.state.open });
  }

  render() {
    return (
      <div className="comboContainer">
        <div className="comboTitle" onClick={this.switchCombo}>
          <div>{this.props.title}</div>
          <div className="comboSwitch" />
        </div>
        {this.state.open ? (
          <div className="innerCombo">{this.props.children}</div>
        ) : null}
      </div>
    );
  }
}

export default Combo;
