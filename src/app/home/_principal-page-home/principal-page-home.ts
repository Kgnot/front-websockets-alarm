import {Component} from '@angular/core';
import {CoverMainComponent} from '../cover-main/cover-main.component';
import {AlarmSection} from '../alarm-section/alarm-section';

@Component({
  selector: 'app-principal-page-home',
  imports: [
    CoverMainComponent,
    AlarmSection
  ],
  templateUrl: './principal-page-home.html',
  styleUrl: './principal-page-home.scss'
})
export class PrincipalPageHome {

}
