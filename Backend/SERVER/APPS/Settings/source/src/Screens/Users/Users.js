import React from 'react';
// import UsersContainer from './UsersContainer/UsersContainer';
// import DeleteIcon from './delete.ico';
// import NewIcon from './new.png';
// import PasswordIcon from './password.png';
import './Users.css';

export default class Users extends React.Component {
    constructor(props){
        super(props);

        this.state={
            usersList: [],
            selectedUser: ""
        }

        // fetch("http://" +
        // window.location.hostname +
        // ":3031/API/SYSTEM/SETTINGS/USER/getUsers.php")
        // .then(response => response.json())
        // .then(json => {

        //     let newUsers = [];
        //     json.data.forEach(element => {
        //       if (element !== "") {
        //         newUsers.push(element.userName);
        //       }
        //     });
        //     this.setState({ usersList: newUsers });
        // });

        // this.OnSelected = this.OnSelected.bind(this);
        this.changeAvatar = this.changeAvatar.bind(this);

    }

    changeAvatar(e){
        fetch("http://" +
        window.location.hostname +
        ":3031/API/SYSTEM/SETTINGS/USER/SETTING/setUserAvatar.php?file="+e.target.id);
    }

    // OnSelected(name){
    //     this.setState({
    //         selectedUser: name
    //     });
    // }

    render(){
        var indents = [];
        for (var i = 0; i < 16; i++) {
        indents.push(<div style={{ float: "left",position:"relative" }}>
                <img
                    alt=""
                    id={i}
                    draggable="false"
                    onClick={this.changeAvatar}
                    width="64"
                    height="64"
                    style={{
                        margin: "5px",
                        width:"10",
                        height:"10",
                        cursor:"pointer"
                    }}
                    src={"http://" +
                    window.location.hostname +
                    ":3031/API/SYSTEM/SETTINGS/USER/AVATARS/"+i}
                />
            </div>);
        }
        return(
            <div>
                {/* <div>Users can use this computer</div>
                <UsersContainer
                    OnSelected={this.OnSelected}
                    users={this.state.usersList}
                    selectedUser={this.state.selectedUser}
                />
                <div className="UserAction"><img className="UserActionlabel" src={NewIcon} width="22" alt=""/><div>New User</div></div>
                {this.state.selectedUser !== "" ? (
                    <div>
                        <div className="UserAction"><img className="UserActionlabel" src={PasswordIcon} width="22" alt=""/><div>Change Password</div></div>
                        <div className="UserAction"><img className="UserActionlabel" src={DeleteIcon} width="22" alt=""/><div>Remove User</div></div>
                    </div>
                ):null} */}
                <div>User avatar:</div>
                <div className="AvatarsContainer">
                        {indents}
                </div>
            </div>
        )
    }
}