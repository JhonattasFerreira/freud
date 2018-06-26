import React from 'react';
import Chart from 'mdbootstrap/js/mdb.js';

export default class PullRequestSize extends React.Component {
    constructor(props){
        super(props);

        this.state = {isLoading: true};        
    }

    componentDidUpdate(oldUrl) {
        if(this.props.url != oldUrl.url) {

            this.setState({isLoading: true});
            let self = this;
            let url = this.props.url + "/pulls?state=closed&direction=desc&page=1&per_page=100";
            let promisseUrls = this.getPullRequestUrls(url,self);
            promisseUrls.then(result => {
                
                let promisse = result.self.getPullRequestSizeData(result.urls,result.self)
                promisse.then(result2 => {
                    this.setState({isLoading: false});
                    result2.self.makeChart(result2.data);                    
                });
            });
        }
    }

    componentDidMount(){
        let self = this;
        if(this.props.url != null && this.props.url != '') {
            let url = this.props.url + "/pulls?state=closed&direction=desc&page=1&per_page=100";

            let promisseUrls = this.getPullRequestUrls(url,self);
            promisseUrls.then(result => {
                let promisse = result.self.getPullRequestSizeData(result.urls,result.self)
                promisse.then(result2 => {
                    this.setState({isLoading: false});
                    result2.self.makeChart(result2.data);
                    
                });
            });
        }
    }

    getPullRequestSizeData(urls, self){

        return new Promise((resolve, reject) =>{
        let quantitySmall = 0;
        let totalDaysSmall = 0;

        let quantityMedium = 0;
        let totalDaysMedium = 0;

        let quantitylarge = 0;
        let totalDaysLarge = 0;
        urls.forEach(url => {
            let request = new XMLHttpRequest();
            request.open("GET", url,false);
            request.onreadystatechange = function() {

                if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                    let data = JSON.parse(request.responseText);
                    let totalLines = data.additions + data.deletions;

                    if(totalLines <= 100){
                        quantitySmall += 1;                        
                        let diffhours = self.calculateHours(data.created_at,data.closed_at,data.merged_at);
                        totalDaysSmall = totalDaysSmall + diffhours;
                    }
                    else if(totalLines <= 1000){
                        quantityMedium += 1;                        
                        let diffhours = self.calculateHours(data.created_at,data.closed_at,data.merged_at);
                        totalDaysMedium = totalDaysMedium + diffhours;
                    }
                    else{
                        quantitylarge += 1;
                        let diffhours = self.calculateHours(data.created_at,data.closed_at,data.merged_at);
                        totalDaysLarge = totalDaysLarge + diffhours;
                    }
                }
            }
    
            request.send();
        });

        let averageSmall = self.calculateAveragePullRequestSize(totalDaysSmall,quantitySmall);
        let averageMedium = self.calculateAveragePullRequestSize(totalDaysMedium,quantityMedium);
        let averageLarge = self.calculateAveragePullRequestSize(totalDaysLarge,quantitylarge);

        let data = {"averageSmall":averageSmall,"averageMedium":averageMedium,"averageLarge":averageLarge};

        let output = {
            data: data,
            self: self
        }

        resolve(output)
        });
                             
    }    

    getPullRequestUrls(url,self){
        return new Promise((resolve, reject) =>{
        let urls = [];
        let endDate = new Date();
        let initialDate = new Date(new Date().setDate(new Date().getDate() - 30));

        let xhr = new XMLHttpRequest();
        xhr.open("GET",url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    let dataPullRequest = JSON.parse(xhr.responseText);

                    if (dataPullRequest != null && dataPullRequest.length > 0) {                        
                        dataPullRequest.forEach(pullRequest => {

                            let date = new Date(pullRequest.closed_at).getTime();
                            if(date <= endDate.getTime() && date >= initialDate.getTime()){
                                urls = urls.concat(pullRequest.url);
                            }
                            
                        }); 
                        
                        let output = {
                            urls: urls,
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


    calculateHours(created, closed, merged){
        let createdDate = new Date(created);
        let endDate = new Date(merged);
        if(merged == null){
            endDate = new Date(closed);
        } 
        let timeDiff = Math.abs(endDate.getTime() - createdDate.getTime());
        let diffhours = timeDiff/1000/60/60;
        return diffhours;
    }

    calculateAveragePullRequestSize(days, quantity){
        return days/quantity == NaN ? 0 : parseFloat((days/quantity).toFixed(2));
    }

    makeChart(datas){
        let ctx = document.getElementById("myChart").getContext('2d');
      
        let myChart = new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Small", "Medium", "Large"],
                datasets: [{
                    label: 'Pull Request Merge Time',
                    data: [datas.averageSmall, datas.averageMedium, datas.averageLarge],
                    backgroundColor: [                        
                        'rgba(54, 162, 235)',
                        'rgba(54, 162, 235)',
                        'rgba(54, 162, 235)'
                        
                    ],
                    borderColor: [                        
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)'                        
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    }

    render(){
        const isLoading = this.state.isLoading;
        return (
        <div class="col-md-12">
            <div class="shadow-component">
                <div class="head-component-6">
                    <span class="text-head">Average Pull Request Merge Time</span>
                </div>
                {isLoading ? 
                    (
                        <div class="body-component-12 body-loading">
                            <span class="font-size-loading">Loading...</span>                 
                        </div>
                    ):
                    ( 
                        <div class="body-component-12">
                            <canvas id="myChart" height="120" width="500"></canvas>
                        </div>
                    )
                }
            </div>            
        </div>

        );
    }

}