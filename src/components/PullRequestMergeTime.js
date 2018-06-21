import React from 'react';
import ReactDOM from 'react-dom';

export default class PullRequestMergeTime extends React.Component {
    constructor(props){
        super(props);

        this.state = {gitHubUrl: props.url};
    }

    componentDidUpdate() {
        if(this.props.url != null && this.props.url != ''){
            var data = this.getPullRequestData(this.props.url);
        }
    }

    getPullRequestData(url) {

    }

    render(){
        return (
        <div class="col-md-6">
            <div class="shadow-component">
                <div class="head-component-6">
                    <span class="text-head">Average Pull Request Merge Time</span>
                </div>
                <div class="body-component-6">
                </div>
            </div>            
        </div>
        );
    }
}