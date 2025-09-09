import {Component} from '@angular/core';
import {MapComponent} from './utils/map/map.component';

@Component({
  selector: 'app-root',
  imports: [
    MapComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App{
  }
