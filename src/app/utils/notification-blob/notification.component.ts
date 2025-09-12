import {Component, Input, inject} from '@angular/core';
import {DatePipe, NgStyle} from '@angular/common';
import {AlarmData} from '../../interfaces/alarm-data';
import {AlarmFacade} from '../../service/alarm-facade';

@Component({
  selector: 'app-notification-blob',
  imports: [DatePipe, NgStyle],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  @Input({required: true}) notification!: AlarmData;
  private facade = inject(AlarmFacade);
  @Input() x!: number;
  @Input() y!: number;

  get positionStyle() {
    return {
      position: 'absolute',
      left: this.facade.notificationX() + 'px',
      top: this.facade.notificationY() + 'px',
      zIndex: 1000,
    };
  }

  close() {
    this.facade.closeNotification();
  }

  delete() {
    this.facade.deleteNotification(this.notification);
  }

  pause() {
    this.facade.updateNotification(this.notification);
  }
}
