import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SearchInput from './components/SearchInput.js';

function App(){
    return(
    <SearchInput retorno={cb} />
    )
}

function cb(urlGithub){
    let a = urlGithub;
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
  );