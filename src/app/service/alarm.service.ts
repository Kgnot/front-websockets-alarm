import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AlarmData} from '../interfaces/alarm-data';


@Injectable({
  providedIn: 'root'
})
// Las alarmas son quienes se comunican con el mapa
export class AlarmService {
  private alarmSubject = new BehaviorSubject<AlarmData[]>([]);
  alarms$ = this.alarmSubject.asObservable();

  private alarms: AlarmData[] = [];

  addAlarm(alarm: AlarmData) {
    this.alarms.push(alarm);
    this.alarmSubject.next(this.alarms);
    // quiza crear un servicio de sonido la cual ponga a trabajar sonidos de alarmas xd
  }

  updateAlarm(id: string, active: boolean) {
    this.alarms = this.alarms.map(s =>
      s.id === id ? {...s, active} : s
    );
    this.alarmSubject.next(this.alarms);
  }

  shutDownAlarm(id: string) {
    this.alarms = this.alarms.map(s =>
      s.id === id ? {...s, active: false} : s
    );
    this.alarmSubject.next(this.alarms)
  }

  clearAlarm(id: string) {
    this.alarms = this.alarms.filter(s => {
      if (s.id == id) {
        this.shutDownAlarm(s.id);
      }
      return s.id !== id
    });
    this.alarmSubject.next(this.alarms);
  }

  getCurrentAlarms(): AlarmData[] {
    return this.alarmSubject.getValue();
  }
}
