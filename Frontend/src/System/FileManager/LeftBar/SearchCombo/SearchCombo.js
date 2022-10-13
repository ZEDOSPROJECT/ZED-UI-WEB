import React from 'react';
import './SearchCombo.css';

export default class SearchCombo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            searchQuery: ''
        }
        this.handleSearchButton = this.handleSearchButton.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }


    handleSearchButton(){
        this.props.onSearchGo(this.state.searchQuery);
    }

    handleSearchChange(e){
        this.setState({
            searchQuery: e.target.value
        });
    }

    render(){
        return(<div>
                    <div>
                        <div>Type the name of the file you want to find:</div>
                        <input
                            className="searchInputBox"
                            type="text"
                            autoFocus
                            value={this.state.searchQuery}
                            onChange={this.handleSearchChange}
                        />
                        <center>
                            <button onClick={this.props.onSearchModeChange}>Cancel</button>
                            <button onClick={this.handleSearchButton}>Search</button>
                        </center>
                    </div>
                </div>)
    }
}