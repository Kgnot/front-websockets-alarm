import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AlarmData} from '../../interfaces/alarm-data';
import {Subscription} from 'rxjs';
import {AlarmService} from '../../service/alarm.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-alarm-element',
  imports: [
    DatePipe
  ],
  templateUrl: './alarm-element.html',
  styleUrl: './alarm-element.scss'
})
export class AlarmElement implements OnInit {
  @Input({required: true}) alarm: AlarmData | undefined;
  @Output() deleteAlarm = new EventEmitter<AlarmData>();

  private alarmSub?: Subscription;

  constructor(private alarmService: AlarmService) {
  }

  ngOnInit(): void {
    this.alarmSub = this.alarmService.alarms$.subscribe(alarms => {
      const alarm = alarms.find(a => a.id === this.alarm?.id);
      if (alarm) {
        this.alarm = {...alarm};
      }
    });
  }

  ngOnDestroy(): void {
    this.alarmSub?.unsubscribe();
  }


  delete() {
    if (this.alarm) {
      this.alarmService.clearAlarm(this.alarm.id);
      this.deleteAlarm.emit(this.alarm);
    }
  }

  pause() {
    if (this.alarm)
      this.alarmService.updateAlarm(this.alarm.id, !this.alarm.active);
  }
}
