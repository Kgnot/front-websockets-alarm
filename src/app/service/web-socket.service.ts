import {Injectable} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {ConnectionStatus} from '../interfaces/connection-status';
import {NotificationService} from './websockets/notification.service';
import {ConnectionStatusService} from './websockets/connection-status.service';
import {UserService} from './user/user.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: Socket;
  //private readonly serverUrl = 'http://localhost:3000';
  private readonly serverUrl = 'https://websocket-alarm.onrender.com';

  constructor(
    private connectionStatusService: ConnectionStatusService,
    private notificationService: NotificationService,
    private userService: UserService,
  ) {
    this.socket = io(this.serverUrl, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });
    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    this.socket.on('connect', () => {
      console.info('Connected to Socket.IO server');
      this.connectionStatusService.updateStatus(ConnectionStatus.CONNECT);

      // Una vez conectado, registrarse automáticamente
      this.registerWithServer();
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      this.connectionStatusService.updateStatus(ConnectionStatus.DISCONNECT);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.connectionStatusService.updateStatus(ConnectionStatus.CONNECTION_ERROR);
    });

    this.socket.on('request-register', (data: any) => {
      console.log('Server requested registration:', data);
      this.registerWithServer();
    });

    this.socket.on('registered', (data: any) => {
      console.log('Registered successfully:', data);
      this.connectionStatusService.updateStatus(ConnectionStatus.REGISTER);
    });

    // Eventos de la alarma

    this.socket.on('alarm', (backendData: any) => {
      const data = backendData.data;
      console.log("Estoy en socket",data)
      console.log('Alarm response received:', data);
      this.notificationService.notifyAlarm(data);

    });

    this.socket.on('alarm_notification', (backendData: any) => {
      const data = backendData.data;
      console.log('Alarm notification-blob received:', data);
      this.notificationService.notifyAlarm(data);
    });

    this.socket.on('alarm_broadcast', (backendData: any) => {
      console.log("Alarm Boradcast") // TODO, ver el servidor si es que lo envio a alarm_broadcast
      const data = backendData.data;
      console.log("DATA: ",data)
      this.notificationService.notifyAlarm(data);

    });
  }

  private registerWithServer(): void {
    if (this.socket.connected) {
      this.socket.emit('request-register', this.userService);
      console.log('Sending registration data:', this.userService);
    }
  }


  connect(): void {
    if (!this.socket.connected) {
      this.connectionStatusService.updateStatus(ConnectionStatus.CONNECTING);
      this.socket.connect();
    }
  }

  disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
      this.connectionStatusService.updateStatus(ConnectionStatus.DISCONNECT);
    }
  }

  sendAlarm(message: any): void {
    if (this.socket.connected) {
      const alarmData = {
        text: message,
        timestamp: new Date().toISOString(),
        priority: 'high',
        ...message
      };
      this.socket.emit('alarm', alarmData);
      console.log('Alarm sent:', alarmData);
    } else {
      console.error('Socket not connected');
      throw new Error('Not connected to server');
    }
  }

  send(event: string, data: any): void {
    if (this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.error('Socket not connected');
      throw new Error('Not connected to server');
    }
  }

  getAlarmNotifications() {
    return this.notificationService.getObservable();
  }

  getConnectionStatus() {
    return this.connectionStatusService.getObservable();
  }

  isConnected(): boolean {
    return this.socket.connected;
  }

}
