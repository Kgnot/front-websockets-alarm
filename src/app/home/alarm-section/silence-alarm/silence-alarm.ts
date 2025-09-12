import {Component, OnInit, signal} from '@angular/core';
import {AlarmElement} from '../../../utils/alarm-element/alarm-element';
import {AlarmData} from '../../../interfaces/alarm-data';
import {filter, Subscription} from 'rxjs';
import {AlarmService} from '../../../service/alarm.service';

@Component({
  selector: 'app-silence-alarm',
  imports: [
    AlarmElement
  ],
  templateUrl: './silence-alarm.html',
  styleUrl: './silence-alarm.scss'
})
export class SilenceAlarm implements OnInit {

  protected alarms = signal<AlarmData[]>([] as AlarmData[])
  private notificationSubscription!: Subscription;
  protected showAlarms = signal<boolean>(false);

  constructor(private alarmService: AlarmService) {
  }

  ngOnInit() {
    this.notificationSubscription = this.alarmService.alarms$.subscribe(alarms => {
      const filterAlarms = alarms.filter(alarm => !alarm.active);
      this.alarms.set(filterAlarms);
    })
  }

  changeValueToggleAlarm() {
    this.showAlarms.update(showAlarms => !showAlarms)
  }

  deleteAlarm(alarmToDelete: AlarmData) {
    this.alarms.update(alarms => alarms.filter(n => n.id !== alarmToDelete.id)
    )
  }
}
