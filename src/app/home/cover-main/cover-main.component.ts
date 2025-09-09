import { Component } from '@angular/core';
import {SlideComponent} from '../slide/slide.component';
import {MainDashboardComponent} from '../dashboard-main/main-dashboard.component';

@Component({
  selector: 'app-cover-dashboard-main',
  imports: [
    SlideComponent,
    MainDashboardComponent
  ],
  templateUrl: './cover-main.component.html',
  styleUrl: './cover-main.component.scss'
})
export class CoverMainComponent {

}
