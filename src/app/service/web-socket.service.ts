import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: Socket;
  private messageSubject = new Subject<string>();
  private alarmNotificationSubject = new Subject<any>();
  private connectionStatusSubject = new Subject<string>();

  // private serverUrl = 'http://localhost:3000';
  private serverUrl = 'https://websocket-alarm.onrender.com';

  private clientInfo: any = {
    name: 'Angular Client',
    role: 'cai', // O el rol que corresponda
    location: 'Central Station'
  };

  constructor() {
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
      this.connectionStatusSubject.next('Connected');

      // Una vez conectado, registrarse automáticamente
      this.registerWithServer();
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      this.connectionStatusSubject.next('Disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.connectionStatusSubject.next('Connection Error');
    });

    this.socket.on('request-register', (data: any) => {
      console.log('Server requested registration:', data);
      this.registerWithServer();
    });

    this.socket.on('registered', (data: any) => {
      console.log('Registered successfully:', data);
      this.connectionStatusSubject.next('Registered');
    });

    this.socket.on('alarm', (data: any) => {
      console.log('Alarm response received:', data);
      this.messageSubject.next(JSON.stringify(data));

      if (data.status === 'received') {
        this.playAlarmSound();
      }
    });

    this.socket.on('alarm_notification', (data: any) => {
      console.log('Alarm notification received:', data);
      this.alarmNotificationSubject.next(data);
      this.playAlarmSound(); // Reproducir sonido para notificaciones
    });

    this.socket.on('alarm_broadcast', (data: any) => {
      console.log('Broadcast alarm received:', data);
      this.alarmNotificationSubject.next(data);
      this.playAlarmSound();

    });
  }

  private registerWithServer(): void {
    if (this.socket.connected) {
      this.socket.emit('request-register', this.clientInfo);
      console.log('Sending registration data:', this.clientInfo);
    }
  }

  private playAlarmSound(): void {
    const audio = new Audio('assets/alarm.mp3');
    audio.play().catch(err => console.error('Error playing sound:', err));
  }

  connect(): void {
    if (!this.socket.connected) {
      this.connectionStatusSubject.next('Connecting...');
      this.socket.connect();
    }
  }

  disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
      this.connectionStatusSubject.next('Disconnected');
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

  updateClientInfo(info: Partial<{name: string, role: string, location: any}>): void {
    this.clientInfo = { ...this.clientInfo, ...info };

    if (this.socket.connected) {
      this.registerWithServer();
    }
  }

  getMessage() {
    return this.messageSubject.asObservable();
  }

  getAlarmNotifications() {
    return this.alarmNotificationSubject.asObservable();
  }

  getConnectionStatus() {
    return this.connectionStatusSubject.asObservable();
  }

  isConnected(): boolean {
    return this.socket.connected;
  }

  getClientInfo() {
    return { ...this.clientInfo };
  }
}
