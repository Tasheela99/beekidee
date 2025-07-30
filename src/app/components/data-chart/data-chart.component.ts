import {AfterViewInit, Component, inject, OnInit, ViewChild} from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,           // ✅ ADD THIS
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexStroke,
  ApexFill
} from "ng-apexcharts";

import {MatCard, MatCardContent} from "@angular/material/card";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {NgIf} from "@angular/common";
import {ConsoleService} from "../../services/console.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis; // ✅ ADD THIS
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  fill?: ApexFill;
  dataLabels: ApexDataLabels;
};


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  markers: ApexMarkers;
  colors: string[];
  fill: ApexFill;
  forecastDataPoints: ApexForecastDataPoints;
  legend: ApexLegend;
};

@Component({
  selector: 'app-data-chart',
  standalone: true,
  imports: [
    ChartComponent,
    MatCard,
    MatCardContent,
    NgIf
  ],
  templateUrl: './data-chart.component.html',
  styleUrl: './data-chart.component.scss'
})
export class DataChartComponent implements AfterViewInit, OnInit {
  longText: string = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus ad consequuntur deleniti deserunt doloribus earum eum impedit ipsa molestiae nam nulla odit, officiis porro reprehenderit.\n';
  @ViewChild("chart-boys") chart!: ChartComponent;
  @ViewChild("chart-girls") chartGirls!: ChartComponent;
  @ViewChild("chart-bar") barChart!: ChartComponent;
  public chartOptions!: ChartOptions;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  private console = inject(ConsoleService)

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngOnInit() {
    this.console.getAllResults().subscribe(results => {
      const session001: { x: string; y: number }[] = [];
      const session002: { x: string; y: number }[] = [];

      results.forEach((item: any) => {
        const dataPoint = {
          x: item.studentName, // or use timestamp if needed
          y: item.marks
        };

        if (item.sessionId === "001") {
          session001.push(dataPoint);
        } else if (item.sessionId === "002") {
          session002.push(dataPoint);
        }
      });

      this.chartOptions = {
        series: [
          {
            name: "Session 001",
            data: session001
          },
          {
            name: "Session 002",
            data: session002
          }
        ],
        chart: {
          type: "line",
          height: 350,
          zoom: { enabled: true }
        },
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: "smooth"
        },
        title: {
          text: "Session-wise Marks Comparison"
        },
        xaxis: {
          title: {
            text: "Student Name"
          }
        },
        yaxis: {
          title: {
            text: "Marks"
          },
          min: 0
        }
      };
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
