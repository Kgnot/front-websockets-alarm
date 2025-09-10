import {Component} from '@angular/core';
import {PrincipalPageHome} from './home/_principal-page-home/principal-page-home';
import {Header} from './utils/header/header';
import {NavbarComponent} from './utils/navbar/navbar.component';
import {SoundManagerService} from './service/alarm/sound-manager.service';

@Component({
  selector: 'app-root',
  imports: [
    PrincipalPageHome,
    Header,
    NavbarComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  // instancia solamente para crear, no por usabilidad
  constructor(private soundManagerService: SoundManagerService) {
  }

}
