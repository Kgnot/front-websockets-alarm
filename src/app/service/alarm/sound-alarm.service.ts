import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundAlarmService {
  private alarmSound = new Audio('assets/alarm.mp3'); // TODO: Realizar un espacio para todos estos elementos, centralizarlo

  playAlarmSound() {
    this.alarmSound.play().catch(
      error => {
        console.error("Error playing sound", error)
      }
    );
  }

  stopAlarmSound() {
    this.alarmSound.pause();
    this.alarmSound.currentTime = 0;
  }

}
