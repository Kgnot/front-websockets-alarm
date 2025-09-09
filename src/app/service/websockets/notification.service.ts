import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {AlarmData} from '../../interfaces/alarm-data';
import {SoundAlarmService} from '../alarm/sound-alarm.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private alarmNotification = new Subject<AlarmData>()

  constructor(
    private soundAlarmService: SoundAlarmService,
  ) {
  }

  alarmNotification$ = this.alarmNotification.asObservable()

  notifyAlarm(alarm: AlarmData) {
    this.alarmNotification.next(alarm);
    this.soundAlarmService.playAlarmSound();
  }

}
