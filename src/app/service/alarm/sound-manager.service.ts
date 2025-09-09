import {Injectable} from '@angular/core';
import {AlarmService} from '../alarm.service';
import {AlarmData} from '../../interfaces/alarm-data';

@Injectable({providedIn: 'root'})
export class SoundManagerService {

  private soundEnabled = true;
  private alarmSounds = new Map<string, HTMLAudioElement>();

  constructor(private alarmService: AlarmService) {
    this.alarmService.alarms$.subscribe(alarms => {
      alarms.forEach(alarm => {
        if (alarm.active && this.soundEnabled) {
          this.playAlarm(alarm);
        } else {
          this.stopAlarm(alarm.id);
        }
      });
    });
  }

  private playAlarm(alarm: AlarmData) {
    if (!this.alarmSounds.has(alarm.id)) {
      const audio = new Audio("assets/alarm.mp3");
      audio.loop = true;
      audio.play().catch(console.error);
      this.alarmSounds.set(alarm.id, audio);
    } else {
      const audio = this.alarmSounds.get(alarm.id)!;
      if (audio.paused) audio.play().catch(console.error);
    }
  }

  private stopAlarm(alarmId: string) {
    const audio = this.alarmSounds.get(alarmId);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      this.alarmSounds.delete(alarmId);
    }
  }

  toggleSound(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled) {
      this.alarmSounds.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
      this.alarmSounds.clear();
    } else {
      // Reproducir todas las activas
      this.alarmService.getCurrentAlarms().forEach(alarm => {
        if (alarm.active) this.playAlarm(alarm);
      });
    }
  }
}
