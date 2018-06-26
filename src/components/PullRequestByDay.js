import React from 'react';

export default class PullRequestByDay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {isLoading: true};
    }

    componentDidUpdate(oldUrl) {
        if(this.props.url != oldUrl.url) {

            this.setState({isLoading: true});
            let self = this;
            
            let url = this.props.url + "/pulls?state=all&direction=desc&page=1&per_page=100";
            let promisse = this.getPullRequestData(url, self);
            promisse.then(result => {
                this.setState({isLoading: false});
                result.self.makeChart(result.data);
            });
        }
    }

    componentDidMount() {        
        let self = this;
        
        if (this.props.url != null && this.props.url != '') {
            
            let url = this.props.url + "/pulls?state=all&direction=desc&page=1&per_page=100";
            let promisse = this.getPullRequestData(url, self);
            promisse.then(result => {
                this.setState({isLoading: false});
                result.self.makeChart(result.data);
            });
        }
    }

    getPullRequestData(url, self) {
        return new Promise((resolve, reject) => {
            let endDate = new Date();
            let initialDate = new Date(new Date().setDate(new Date().getDate() - 30));

            let dates = {};

            let xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        let dataPullRequest = JSON.parse(xhr.responseText);

                        if (dataPullRequest != null && dataPullRequest.length > 0) {
                            dates = self.getPullRequestDates(dataPullRequest, initialDate, endDate, self);
                            let data = self.orderDates(dates);
                            let output = {
                                "data": data,
                                "self": self
                            }
                            resolve(output);                         
                        } 
                    }
                }
            }
            xhr.send();
        });
    }

    getPullRequestDates(dataPullRequest, initialDate, endDate, self) {
        let dates = {};

        dataPullRequest.forEach(pullRequest => {
            self.getPullRequestCreatedDate(pullRequest.created_at, initialDate, endDate, dates);
            self.getPullRequestClosedDate(pullRequest.closed_at, initialDate, endDate, dates);
            self.getPullRequestMergedDate(pullRequest.merged_at, initialDate, endDate, dates);
        });

        return dates;
    }

    getPullRequestCreatedDate(date, initialDate, endDate, dates) {
        let pullRequestDate = new Date(date).getTime();
        let fomatedDated = new Date(new Date(date).toDateString()).getTime();
        
        if (pullRequestDate <= endDate.getTime() && pullRequestDate >= initialDate.getTime()) {

            if (dates.hasOwnProperty(fomatedDated)) {
                dates[fomatedDated].created += 1
            } else {
                dates[fomatedDated] = {
                    "merged": 0,
                    "closed": 0,
                    "created": 0
                }
                dates[fomatedDated].created += 1
            }
        }
    }

    getPullRequestClosedDate(date, initialDate, endDate, dates) {
        if (date != null && new Date(date).getTime() <= endDate.getTime() &&
            new Date(date).getTime() >= initialDate.getTime()) {

            let fomatedDated = new Date(new Date(date).toDateString()).getTime();

            if (dates.hasOwnProperty(fomatedDated)) {

                dates[fomatedDated].closed += 1
            } else {

                dates[fomatedDated] = {
                    "merged": 0,
                    "closed": 0,
                    "created": 0
                }
                dates[fomatedDated].closed += 1
            }
        }
    }

    getPullRequestMergedDate(date, initialDate, endDate, dates) {
        if (date != null && new Date(date).getTime() <= endDate.getTime() &&
            new Date(date).getTime() >= initialDate.getTime()) {

            let fomatedDated = new Date(new Date(date).toDateString()).getTime();

            if (dates.hasOwnProperty(fomatedDated)) {
                dates[fomatedDated].merged += 1

            } else {
                dates[fomatedDated] = {
                    "merged": 0,
                    "closed": 0,
                    "created": 0
                }
                dates[fomatedDated].merged += 1
            }
        }
    }

    orderDates(dates) {
        let days = [];
        let created = [];
        let closed = [];
        let merged = [];

        Object.keys(dates)
            .sort()
            .forEach(function (v, i) {
                days = days.concat(new Date(parseInt(v)).toDateString());
                created = created.concat(dates[v].created);
                closed = closed.concat(dates[v].closed);
                merged = merged.concat(dates[v].merged);
            });
        let orderedDate = {
            days: days,
            created: created,
            closed: closed,
            merged: merged
        }

        return orderedDate;
    }

    makeChart(data) {
        let ctxL = document.getElementById("lineChart").getContext('2d');
        let myLineChart = new window.Chart(ctxL, {
            type: 'line',
            data: {
                labels: data.days,
                datasets: [
                    {
                        label: "Merged",
                        fill: false,
                        data: data.merged,
                        borderColor: "rgba(179, 13, 255)",
                        lineTension: 0
                    },
                    {
                        label: "Opened",
                        fill: false,
                        data: data.created,
                        borderColor: "rgba(19, 198, 0)",
                        lineTension: 0
                    },
                    {
                        label: "Closed",
                        fill: false,
                        data: data.closed,
                        borderColor: "rgba(255, 58, 0)",
                        lineTension: 0
                    }
                ]
            },
            options: {
                responsive: true
            }
        });
    }

    render(){
        const isLoading = this.state.isLoading;
        return (
        <div class="col-md-12 margin-bottom-12">
            <div class="shadow-component">
                <div class="head-component-6">
                    <span class="text-head">Month Sumary</span>
                </div>
                {isLoading ? 
                    (
                        <div class="body-component-12 body-loading">
                            <span class="font-size-loading">Loading...</span>                 
                        </div>
                    ):
                    ( 
                        <div class="body-component-12">
                            <canvas id="lineChart" height="120" width="500"></canvas>
                        </div>
                    )
                }
            </div>            
        </div>
        );
    }
}