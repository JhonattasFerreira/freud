import React from 'react';
import Chart from 'mdbootstrap/js/mdb.js';

export default class PullRequestSize extends React.Component {
    constructor(props){
        super(props);

        
    }

    componentDidMount(){
        var self = this;
        if(this.props.url != null && this.props.url != '') {
                   
            let promisseUrls = this.getPullRequestUrls(this.props.url,self);
            promisseUrls.then(result => {
                let promisse = result.self.getPullRequestSizeData(result.urls,result.self)
                promisse.then(result2 => {
                    result2.self.makeChart(result2.data)
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
                    var data = JSON.parse(request.responseText);
                    let totalLines = data.additions + data.deletions;

                    if(totalLines <= 100){
                        quantitySmall += 1;
                        let createdDate = new Date(data.created_at);
                        let endDate = new Date(data.merged_at);
                        if(data.merged_at == null){
                            endDate = new Date(data.closed_at);
                        } 
                        let timeDiff = Math.abs(endDate.getTime() - createdDate.getTime());
                        let diffhours = timeDiff/1000/60/60;
                        totalDaysSmall = totalDaysSmall + diffhours;
                
                    }
                    else if(totalLines <= 1000){
                        quantityMedium += 1;
                        let createdDate = new Date(data.created_at);
                        let endDate = new Date(data.merged_at);
                        if(data.merged_at == null){
                            endDate = new Date(data.closed_at);
                        }               
                     
                        let timeDiff = Math.abs(endDate.getTime() - createdDate.getTime());
                        let diffhours = timeDiff/1000/60/60;
                        totalDaysMedium = totalDaysMedium + diffhours;
                        
                    }
                    else{
                        quantitylarge += 1;
                        let createdDate = new Date(data.created_at);
                        let endDate = new Date(data.merged_at);
                        if(data.merged_at == null){
                            endDate = new Date(data.closed_at);
                        }
                

                        let timeDiff = Math.abs(endDate.getTime() - createdDate.getTime());
                        let diffhours = timeDiff/1000/60/60;
                        totalDaysLarge = totalDaysLarge + diffhours;
                    }
                }
            }
    
            request.send();
        });

        let averageSmall = totalDaysSmall/quantitySmall == NaN ? 0 : parseFloat((totalDaysSmall/quantitySmall).toFixed(2));
        let averageMedium = totalDaysMedium/quantityMedium == NaN ? 0 : parseFloat((totalDaysMedium/quantityMedium).toFixed(2));
        let averageLarge = totalDaysLarge/quantitylarge == NaN ? 0 : parseFloat((totalDaysLarge/quantitylarge).toFixed(2));

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
        let page = 1;       

        let urls = [];

        let xhr = new XMLHttpRequest();
        xhr.open("GET",url + "/pulls?state=closed&page=" + page + "&per_page=100");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    let dataPullRequest = JSON.parse(xhr.responseText);

                    if (dataPullRequest != null && dataPullRequest.length > 0) {
                        
                        dataPullRequest.forEach(pullRequest => {
                            urls = urls.concat(pullRequest.url);
                        });

                        page = page + 1;
                        xhr.open("GET", url + "/pulls?state=closed&page=" + page + "&per_page=100");
                        xhr.send();
                    }
                    else{
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

    makeChart(datas){
        var ctx = document.getElementById("myChart").getContext('2d');
      
        var myChart = new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Small", "Medium", "Large"],
                datasets: [{
                    label: '# of Votes',
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
        return (
        <div class="col-md-12">
            <div class="shadow-component">
                <div class="head-component-6">
                    <span class="text-head">Average Pull Request Merge Time</span>
                </div>
                <div class="body-component-12">
                    <canvas id="myChart" height="180" width="500"></canvas>
                </div>
            </div>            
        </div>

        );
    }

}