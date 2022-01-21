import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [],
})
export class Grafica1Component {
  public labels1: string[] = ['Pan', 'Refresco', 'Tacos'];
  public data1 = {
    labels: this.labels1,
    datasets: [
      {
        data: [10, 15, 40],
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
}
