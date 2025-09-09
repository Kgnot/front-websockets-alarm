import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {ConnectionStatus} from '../../interfaces/connection-status';

@Injectable({
  providedIn: 'root'
})
export class ConnectionStatusService {
  private statusSubject = new Subject<ConnectionStatus>();

  status$ = this.statusSubject.asObservable();

  updateStatus(newStatus: ConnectionStatus) {
    this.statusSubject.next(newStatus);
  }
}
