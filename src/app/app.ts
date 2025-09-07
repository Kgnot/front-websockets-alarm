import {Component, OnDestroy, OnInit, signal,} from '@angular/core';
import {Subscription} from 'rxjs';
import {WebsocketService} from './service/web-socket.service';
import {DatePipe, JsonPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    DatePipe,
    JsonPipe,
    FormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {

  protected alarmMessage = '';
  protected messageList = signal<any[]>([]);
  protected notifications = signal<any[]>([]);
  protected connectionStatus = signal('Disconnected');
  protected clientInfo = signal<any>({});
  protected isConnected = signal(false);

  private messageSubscription!: Subscription;
  private notificationSubscription!: Subscription;
  private statusSubscription!: Subscription;

  constructor(private webSocketService: WebsocketService) {
  }

  ngOnInit(): void {
    // Suscribirse a respuestas de alarmas
    this.messageSubscription = this.webSocketService.getMessage().subscribe(
      message => {
        this.messageList.update(messages => [...messages, message]);
      }
    );

    this.notificationSubscription = this.webSocketService.getAlarmNotifications().subscribe(
      notification => {
        this.notifications.update(notifs => [notification, ...notifs]);
      }
    );

    this.statusSubscription = this.webSocketService.getConnectionStatus().subscribe(
      status => {
        this.connectionStatus.set(status);
        this.isConnected.set(status === 'Connected' || status === 'Registered');
      }
    );

    this.clientInfo.set(this.webSocketService.getClientInfo());
  }

  connect(): void {
    try {
      this.webSocketService.connect();
    } catch (error) {
      console.error('Error connecting:', error);
      alert('Error al conectar: ' + error);
    }
  }

  sendAlarmMessage(): void {
    if (!this.alarmMessage.trim()) {
      alert('Por favor ingresa un mensaje de alarma');
      return;
    }

    try {
      this.webSocketService.sendAlarm({
        text: this.alarmMessage,
        timestamp: new Date().toISOString(),
        emergency: true
      });
      this.alarmMessage = ''; // Limpiar input
    } catch (error) {
      console.error('Error sending alarm:', error);
      alert('Error al enviar alarma: ' + error);
    }
  }

  disconnect(): void {
    this.webSocketService.disconnect();
  }

  updateClientInfo(): void {
    const newName = prompt('Nuevo nombre:', this.clientInfo().name);
    const newRole = prompt('Nuevo rol:', this.clientInfo().role);

    if (newName && newRole) {
      this.webSocketService.updateClientInfo({
        name: newName,
        role: newRole
      });
      this.clientInfo.set(this.webSocketService.getClientInfo());
    }
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
    this.disconnect();
  }
}
