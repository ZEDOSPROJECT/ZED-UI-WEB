import React from 'react';


class Appearance extends React.Component {
    render(){
        return(
            <div>
                <h2>Background</h2>
                <div>
                {this.props.Wallpapers.map((wallpaper, index) => {
                    if(wallpaper !== "") {
                    return (
                        <img
                        draggable="false"
                        onClick={this.props.changeWallpaper}
                        style={
                            wallpaper
                            .toString()
                            .includes(this.props.SettingJSON.setting_wallpaperURL)
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
                        this.props.SettingJSON.setting_wallpaperURL === ""
                        ? "1px solid #ddd"
                        : "";
                    return (
                        <div
                        onClick={this.props.changeWallpaper}
                        style={{
                            margin: "4",
                            border: border,
                            width: 150,
                            height: 100,
                            float: "left",
                            backgroundColor: this.props.SettingJSON.setting_wallpaperColor
                        }}
                        />
                    );
                    }
                })}
                <p>Video Wallpaper: 
                    <select value={this.props.SettingJSON.videoWallpaperURL} name="video" onChange={this.onChangeVideoWallpaper}>
                    <option value="Disabled">Disabled</option>
                    {this.props.Videos.map((video, index) => {
                        if(video!==""){
                        return (<option id={index} value={video}>{video}</option>);
                        }
                    })}
                    </select>
                </p>
                {this.props.SettingJSON.setting_wallpaperURL === "" ? (
                    <p>
                    Background color{" "}
                    <input
                        onChange={this.props.changeColorWallpaper}
                        value={this.props.SettingJSON.setting_wallpaperColor}
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
                    onChange={this.props.changeColor0}
                    value={this.props.SettingJSON.setting_systemColor0}
                    type="color"
                />
                </p>
                <p>
                Second System color{" "}
                <input
                    onChange={this.props.changeColor1}
                    value={this.props.SettingJSON.setting_systemColor1}
                    type="color"
                />
                </p>
                <p>
                Use Gradient Effect{" "}
                <input
                    onClick={this.props.changeGradient}
                    checked={this.props.SettingJSON.setting_gradientEffect}
                    type="checkbox"
                />
                </p>
                <p>
                Use Auto Gradient by wallpaper{" "}
                <input
                    onClick={this.props.changeAutoGradient}
                    checked={this.props.SettingJSON.setting_autoGradientEffect}
                    type="checkbox"
                />
                </p>
                <p>
                Blue Ligth Filter{" "}
                <input
                    onClick={this.props.changeBlueFilter}
                    checked={this.props.SettingJSON.setting_blueFilter}
                    type="checkbox"
                />
                </p>
            </div>            
        );
    }
}

export default Appearance;