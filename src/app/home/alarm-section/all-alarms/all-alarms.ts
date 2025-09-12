import {Component, OnInit, signal} from '@angular/core';
import {AlarmData} from '../../../interfaces/alarm-data';
import {filter, Subscription} from 'rxjs';
import {AlarmService} from '../../../service/alarm.service';
import {AlarmElement} from '../../../utils/alarm-element/alarm-element';

@Component({
  selector: 'app-all-alarms',
  imports: [
    AlarmElement
  ],
  templateUrl: './all-alarms.html',
  styleUrl: './all-alarms.scss'
})
export class AllAlarms implements OnInit {

  protected alarms = signal<AlarmData[]>([] as AlarmData[])
  private notificationSubscription!: Subscription;
  protected showAlarms = signal<boolean>(false);

  constructor(private alarmService: AlarmService) {
  }

  ngOnInit() {
    this.notificationSubscription = this.alarmService.alarms$.subscribe(alarms => {
      const filterAlarms = alarms.filter(alarm => alarm.active);

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
