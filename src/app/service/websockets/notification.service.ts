import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {AlarmData} from '../../interfaces/alarm-data';
import {AlarmService} from '../alarm.service';
import {adaptBackendToAlarmData} from '../../adapter/alarm-data-adapter';

@Injectable({
  providedIn: 'root'
})
// Notifica que llego una alarma
export class NotificationService {
  private alarmNotification = new Subject<AlarmData>()

  constructor(
    private alarmService: AlarmService
  ) {
  }

  notifyAlarm(alarmBackend: any) {
    const alarm: AlarmData = adaptBackendToAlarmData(alarmBackend);
    this.alarmService.addAlarm(alarm);
    this.alarmNotification.next(alarm);
  }

  getObservable() {
    return this.alarmNotification.asObservable();
  }

}
