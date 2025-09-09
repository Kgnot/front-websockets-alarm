import {Component} from '@angular/core';
import {MapComponent} from './utils/map/map.component';
import {PrincipalPageHome} from './home/_principal-page-home/principal-page-home';
import {Header} from './utils/header/header';
import {CoverMainComponent} from './home/cover-main/cover-main.component';
import {NavbarComponent} from './utils/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [
    MapComponent,
    PrincipalPageHome,
    Header,
    CoverMainComponent,
    NavbarComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App{
  }
