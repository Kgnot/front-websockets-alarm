import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {ConnectionStatus} from '../../../interfaces/connection-status';
import {Subscription} from 'rxjs';
import {WebsocketService} from '../../../service/web-socket.service';

@Component({
  selector: 'app-connect-section',
  imports: [],
  templateUrl: './connect-section.html',
  styleUrl: './connect-section.scss'
})
export class ConnectSection implements OnInit, OnDestroy {
  protected isConnected = signal<boolean>(false);
  protected connectionStatus = signal<ConnectionStatus>(ConnectionStatus.DISCONNECT);
  private notificationSubscription!: Subscription;
  private statusSubscription!: Subscription;

  constructor(
    private webSocketService: WebsocketService) {
  }

  ngOnDestroy(): void {
    this.notificationSubscription?.unsubscribe();
    this.statusSubscription?.unsubscribe();
  }

  ngOnInit(): void {
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



}
