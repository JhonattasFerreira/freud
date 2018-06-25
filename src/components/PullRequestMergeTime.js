import React from 'react';

export default class PullRequestMergeTime extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            day: 0,
            hour: 0,
            minute: 0,
            isLoading: true
        };
    }

    componentDidUpdate(oldUrl) {
        if (this.props.url != oldUrl.url) {

            this.setState({isLoading: true});
            let self = this;
            let url = this.props.url + "/pulls?state=closed&direction=desc&page=1&per_page=100";

            let promisse = this.getPullRequestData(url, self);
            promisse.then(result => {
                this.setState({isLoading: false});
                this.setState({day: result.averagePullRequestTime.Days});
                this.setState({hour: result.averagePullRequestTime.Hours});
                this.setState({minute: result.averagePullRequestTime.Minutes});
            });
        }
    }
    componentDidMount() {
        let self = this;
        if (this.props.url != null && this.props.url != '') {
            let url = this.props.url + "/pulls?state=closed&direction=desc&page=1&per_page=100";

            let promisse = this.getPullRequestData(url, self);
            promisse.then(result => {
                this.setState({isLoading: false});
                this.setState({day: result.averagePullRequestTime.Days});
                this.setState({hour: result.averagePullRequestTime.Hours});
                this.setState({minute: result.averagePullRequestTime.Minutes});
            });
        }
    }

    getPullRequestData(url, self) {

        return new Promise((resolve, reject) => {

            let quantity = 0;
            let totalHours = 0;
            let xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        let dataPullRequest = JSON.parse(xhr.responseText);

                        if (dataPullRequest != null && dataPullRequest.length > 0) {
                            quantity = dataPullRequest.length;

                            dataPullRequest.forEach(pullRequest => {
                                let diffhours = self.calculateHours(pullRequest.created_at, pullRequest.closed_at, pullRequest.merged_at);
                                totalHours = totalHours + diffhours;
                            });

                            let averagePullRequestTime = self.calculateAveragePullRequestMergeTime(totalHours, quantity);
                            let output = {
                                averagePullRequestTime: averagePullRequestTime,
                                self: self
                            }

                            resolve(output);
                        }
                    }
                }
            }
            xhr.send();
        });
    }

    calculateHours(created, closed, merged) {
        let createdDate = new Date(created);
        let endDate = new Date(merged);
        if (merged == null) {
            endDate = new Date(closed);
        }
        let timeDiff = Math.abs(endDate.getTime() - createdDate.getTime());
        let diffhours = timeDiff / 1000 / 60 / 60;

        return diffhours;
    }

    calculateAveragePullRequestMergeTime(totalHours, quantity) {
        let average = totalHours / quantity;
        let Days = Math.floor(average / 24);
        let Remainder = average % 24;
        let Hours = Math.floor(Remainder);
        let Minutes = Math.floor(60 * (Remainder - Hours));
        let averagePullRequestTime = {
            "Days": Days,
            "Hours": Hours,
            "Minutes": Minutes
        }

        return averagePullRequestTime;
    }

    render(){
        const isLoading = this.state.isLoading;
        return (
        <div class="col-md-6">
            <div class="shadow-component">
                <div class="head-component-6">
                    <span class="text-head">Average Pull Request Merge Time</span>
                </div>
                <div class="body-component-6">
                    <div class="information-average">
                    {isLoading ? (<div>Loading...</div>):(<div><span>{this.state.day} day </span>
                        <span>{this.state.hour}h{this.state.minute}m</span></div>)}                       
                    </div>
                </div>
            </div>            
        </div>
        );
    }
}