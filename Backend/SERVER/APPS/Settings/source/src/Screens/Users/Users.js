import React from 'react';
import UsersContainer from './UsersContainer/UsersContainer';
import DeleteIcon from './delete.ico';
import NewIcon from './new.png';
import PasswordIcon from './password.png';
import './Users.css';

export default class Users extends React.Component {
    constructor(props){
        super(props);

        this.state={
            usersList: [],
            selectedUser: ""
        }

        fetch("http://" +
        window.location.hostname +
        ":3031/API/SYSTEM/SETTINGS/USER/getUsers.php")
        .then(response => response.json())
        .then(json => {

            let newUsers = [];
            json.data.forEach(element => {
              if (element !== "") {
                newUsers.push(element.userName);
              }
            });
            this.setState({ usersList: newUsers });
        });

        this.OnSelected = this.OnSelected.bind(this);

    }

    OnSelected(name){
        this.setState({
            selectedUser: name
        });
    }

    render(){
        return(
            <div>
                <div>Users can use this computer</div>
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
                ):null}
            </div>
        )
    }
}