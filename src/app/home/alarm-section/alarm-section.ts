import {Component} from '@angular/core';
import {ConnectSection} from './connect-section/connect-section';
import {SilenceAlarm} from './silence-alarm/silence-alarm';
import {AllAlarms} from './all-alarms/all-alarms';

@Component({
  selector: 'app-alarm-section',
  imports: [
    ConnectSection,
    SilenceAlarm,
    AllAlarms
  ],
  templateUrl: './alarm-section.html',
  styleUrl: './alarm-section.scss'
})
export class AlarmSection {}
