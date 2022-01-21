import { Component, Input } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styles: [],
})
export class DonutComponent {
  @Input() title: string = 'Sin titulo';

  @Input('labels') doughnutChartLabels: string[] = [
    'Label 1',
    'Label 2',
    'Label 3',
  ];
  @Input('data') doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [350, 450, 100],
        backgroundColor: ['#6857E6', '#009FEE', '#FF3414'],
        hoverBackgroundColor: ['#6857E6', '#009FEE', '#FF3414'],
        hoverBorderColor: [
          'rgb(200,255,255)',
          'rgb(200,255,255)',
          'rgb(200,255,255)',
        ],
      },
    ],
  };
  public doughnutChartType: ChartType = 'doughnut';
}
