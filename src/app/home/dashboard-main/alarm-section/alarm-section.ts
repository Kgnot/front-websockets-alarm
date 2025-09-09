import {Component, ElementRef, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {WebsocketService} from '../../../service/web-socket.service';
import {ConnectionStatus} from '../../../interfaces/connection-status';
import {AlarmData} from '../../../interfaces/alarm-data';
import {Subscription} from 'rxjs';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-alarm-section',
  imports: [
    DatePipe
  ],
  templateUrl: './alarm-section.html',
  styleUrl: './alarm-section.scss'
})
export class AlarmSection implements OnInit, OnDestroy {

  protected alarmMessage = '';
  protected isConnected = signal<boolean>(false);
  protected connectionStatus = signal<ConnectionStatus>(ConnectionStatus.DISCONNECT);
  protected notifications = signal<AlarmData[]>([] as AlarmData[]);
  // para abrir un modal
  protected selected?: AlarmData;
  @ViewChild('alarmModal') alarmModal!: ElementRef<HTMLDialogElement>;
  // subscriptions:
  private notificationSubscription!: Subscription;
  private statusSubscription!: Subscription;

  constructor(private webSocketService: WebsocketService) {
  }

  ngOnDestroy(): void {
    this.notificationSubscription?.unsubscribe();
    this.statusSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.notificationSubscription = this.webSocketService.getAlarmNotifications().subscribe(
      notification => {
        this.notifications.update(notifications => [...notifications, notification]);
      }
    );

    this.statusSubscription = this.webSocketService.getConnectionStatus().subscribe(
      status => {
        this.connectionStatus.set(status);
        this.isConnected.set(
          status === ConnectionStatus.CONNECT || status === ConnectionStatus.REGISTER
        );
      }
    );
  }


  connect(): void {
    try {
      this.webSocketService.connect()
    } catch (error) {
      console.error('Error connecting:', error);
    }
  }

  disconnect(): void {
    this.webSocketService.disconnect();
  }

  openModal(notification: AlarmData) {
    this.selected = notification;
    this.alarmModal.nativeElement.showModal();
  }

  closeModal() {
    this.alarmModal.nativeElement.close();
  }

}
