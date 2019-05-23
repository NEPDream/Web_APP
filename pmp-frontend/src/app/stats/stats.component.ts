import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { StatsService } from '../services/stats.service';
import * as Highcharts from 'highcharts';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  list_project = [];
  selected_project= '';

  constructor(private _projServ: ProjectService, private _StatsService: StatsService) { }

  ngOnInit() {

    //init the lists project
    this._projServ.listProjects().subscribe(
      data => {
        this.list_project = data['projects'];
      },
      error =>{
        console.log('unable to retrieve project list');
      }
    );

    // Highcharts.chart('container_sprint', this.options_sprint);
    // Highcharts.chart('container_issue', this.options_issue);
    // Highcharts.chart('container_user', this.option_users);
  }

  public options_sprint: any = {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Tasks per Sprint on project'
    },
    subtitle: {
        text: 'Follow up'
    },
    xAxis: {
        categories: [
            'Input Queue',
            'Requirements Gathering',
            'Work In Progress',
            'Quality Assurance',
            'Done'
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Number of Task'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Sprint1',
        data: [49.9, 71.5, 106.4, 129.2, 144.0]

    }, {
        name: 'Sprint2',
        data: [83.6, 78.8, 98.5, 93.4, 106.0]

    }, {
        name: 'Sprint3',
        data: [48.9, 38.8, 39.3, 41.4, 47.0]

    }, {
        name: 'Sprint4',
        data: [42.4, 33.2, 34.5, 39.7, 52.6]

    }]
  }

  public options_issue: any = {
    chart: {
        type: 'line'
    },
    title: {
        text: 'issues on project'
    },
    xAxis: {
        categories: [
            'Input Queue',
            'Requirements Gathering',
            'Work In Progress',
            'Quality Assurance',
            'User Acceptance',
            'Done'
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Number of Task'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'project1',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 100]
    }]
  }

  public option_users: any = {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'User Task Repartition On Project'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                connectorColor: 'silver'
            }
        }
    },
    series: [{
        name: 'Share',
        data: [
            { name: 'Chrome', y: 61.41 },
            { name: 'Internet Explorer', y: 11.84 },
            { name: 'Firefox', y: 10.85 },
            { name: 'Edge', y: 4.67 },
            { name: 'Safari', y: 4.18 },
            { name: 'Other', y: 7.05 }
        ]
    }]
}


public displayStats():void{
  console.log(this.selected_project);
  var project_id = JSON.parse(this.selected_project)['id'];
  // stats for sprint
  this._StatsService.sprintstats(project_id).subscribe(
    data => {
      console.log(data);
      this.options_sprint.series = data['projects'];
      Highcharts.chart('container_sprint', this.options_sprint);
    },
    error => {
      console.log(error);
    }
  );

   //  stats for issue
   this._StatsService.issuestats(project_id).subscribe(
    data => {
      console.log(data);
      this.options_issue.series = data['projects'];
      Highcharts.chart('container_issue', this.options_issue);
    },
    error => {
      console.log(error);
    }
  );
}

}
