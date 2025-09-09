import {Component} from '@angular/core';
import {MapComponent} from './utils/map/map.component';
import {PrincipalPageHome} from './home/principal-page-home/principal-page-home';

@Component({
  selector: 'app-root',
  imports: [
    MapComponent,
    PrincipalPageHome
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App{
  }
