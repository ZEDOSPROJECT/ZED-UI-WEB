import React from "react";
import ReactDOM from "react-dom";
import LeftPanel from "./LeftPanel/LeftPanel.js";
import SettingContext from "./SettingContext/settingContext.js";
import ZED_LOGO from "./logo.png";
import "./styles.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    let currentID=0;
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('id');
    if(myParam  !== null){
      currentID=myParam;
    }
    this.state = {
      CurrentSettingID: currentID,
      SettingJSON: {},
      Wallpapers: [],
      branch: "master",
      Videos: [],
      SystemInfo: {
        OperatingSystem: "ZED",
        CPU: undefined,
        Version: "2019.0",
        Kernel: undefined,
        RAM: undefined,
        STORAGE: undefined  
      }
    };
    this.changeBlueFilter = this.changeBlueFilter.bind(this);
    this.getSettingsData = this.getSettingsData.bind(this);
    this.save = this.save.bind(this);
    this.changeColorWallpaper = this.changeColorWallpaper.bind(this);
    this.changeAutoGradient = this.changeAutoGradient.bind(this);
    this.changeGradient = this.changeGradient.bind(this);
    this.changeBing = this.changeBing.bind(this);
    this.changeColor0 = this.changeColor0.bind(this);
    this.changeColor1 = this.changeColor1.bind(this);
    this.changeWallpaper = this.changeWallpaper.bind(this);
    this.switchSetting = this.switchSetting.bind(this);
    this.onChangeVideoWallpaper = this.onChangeVideoWallpaper.bind(this);
    this.setBranch = this.setBranch.bind(this);
  }

  componentWillMount(){
    this.getSettingsData();
  }

  setBranch(e){
    if(e.target.value!==""){
      this.setState({branch: e.target.value});
      fetch(
        "http://" +
          window.location.hostname +
          ":3031/API/SYSTEM/UPDATES/setUpdateBranch.php?id="+e.target.value,
        {
          method: "post",
          body: JSON.stringify(this.state.SettingJSON)
        }
      );
    }
  }

  save() {
    // Make JSON Settings compatible with ZED
    let tmpSettings = this.state.SettingJSON;
    tmpSettings.setting_wallpaperURL = this.state.SettingJSON.setting_wallpaperURL.replace(
      /^.*[\\\/]/,
      ""
    );
    if (Object.entries(tmpSettings).length > 0) {
      fetch(
        "http://" +
          window.location.hostname +
          ":3031/API/SYSTEM/SETTINGS/USER/setSettings.php",
        {
          method: "post",
          body: JSON.stringify(this.state.SettingJSON)
        }
      );
    }
  }

  getSettingsData() {
    fetch(
      "http://" +
        window.location.hostname +
        ":3031/API/SYSTEM/SETTINGS/USER/getSettings.php"
    )
    .then(response => response.json())
    .then(json => {
      this.setState({ SettingJSON: json });
    });
    fetch(
      "http://" +
        window.location.hostname +
        ":3031/API/SYSTEM/SETTINGS/USER/SETTING/getWallpapersImages.php"
    )
    .then(response => response.json())
    .then(jsonWallpapers => {
      let newWallpapers = [""];
      jsonWallpapers.WALLPAPERS.forEach(element => {
        if (element !== "") {
          newWallpapers.push(
            "http://" +
              window.location.hostname +
              ":3031/Wallpapers/Images/" +
              element
          );
        }
      });
      this.setState({ Wallpapers: newWallpapers });
    });

    fetch(
      "http://" +
        window.location.hostname +
        ":3031/API/SYSTEM/SETTINGS/USER/SETTING/getWallpapersVideos.php"
    )
    .then(response => response.json())
    .then(jsonWallpapers => {
      this.setState({ Videos: jsonWallpapers.WALLPAPERS });
    });

    fetch(
      "http://" +
        window.location.hostname +
        ":3031/API/SYSTEM/getInfo.php"
    )
    .then(response => response.json())
    .then(SystemInfo => {
      this.setState({ SystemInfo: SystemInfo });
    });
    fetch(
      "http://" +
        window.location.hostname +
        ":3031/API/SYSTEM/UPDATES/getUpdateBranch.php"
    )
    .then(response => response.text())
    .then(text => {
      this.setState({branch: text});  
    })
  }

  switchSetting(id) {
    this.setState({ CurrentSettingID: id });
    //this.save();
  }

  changeColor0(event) {
    let obj = this.state.SettingJSON;
    obj["setting_systemColor0"] = event.target.value;
    this.setState({ SettingJSON: obj });
    this.save();
  }

  changeColor1(event) {
    let obj = this.state.SettingJSON;
    obj["setting_systemColor1"] = event.target.value;
    this.setState({ SettingJSON: obj });
    this.save();
  }

  changeBing(event) {
    let obj = this.state.SettingJSON;
    obj["setting_bingWallpaper"] = event.target.checked;
    this.setState({ SettingJSON: obj });
    this.save();
  }

  changeGradient(event) {
    let obj = this.state.SettingJSON;
    obj["setting_gradientEffect"] = event.target.checked;
    this.setState({ SettingJSON: obj });
    this.save();
  }

  changeAutoGradient(event) {
    let obj = this.state.SettingJSON;
    obj["setting_autoGradientEffect"] = event.target.checked;
    this.setState({ SettingJSON: obj });
    this.save();
  }

  onChangeVideoWallpaper(event){
    let obj = this.state.SettingJSON;
    if(event.target.value!=="Disabled"){
      obj["videoWallpaperURL"] = event.target.value;
    }else{
      obj["videoWallpaperURL"] = "";
    }
    this.setState({ SettingJSON: obj });
    this.save();
  }

  changeBlueFilter(event) {
    let obj = this.state.SettingJSON;
    obj["setting_blueFilter"] = event.target.checked;
    this.setState({ SettingJSON: obj });
    this.save();
  }

  changeColorWallpaper(event) {
    let obj = this.state.SettingJSON;
    obj["setting_wallpaperColor"] = event.target.value;
    this.setState({ SettingJSON: obj });
    this.save();
  }

  changeWallpaper(img) {
    let obj = this.state.SettingJSON;
    if (img.target.src) {
      obj["setting_wallpaperURL"] = img.target.src;
    } else {
      obj["setting_wallpaperURL"] = "";
    }
    this.setState({ SettingJSON: obj });
    this.save();
  }

  render() {  
    let branchIndex=0;
    if(this.state.branch!=="master"){
      branchIndex=1;
    }
    const SettingsScreens = [
      <div>
        <h2>Background</h2>
        <div>
          {this.state.Wallpapers.map((wallpaper, index) => {
            if(wallpaper !== "") {
              return (
                <img
                  draggable="false"
                  onClick={this.changeWallpaper}
                  style={
                    wallpaper
                      .toString()
                      .includes(this.state.SettingJSON.setting_wallpaperURL)
                      ? {
                          margin: "4",
                          filter: "grayscale(100%)",
                          border: "1px solid #ddd"
                        }
                      : { margin: "4" }
                  }
                  width="150"
                  height="100"
                  src={wallpaper}
                  key={index}
                />
              );
            } else {
              let border =
                this.state.SettingJSON.setting_wallpaperURL === ""
                  ? "1px solid #ddd"
                  : "";
              return (
                <div
                  onClick={this.changeWallpaper}
                  style={{
                    margin: "4",
                    border: border,
                    width: 150,
                    height: 100,
                    float: "left",
                    backgroundColor: this.state.SettingJSON
                      .setting_wallpaperColor
                  }}
                />
              );
            }
          })}
          <p>Video Wallpaper: 
            <select value={this.state.SettingJSON.videoWallpaperURL} name="video" onChange={this.onChangeVideoWallpaper}>
              <option value="Disabled">Disabled</option>
              {this.state.Videos.map((video, index) => {
                if(video!==""){
                  return (<option id={index} value={video}>{video}</option>);
                }
              })}
            </select>
          </p>
          <p>
            Use Bing wallpaper{" "}
            <input
              onClick={this.changeBing}
              checked={this.state.SettingJSON.setting_bingWallpaper}
              type="checkbox"
            />
          </p>
          {this.state.SettingJSON.setting_wallpaperURL === "" ? (
            <p>
              Background color{" "}
              <input
                onChange={this.changeColorWallpaper}
                value={this.state.SettingJSON.setting_wallpaperColor}
                type="color"
              />
            </p>
          ) : null}
        </div>
        <br />
        <h2>Colors</h2>
        <p>
          Main System color{" "}
          <input
            onChange={this.changeColor0}
            value={this.state.SettingJSON.setting_systemColor0}
            type="color"
          />
        </p>
        <p>
          Second System color{" "}
          <input
            onChange={this.changeColor1}
            value={this.state.SettingJSON.setting_systemColor1}
            type="color"
          />
        </p>
        <p>
          Use Gradient Effect{" "}
          <input
            onClick={this.changeGradient}
            checked={this.state.SettingJSON.setting_gradientEffect}
            type="checkbox"
          />
        </p>
        <p>
          Use Auto Gradient by wallpaper{" "}
          <input
            onClick={this.changeAutoGradient}
            checked={this.state.SettingJSON.setting_autoGradientEffect}
            type="checkbox"
          />
        </p>
        <p>
          Blue Ligth Filter{" "}
          <input
            onClick={this.changeBlueFilter}
            checked={this.state.SettingJSON.setting_blueFilter}
            type="checkbox"
          />
        </p>
      </div>,
      <div>Not implemented</div>,
      <div>Not implemented</div>,
      <div>Not implemented</div>,
      <div>
        <img
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
                <th>{this.state.SystemInfo.OperatingSystem}</th>
              </tr>
              <tr>
                <th>Version:</th>
                <th>{this.state.SystemInfo.Version}</th>
              </tr>
              <tr>
                <th>Linux Kernel:</th>
                <th>{this.state.SystemInfo.Kernel}</th>
              </tr>
              <tr style={{ height: 22 }} />
              <tr>Hardware:</tr>
              <tr>
                <th style={{ width: 130 }}>CPU:</th>
                <th>{this.state.SystemInfo.CPU}</th>
              </tr>
              <tr>
                <th>Memory:</th>
                <th>{this.state.SystemInfo.RAM}</th>
              </tr>
              <tr>
                <th>Storage:</th>
                <th>{this.state.SystemInfo.STORAGE}</th>
              </tr>
            </table>
          </div>
          <br />
          <div>
            <h2>System Updates</h2>
            Which development branch would you like to use? <br/><br/>
            <select value={"Select Branch"} id="branch" onChange={this.setBranch}>
              <option value="">Select Branch</option>
              <option value="master">master</option>
              <option value="develop">develop</option>
            </select>
          </div>
        </div>
      </div>
    ];
    const MenusTitles = [
      "Appearence",
      "Sound and Screen",
      "Network",
      "Users",
      "System"
    ];
    return (
      <div className="App">
        <div className="settingTable">
          <LeftPanel
            switchSetting={this.switchSetting}
            MenusTitles={MenusTitles}
            CurrentSettingID={this.state.CurrentSettingID}
          />
          <SettingContext title={MenusTitles[this.state.CurrentSettingID]}>
            {SettingsScreens[this.state.CurrentSettingID]}
          </SettingContext>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

