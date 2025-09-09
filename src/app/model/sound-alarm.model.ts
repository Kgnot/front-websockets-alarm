export class SoundAlarm {
  private dirSound = "assets/alarm.mp3";
  private alarmSound?: HTMLAudioElement;

  playAlarmSound() {
    if (typeof window !== 'undefined') {
      if (!this.alarmSound) {
        this.alarmSound = new Audio(this.dirSound);
      }
      this.alarmSound.play().catch(console.error);
    }
  }

  stopAlarmSound() {
    if (this.alarmSound) {
      this.alarmSound.pause();
      this.alarmSound.currentTime = 0;
    }
  }
}
