import { Component } from '@angular/core';
import {AlarmSection} from './alarm-section/alarm-section';
import {MapComponent} from '../../utils/map/map.component';

@Component({
  selector: 'app-dashboard-main',
  imports: [
    AlarmSection,
    MapComponent
  ],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.scss'
})
export class MainDashboardComponent {

}
