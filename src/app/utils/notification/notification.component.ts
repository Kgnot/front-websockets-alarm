import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {DatePipe, NgStyle} from '@angular/common';
import {AlarmData} from '../../interfaces/alarm-data';
import {AlarmService} from '../../service/alarm.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-notification',
  imports: [DatePipe, NgStyle],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit {
  @Input({required: true}) notification: AlarmData | undefined;
  @Output() openModalEvent = new EventEmitter<AlarmData>();
  @Output() deleteNotification = new EventEmitter<AlarmData>();
  @Input() x: number = 0;
  @Input() y: number = 0;

  private alarmSub?: Subscription;

  constructor(private alarmService: AlarmService) {
  }

  get positionStyle() {
    return {
      position: 'absolute',
      left: this.x + 'px',
      top: this.y + 'px',
      zIndex: 1000
    };
  }

  ngOnInit(): void {
    this.alarmSub = this.alarmService.alarms$.subscribe(alarms => {
      const alarm = alarms.find(a => a.id === this.notification?.id);
      if (alarm) {
        this.notification = {...alarm}; // actualizar localmente
      }
    });
  }

  ngOnDestroy(): void {
    this.alarmSub?.unsubscribe();
  }

  openModal() {
    this.openModalEvent.emit(this.notification);
  }

  delete() {
    if (this.notification) {
      this.alarmService.clearAlarm(this.notification.id);
      this.deleteNotification.emit(this.notification);
    }
  }

  pause() {
    if (this.notification)
      this.alarmService.updateAlarm(this.notification.id, !this.notification.active);
  }
}
