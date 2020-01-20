import React from 'react';
import UsersContainer from './UsersContainer/UsersContainer';

export default class Users extends React.Component {
    constructor(props){
        super(props);

        this.state={
            usersList: []
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

    }
    render(){
        return(
            <div>
                <div>Users can use this computer</div>
                <UsersContainer users={this.state.usersList} />
            </div>
        )
    }
}