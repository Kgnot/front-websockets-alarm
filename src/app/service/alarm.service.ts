import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AlarmData} from '../interfaces/alarmData';


@Injectable({
  providedIn: 'root'
})
export class AlarmService {
  private signalsSubject = new BehaviorSubject<AlarmData[]>([]);
  signals$ = this.signalsSubject.asObservable();

  private signals: AlarmData[] = [];

  addSignal(signal: AlarmData) {
    this.signals.push(signal);
    this.signalsSubject.next(this.signals);
  }

  updateSignal(id: string, active: boolean) {
    this.signals = this.signals.map(s =>
      s.id === id ? { ...s, active } : s
    );
    this.signalsSubject.next(this.signals);
  }

  clearSignal(id: string) {
    this.signals = this.signals.filter(s => s.id !== id);
    this.signalsSubject.next(this.signals);
  }
}
