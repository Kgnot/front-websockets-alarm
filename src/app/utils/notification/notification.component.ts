import { Component, ElementRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AlarmData } from '../../interfaces/alarm-data';

@Component({
  selector: 'app-notification',
  imports: [DatePipe],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  @ViewChild('deleteDialog') deleteDialog!: ElementRef<HTMLDialogElement>;
  @Input({ required: true }) notification!: AlarmData;

  @Output() openModalEvent = new EventEmitter<AlarmData>();
  @Output() deleteNotification = new EventEmitter<AlarmData>();

  openModal(notification: AlarmData) {
    this.openModalEvent.emit(notification);
  }

  delete() {
      this.deleteNotification.emit(this.notification);
  }
}
