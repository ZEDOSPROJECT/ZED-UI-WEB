import React from "react";
import ReactButton from "./Button/Button";
import png_Back from "./Icons/back.png";
import png_Forward from "./Icons/forward.png";
import png_Refresh from "./Icons/refresh.png";
import "./ToolBox.css";

class ToolBox extends React.Component {
  render() {
    return (
      <table className="ToolBox">
        <tbody>
          <tr>
            <td style={{ width: 90 }}>
              <ReactButton icon={png_Back} />
              <ReactButton icon={png_Forward} />
              <ReactButton icon={png_Refresh} onClick={this.props.onRefresh} />
            </td>
            <td>
              <input
                className="WebAdress"
                placeholder=" Address . . ."
                type="text"
                value={this.props.inputURL}
                onChange={this.props.handleUrlChange}
                onKeyDown={this.props._handleKeyDown}
              />
            </td>
            <td style={{ width: 20 }} />
          </tr>
        </tbody>
      </table>
    );
  }
}

export default ToolBox;
