(window.webpackJsonp=window.webpackJsonp||[]).push([[0],[,,,,,,,,,function(e,t,a){e.exports=a.p+"static/media/logo.5ce55483.png"},function(e,t,a){e.exports=a(20)},,,,,,function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){"use strict";a.r(t);var n=a(2),l=a(3),i=a(5),r=a(4),s=a(6),c=a(1),o=a(0),h=a.n(o),u=a(8),g=a.n(u),p=(a(16),function(e){function t(){return Object(n.a)(this,t),Object(i.a)(this,Object(r.a)(t).apply(this,arguments))}return Object(s.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this,t="PanelButton",a=this.props.buttonKey;return this.props.active&&(t="PanelButtonActive"),h.a.createElement("div",{key:a,onClick:function(t){return e.props.switchSetting(a)},className:t},this.props.title)}}]),t}(h.a.Component)),S=(a(17),function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(i.a)(this,Object(r.a)(t).call(this,e))).state={menus:a.props.MenusTitles},a}return Object(s.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this,t=this.props.MenusTitles.map(function(t,a){var n=a;return h.a.createElement(p,{active:n===e.props.CurrentSettingID,switchSetting:e.props.switchSetting,style:{"background-color":"red"},buttonKey:n,title:t})});return h.a.createElement("div",{className:"LeftPanel"},t)}}]),t}(h.a.Component)),m=(a(18),function(e){function t(){return Object(n.a)(this,t),Object(i.a)(this,Object(r.a)(t).apply(this,arguments))}return Object(s.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return h.a.createElement("div",null,h.a.createElement("div",{className:"settingTitle"},h.a.createElement("h2",null,h.a.createElement("i",null,this.props.title))),h.a.createElement("div",{className:"SettingArea"},this.props.children))}}]),t}(h.a.Component)),d=a(9),E=a.n(d),b=(a(19),function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(i.a)(this,Object(r.a)(t).call(this,e))).state={CurrentSettingID:0,SettingJSON:{},Wallpapers:[],Videos:[],SystemInfo:{OperatingSystem:"ZED",CPU:"Intel Core i3 2.2GHz",Version:"2019.0",Kernel:"5.0.1",RAM:"3.8GB",STORAGE:"1TB"}},a.changeBlueFilter=a.changeBlueFilter.bind(Object(c.a)(Object(c.a)(a))),a.getSettingsData=a.getSettingsData.bind(Object(c.a)(Object(c.a)(a))),a.save=a.save.bind(Object(c.a)(Object(c.a)(a))),a.changeColorWallpaper=a.changeColorWallpaper.bind(Object(c.a)(Object(c.a)(a))),a.changeAutoGradient=a.changeAutoGradient.bind(Object(c.a)(Object(c.a)(a))),a.changeGradient=a.changeGradient.bind(Object(c.a)(Object(c.a)(a))),a.changeBing=a.changeBing.bind(Object(c.a)(Object(c.a)(a))),a.changeColor0=a.changeColor0.bind(Object(c.a)(Object(c.a)(a))),a.changeColor1=a.changeColor1.bind(Object(c.a)(Object(c.a)(a))),a.changeWallpaper=a.changeWallpaper.bind(Object(c.a)(Object(c.a)(a))),a.switchSetting=a.switchSetting.bind(Object(c.a)(Object(c.a)(a))),a.onChangeVideoWallpaper=a.onChangeVideoWallpaper.bind(Object(c.a)(Object(c.a)(a))),a.getSettingsData(),a}return Object(s.a)(t,e),Object(l.a)(t,[{key:"save",value:function(){var e=this.state.SettingJSON;e.setting_wallpaperURL=this.state.SettingJSON.setting_wallpaperURL.replace(/^.*[\\\/]/,""),Object.entries(e).length>0&&fetch("http://"+window.location.hostname+":3031/API/SYSTEM/SETTINGS/USER/setSettings.php",{method:"post",body:JSON.stringify(this.state.SettingJSON)})}},{key:"getSettingsData",value:function(){var e=this;fetch("http://"+window.location.hostname+":3031/API/SYSTEM/SETTINGS/USER/getSettings.php").then(function(e){return e.json()}).then(function(t){e.setState({SettingJSON:t}),fetch("http://"+window.location.hostname+":3031/API/SYSTEM/SETTINGS/USER/SETTING/getWallpapersImages.php").then(function(e){return e.json()}).then(function(t){var a=[""];t.WALLPAPERS.forEach(function(e){""!==e&&a.push("http://"+window.location.hostname+":3031/Wallpapers/Images/"+e)}),e.setState({Wallpapers:a}),fetch("http://"+window.location.hostname+":3031/API/SYSTEM/SETTINGS/USER/SETTING/getWallpapersVideos.php").then(function(e){return e.json()}).then(function(t){e.setState({Videos:t.WALLPAPERS})}),fetch("http://"+window.location.hostname+":3031/API/SYSTEM/getInfo.php").then(function(e){return e.json()}).then(function(t){e.setState({SystemInfo:t})})})})}},{key:"switchSetting",value:function(e){this.setState({CurrentSettingID:e}),this.save()}},{key:"changeColor0",value:function(e){var t=this.state.SettingJSON;t.setting_systemColor0=e.target.value,this.setState({SettingJSON:t}),this.save()}},{key:"changeColor1",value:function(e){var t=this.state.SettingJSON;t.setting_systemColor1=e.target.value,this.setState({SettingJSON:t}),this.save()}},{key:"changeBing",value:function(e){var t=this.state.SettingJSON;t.setting_bingWallpaper=e.target.checked,this.setState({SettingJSON:t}),this.save()}},{key:"changeGradient",value:function(e){var t=this.state.SettingJSON;t.setting_gradientEffect=e.target.checked,this.setState({SettingJSON:t}),this.save()}},{key:"changeAutoGradient",value:function(e){var t=this.state.SettingJSON;t.setting_autoGradientEffect=e.target.checked,this.setState({SettingJSON:t}),this.save()}},{key:"onChangeVideoWallpaper",value:function(e){var t=this.state.SettingJSON;"Disabled"!==e.target.value?t.videoWallpaperURL=e.target.value:t.videoWallpaperURL="",this.setState({SettingJSON:t}),this.save()}},{key:"changeBlueFilter",value:function(e){var t=this.state.SettingJSON;t.setting_blueFilter=e.target.checked,this.setState({SettingJSON:t}),this.save()}},{key:"changeColorWallpaper",value:function(e){var t=this.state.SettingJSON;t.setting_wallpaperColor=e.target.value,this.setState({SettingJSON:t}),this.save()}},{key:"changeWallpaper",value:function(e){var t=this.state.SettingJSON;e.target.src?t.setting_wallpaperURL=e.target.src:t.setting_wallpaperURL="",this.setState({SettingJSON:t}),this.save()}},{key:"render",value:function(){var e=this,t=[h.a.createElement("div",null,h.a.createElement("h2",null,"Background"),h.a.createElement("div",null,this.state.Wallpapers.map(function(t,a){if(""!==t)return h.a.createElement("img",{onClick:e.changeWallpaper,style:t.toString().includes(e.state.SettingJSON.setting_wallpaperURL)?{margin:"4",filter:"grayscale(100%)",border:"1px solid #ddd"}:{margin:"4"},width:"150",height:"100",src:t,key:a});var n=""===e.state.SettingJSON.setting_wallpaperURL?"1px solid #ddd":"";return h.a.createElement("div",{onClick:e.changeWallpaper,style:{margin:"4",border:n,width:150,height:100,float:"left",backgroundColor:e.state.SettingJSON.setting_wallpaperColor}})}),h.a.createElement("p",null,"Video Wallpaper:",h.a.createElement("select",{value:this.state.SettingJSON.videoWallpaperURL,name:"video",onChange:this.onChangeVideoWallpaper},h.a.createElement("option",{value:"Disabled"},"Disabled"),this.state.Videos.map(function(e,t){if(""!==e)return h.a.createElement("option",{id:t,value:e},e)}))),h.a.createElement("p",null,"Use Bing wallpaper"," ",h.a.createElement("input",{onClick:this.changeBing,checked:this.state.SettingJSON.setting_bingWallpaper,type:"checkbox"})),""===this.state.SettingJSON.setting_wallpaperURL?h.a.createElement("p",null,"Background color"," ",h.a.createElement("input",{onChange:this.changeColorWallpaper,value:this.state.SettingJSON.setting_wallpaperColor,type:"color"})):null),h.a.createElement("br",null),h.a.createElement("h2",null,"Colors"),h.a.createElement("p",null,"Main System color"," ",h.a.createElement("input",{onChange:this.changeColor0,value:this.state.SettingJSON.setting_systemColor0,type:"color"})),h.a.createElement("p",null,"Second System color"," ",h.a.createElement("input",{onChange:this.changeColor1,value:this.state.SettingJSON.setting_systemColor1,type:"color"})),h.a.createElement("p",null,"Use Gradient Effect"," ",h.a.createElement("input",{onClick:this.changeGradient,checked:this.state.SettingJSON.setting_gradientEffect,type:"checkbox"})),h.a.createElement("p",null,"Use Auto Gradient by wallpaper"," ",h.a.createElement("input",{onClick:this.changeAutoGradient,checked:this.state.SettingJSON.setting_autoGradientEffect,type:"checkbox"})),h.a.createElement("p",null,"Blue Ligth Filter"," ",h.a.createElement("input",{onClick:this.changeBlueFilter,checked:this.state.SettingJSON.setting_blueFilter,type:"checkbox"}))),h.a.createElement("div",null,"Not implemented"),h.a.createElement("div",null,"Not implemented"),h.a.createElement("div",null,"Not implemented"),h.a.createElement("div",null,h.a.createElement("img",{src:E.a,width:"54",height:"54",style:{float:"left",marginRight:"12px"}}),h.a.createElement("div",{style:{padding:"10px"}},h.a.createElement("b",null," ZED "),h.a.createElement("font",{color:"red"},"XP"),h.a.createElement("br",null),h.a.createElement("font",{size:"5px"},"BUILD: 0"),h.a.createElement("div",{style:{marginTop:20}},h.a.createElement("table",null,h.a.createElement("tr",null,"Software"),h.a.createElement("tr",null,h.a.createElement("th",null,"O.S:"),h.a.createElement("th",null,this.state.SystemInfo.OperatingSystem)),h.a.createElement("tr",null,h.a.createElement("th",null,"Version:"),h.a.createElement("th",null,this.state.SystemInfo.Version)),h.a.createElement("tr",null,h.a.createElement("th",null,"Linux Kernel:"),h.a.createElement("th",null,this.state.SystemInfo.Kernel)),h.a.createElement("tr",{style:{height:22}}),h.a.createElement("tr",null,"Hardware:"),h.a.createElement("tr",null,h.a.createElement("th",{style:{width:130}},"CPU:"),h.a.createElement("th",null,this.state.SystemInfo.CPU)),h.a.createElement("tr",null,h.a.createElement("th",null,"Memory:"),h.a.createElement("th",null,this.state.SystemInfo.RAM)),h.a.createElement("tr",null,h.a.createElement("th",null,"Storage:"),h.a.createElement("th",null,this.state.SystemInfo.STORAGE)))),h.a.createElement("br",null),h.a.createElement("div",null,h.a.createElement("h2",null,"System Updates"),h.a.createElement("button",{disabled:!0},"Check and install Updates"))))],a=["Appeaarence","Sound and Screen","Network","Users","System"];return h.a.createElement("div",{className:"App"},h.a.createElement("div",{className:"settingTable"},h.a.createElement(S,{switchSetting:this.switchSetting,MenusTitles:a,CurrentSettingID:this.state.CurrentSettingID}),h.a.createElement(m,{title:a[this.state.CurrentSettingID]},t[this.state.CurrentSettingID])))}}]),t}(h.a.Component)),O=document.getElementById("root");g.a.render(h.a.createElement(b,null),O)}],[[10,1,2]]]);
//# sourceMappingURL=main.d135e20b.chunk.js.map