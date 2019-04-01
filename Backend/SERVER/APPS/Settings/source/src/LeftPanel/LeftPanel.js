import React from "react";
import PanelButton from "./PanelButton/PanelButton";
import "./LeftPanel.css";

class LeftPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: this.props.MenusTitles
    };
  }
  render() {
    const finalRender = this.props.MenusTitles.map((item, key) => {
      const id = key;
      return (
        <PanelButton
          active={id === this.props.CurrentSettingID ? true : false}
          switchSetting={this.props.switchSetting}
          style={{ "background-color": "red" }}
          buttonKey={id}
          title={item}
        />
      );
    });
    return <div className="LeftPanel">{finalRender}</div>;
  }
}

export default LeftPanel;
