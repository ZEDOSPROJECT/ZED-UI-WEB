import React from 'react';
import ZED_LOGO from "../../logo.png";

export default class System extends React.Component {
    render(){
        return(
        <div>
            <img
                alt=""
                draggable="false"
                src={ZED_LOGO}
                width="54"
                height="54"
                style={{ float: "left", marginRight: "12px" }}
            />
            <div style={{ padding: "10px" }}>
            <b> ZED </b>
            <font color="red">XP</font>
            <br />
            <font size="5px">BUILD: 0</font>
            <div style={{ marginTop: 20 }}>
                <table>
                <tr>Software</tr>
                <tr>
                    <th>O.S:</th>
                    <th>{this.props.SystemInfo.OperatingSystem}</th>
                </tr>
                <tr>
                    <th>Version:</th>
                    <th>{this.props.SystemInfo.Version}</th>
                </tr>
                <tr>
                    <th>Linux Kernel:</th>
                    <th>{this.props.SystemInfo.Kernel}</th>
                </tr>
                <tr style={{ height: 22 }} />
                <tr>Hardware:</tr>
                <tr>
                    <th style={{ width: 130 }}>CPU:</th>
                    <th>{this.props.SystemInfo.CPU}</th>
                </tr>
                <tr>
                    <th>Memory:</th>
                    <th>{this.props.SystemInfo.RAM}</th>
                </tr>
                <tr>
                    <th>Storage:</th>
                    <th>{this.props.SystemInfo.STORAGE}</th>
                </tr>
                </table>
            </div>
            <br />
            <div>
                <h2>System Updates</h2>
                Which development branch would you like to use? <br/><br/>
                <select value={"Select Branch"} id="branch" onChange={this.props.setBranch}>
                <option value="">Select Branch</option>
                <option value="master">master</option>
                <option value="develop">develop</option>
                </select>
            </div>
            </div>
        </div>
      );
    }
}