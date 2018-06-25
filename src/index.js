import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SearchInput from './components/SearchInput.js';
import PullRequestMergeTime from './components/PullRequestMergeTime.js';
import IssueCloseTime from './components/IssueCloseTime.js';
import PullRequestSize from './components/PullRequestSize.js';
import PullRequestByDay from './components/PullRequestByDay';

class App extends React.Component {    
    constructor(props){
        super(props)
        this.state = {urlGithub: ''}
    }

    cb(url){
        this.setState({urlGithub: url});        
    }

    render(){
        const hasUrlGithub = this.state.urlGithub;
        return(
            <div class="container-fluid">
                <div class="row">
                    <SearchInput callback={this.cb.bind(this)} />
                </div>
                {hasUrlGithub != '' ?(
                <div class="row">
               
                    <PullRequestSize url={this.state.urlGithub} />                  
                    <PullRequestMergeTime url={this.state.urlGithub} /> 
                    <IssueCloseTime url={this.state.urlGithub} />   
                    <PullRequestByDay url={this.state.urlGithub} /> 
                         
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