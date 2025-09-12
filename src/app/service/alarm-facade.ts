import {inject, Injectable, signal} from '@angular/core';
import { AlarmService } from './alarm.service';
import {AlarmData} from '../interfaces/alarm-data';

@Injectable({ providedIn: 'root' })
export class AlarmFacade {
  private alarmService = inject(AlarmService);

  selectedAlarm = signal<AlarmData | undefined>(undefined);
  showNotification = signal(false);
  notificationX = signal(0);
  notificationY = signal(0);

  toggleNotification(alarm: AlarmData, x: number, y: number) {
    console.log("Desplegamos la animación")
    if (this.showNotification() && this.selectedAlarm()?.id === alarm.id) {
      this.closeNotification();
    } else {
      this.selectedAlarm.set(alarm);
      this.notificationX.set(x + 30);
      this.notificationY.set(y - 50);
      this.showNotification.set(true);
    }
  }

  closeNotification() {
    this.showNotification.set(false);
    this.selectedAlarm.set(undefined);
  }

  deleteNotification(alarm: AlarmData) {
    this.alarmService.clearAlarm(alarm.id);
    this.closeNotification();
  }

  updateNotification(alarm: AlarmData) {
    this.alarmService.updateAlarm(alarm.id, !alarm.active);
  }

  getAlarmById(id: string) {
    return this.alarmService.getAlarmById(id);
  }
}
