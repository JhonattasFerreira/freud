import React from 'react';

export default class PullRequestMergeTime extends React.Component {
    constructor(props){
        super(props);

        this.state = {day: 0, hour: 0, minute: 0,flag:true};
    }

    componentDidUpdate() {
        var self = this;
        if(this.props.url != null && this.props.url != '' && self.state.flag) {
            self.setState({flag: false})       
            let promisse = this.getPullRequestData(this.props.url,self);
            promisse.then(result => {
                
            });
        }
    }

    ///pulls?state=closed&page=" + page + "&per_page=100"
    getPullRequestData(url,self) {

        return new Promise((resolve, reject) =>{
            let page = 1;
            let quantity = 0;
            let totalHours = 0;
            let xhr = new XMLHttpRequest();
            xhr.open("GET",url + "/pulls?state=closed&page=" + page + "&per_page=100");

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if(xhr.status == 200){
                        let dataPullRequest = JSON.parse(xhr.responseText);

                        if (dataPullRequest != null && dataPullRequest.length > 0) {
                            quantity = quantity + dataPullRequest.length;

                            dataPullRequest.forEach(pullRequest => {
                                let createdDate = new Date(pullRequest.created_at);
                                let endDate = new Date(pullRequest.merged_at);
                                if(pullRequest.merged_at == null){
                                    endDate = new Date(pullRequest.closed_at);
                                }
                                let timeDiff = Math.abs(endDate.getTime() - createdDate.getTime());
                                let diffhours = timeDiff/1000/60/60;

                                totalHours = totalHours + diffhours;

                            });

                            page = page + 1;
                            xhr.open("GET", url + "/pulls?state=closed&page=" + page + "&per_page=100");
                            xhr.send();
                        }
                        else{
                            let average = totalHours/quantity;
                            let Days=Math.floor(average/24);
                            let Remainder=average % 24;
                            let Hours=Math.floor(Remainder);
                            let Minutes=Math.floor(60*(Remainder-Hours));
                            let averagePullRequestTime = {"Days":Days,"Hours":Hours,"Minutes":Minutes}

                            let output = {
                                averagePullRequestTime: averagePullRequestTime,
                                self: self  
                            }

                            self.setState({day: averagePullRequestTime.Days});
                            self.setState({hour: averagePullRequestTime.Hours});
                            self.setState({minute: averagePullRequestTime.Minutes});
                            resolve(output);
                        } 
                    }
                }
            }

            xhr.send();
        });
    }

    render(){
        return (
        <div class="col-md-6">
            <div class="shadow-component">
                <div class="head-component-6">
                    <span class="text-head">Average Pull Request Merge Time</span>
                </div>
                <div class="body-component-6">
                    <div class="information-average">
                        <span>{this.state.day} day </span>
                        <span>{this.state.hour}h{this.state.minute}m</span>                        
                    </div>
                </div>
            </div>            
        </div>
        );
    }
}