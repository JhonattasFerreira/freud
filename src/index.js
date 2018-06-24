import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SearchInput from './components/SearchInput.js';
import PullRequestMergeTime from './components/PullRequestMergeTime.js';
import IssueCloseTime from './components/IssueCloseTime.js';
import PullRequestSize from './components/PullRequestSize.js';

class App extends React.Component {    
    constructor(props){
        super(props)
        this.state = {urlGithub: ''}
    }

    cb(url){
        this.setState({urlGithub: url});        
    }

    render(){
        const teste = this.state.urlGithub;
        return(
            <div class="container-fluid">
                <div class="row">
                    <SearchInput retorno={this.cb.bind(this)} />
                </div>
                {teste != '' ?(
                <div class="row">
               
                    <PullRequestSize url={this.state.urlGithub} />                    
                    <PullRequestMergeTime url={this.state.urlGithub} />
                    <IssueCloseTime url={this.state.urlGithub} /> 
                         
                </div>
                ):(<span></span>)
            }                  
            </div>
        );        
    }
}



ReactDOM.render(
    <App />,
    document.getElementById('root')
  );