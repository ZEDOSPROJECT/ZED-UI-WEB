import React from 'react';
import UserIcon from './UserIcon/UserIcon';
import './UsersContainer.css';

export default class UsersContainer extends React.Component {
    render(){
        let finalListUsers=null;
        if(this.props.users !== undefined){
            finalListUsers=this.props.users.map((item) => {
                return(
                    <UserIcon uName={item}/>
                );
            });
        }
        
        return(<div className="UsersContainer">
            {finalListUsers}
        </div>)
    }
}