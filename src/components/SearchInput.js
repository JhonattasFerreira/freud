import React from 'react';
import ReactDOM from 'react-dom';

export default class SearchInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {ownerValue: '', repoValue: ''};
        this.handleOwnerChange = this.handleOwnerChange.bind(this);
        this.handleRepoChange = this.handleRepoChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      handleOwnerChange(event) {
        this.setState({ownerValue: event.target.value});
      }

      handleRepoChange(event) {
        this.setState({repoValue: event.target.value});
      }

      handleSubmit(event) {
        event.preventDefault();
        if(this.state.ownerValue == '' || this.state.repoValue == ''){
            alert("É necessário passar o proprietário e o repositório.");
        }else{
            let xhr = new XMLHttpRequest();
            let url = "https://api.github.com/repos/" + this.state.ownerValue + "/" + this.state.repoValue
            
            xhr.open("GET",url,false);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if(xhr.status == 200){
                        this.props.retorno(this.state);
                    } else{
                        alert("É necessário passar o proprietário e o repositório válidos.");
                    }
                    
                }
            }
            xhr.send();
            
        }
      }

    render(){
        return (
        <div class="col-md-12">
            <form onSubmit={this.handleSubmit}>        
                <input type="text" name="name" value={this.state.ownerValue} onChange={this.handleOwnerChange}/>
                <input class="repo-input" type="text" name="name" value={this.state.repoValue} onChange={this.handleRepoChange}/>
                <input type="submit" value="Submit" hidden/>                
            </form>
        </div>
        );
    }
}