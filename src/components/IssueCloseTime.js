import React from 'react';

export default class IssueCloseTime extends React.Component {
    constructor(props){
        super(props);

        this.state = {day: 0, hour: 0, minute: 0, isLoading: true};
    }

    componentDidUpdate(oldUrl) {
        if(this.props.url != oldUrl.url) {

            this.setState({isLoading: true});
            var self = this;
            let url = this.props.url + "/issues?state=closed&page="
            let promisse = this.getIssueData(url,self);
            promisse.then(result => {
                this.setState({isLoading: false});
            });
        }
    }

    componentDidMount(){
        var self = this;
        if(this.props.url != null && this.props.url != '') {

            let url = this.props.url + "/issues?state=closed&page="
            let promisse = this.getIssueData(url,self);
            promisse.then(result => {
                this.setState({isLoading: false});
            });
        }
    }

    getIssueData(url,self) {

        return new Promise((resolve, reject) =>{
            let page = 1;
            let quantity = 0;
            let totalHours = 0;
            
            let xhr = new XMLHttpRequest();
            xhr.open("GET",url + page + "&per_page=100");
            xhr.setRequestHeader('Authorization', 'Bearer ' + 'c70e2543d1a6b4221c39422426de42f4e325ae36');
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if(xhr.status == 200){
                        let dataIssue = JSON.parse(xhr.responseText);

                        if (dataIssue != null && dataIssue.length > 0) {
                            quantity = quantity + dataIssue.length;

                            dataIssue.forEach(issue => {

                                if(!issue.hasOwnProperty("pull_request")){

                                    let createdDate = new Date(issue.created_at);
                                    let endDate = new Date(issue.closed_at);
                                    
                                    let timeDiff = Math.abs(endDate.getTime() - createdDate.getTime());
                                    let diffhours = timeDiff/1000/60/60;

                                    totalHours = totalHours + diffhours;
                                }

                            });

                            page = page + 1;
                            xhr.open("GET", url + page + "&per_page=100");
                            xhr.setRequestHeader('Authorization', 'Bearer ' + 'c70e2543d1a6b4221c39422426de42f4e325ae36');
                            xhr.send();
                        }
                        else{
                            let average = totalHours/quantity;
                            let Days=Math.floor(average/24);
                            let Remainder=average % 24;
                            let Hours=Math.floor(Remainder);
                            let Minutes=Math.floor(60*(Remainder-Hours));
                            let averageIssueTime = {"Days":Days,"Hours":Hours,"Minutes":Minutes}

                            let output = {
                                averageIssueTime: averageIssueTime,
                                self: self  
                            }

                            self.setState({day: averageIssueTime.Days});
                            self.setState({hour: averageIssueTime.Hours});
                            self.setState({minute: averageIssueTime.Minutes});
                            resolve(output);
                        } 
                    }
                }
            }

            xhr.send();
        });
    }

    render(){
        const isLoading = this.state.isLoading;
        return (
        <div class="col-md-6">
            <div class="shadow-component">
                <div class="head-component-6">
                    <span class="text-head">Average Issue Close Time</span>
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