import React from "react";
import ReactDOM from "react-dom";
import LeftPanel from "./LeftPanel/LeftPanel.js";
import SettingContext from "./SettingContext/settingContext.js";
<<<<<<< HEAD
import ScreeAppearance from './Screens/Appearance';
import ScreenSystem from './Screens/System';
import ScreenSoundScreen from './Screens/SoundScreen'
import ScreenNetwork from './Screens/Network'
import ScreenUsers from './Screens/Users'
=======
import ScreeAppearance from './Screens/Apperarance/Appearance';
import ScreenSystem from './Screens/System/System';
import ScreenSoundScreen from './Screens/SoundScreen/SoundScreen'
import ScreenNetwork from './Screens/Network/Network'
import ScreenUsers from './Screens/Users/Users'
>>>>>>> develop
import img_0 from './0.png';
import img_1 from './1.png';
import img_2 from './2.png';
import img_3 from './3.png';
import Logo from './logo.png';
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
<<<<<<< HEAD
        Version: "2019.0",
=======
        Version: "2020.0",
>>>>>>> develop
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
    // eslint-disable-next-line
    tmpSettings.setting_wallpaperURL = this.state.SettingJSON.setting_wallpaperURL.replace(
      // eslint-disable-next-line
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
    // eslint-disable-next-line
    let branchIndex=0;
    if(this.state.branch!=="master"){
      branchIndex=1;
    }else{
      branchIndex=0;
    }
    const SettingsScreens = [
      <ScreeAppearance
        Wallpapers={this.state.Wallpapers}
        changeWallpaper={this.changeWallpaper}
        SettingJSON={this.state.SettingJSON}
        Videos={this.state.Videos}
        changeColor1={this.changeColor1}
        changeColor0={this.changeColor0}
        changeAutoGradient={this.changeAutoGradient}
        changeBlueFilter={this.changeBlueFilter}
        changeGradient={this.changeGradient}
        onChangeVideoWallpaper={this.onChangeVideoWallpaper}
      />,
      <ScreenSoundScreen />,
      <ScreenNetwork />,
      <ScreenUsers />,
      <ScreenSystem
        SystemInfo={this.state.SystemInfo}
        setBranch={this.setBranch}
      />
    ];
    const MenusTitles = [
      "Appearence",
      "Sound and Screen",
      "Network",
      "Users",
      "System"
    ];
    const MenuIcons = [
      <img src={img_0} alt="" width="30" height="30" />,
      <img src={img_1} alt="" width="30" height="30" />,
      <img src={img_2} alt="" width="30" height="30" />,
      <img src={img_3} alt="" width="30" height="30" />,
      <img src={Logo} alt="" width="30" height="30" />
    ]
    return (
      <div className="App">
        <div className="settingTable">
          <LeftPanel
            switchSetting={this.switchSetting}
            MenusTitles={MenusTitles}
            MenuIcons={MenuIcons}
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

