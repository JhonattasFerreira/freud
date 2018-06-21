import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SearchInput from './components/SearchInput.js';
import PullRequestMergeTime from './components/PullRequestMergeTime.js';

class App extends React.Component {    
    constructor(props){
        super(props)
        this.state = {urlGithub: ''}
    }

    cb(url){
        this.setState({urlGithub: url});        
    }

    render(){
        return(
            <div class="container-fluid">
                <div class="row">
                    <SearchInput retorno={this.cb.bind(this)} />
                </div>
                <div class="row">
                    <PullRequestMergeTime url={this.state.urlGithub} />
                </div>
            </div>
        );        
    }
}



ReactDOM.render(
    <App />,
    document.getElementById('root')
  );