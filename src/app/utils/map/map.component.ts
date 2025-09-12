import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  inject,
  OnDestroy,
  PLATFORM_ID, ViewChild
} from '@angular/core';
import * as maplibregl from 'maplibre-gl';
import {MapService} from '../../service/map.service';
import {IdecaStyleService} from '../../service/ideca-style.service';
import {AlarmPaintedService} from '../../service/alarm-painted.service';
import {AlarmService} from '../../service/alarm.service';
import {isPlatformBrowser} from '@angular/common';
import {NotificationComponent} from '../notification-blob/notification.component';
import {AlarmFacade} from '../../service/alarm-facade';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-map',
  imports: [
    NotificationComponent
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit, OnDestroy {

  private mapService = inject(MapService);
  private idecaStyleService = inject(IdecaStyleService);
  private alarmPaintedService = inject(AlarmPaintedService);
  private alarmService = inject(AlarmService);
  protected facade = inject(AlarmFacade)

  private alarmClickSub?: Subscription; // la dejo por si en un futuro se pasa algo
  private renderAlarmsSub?: Subscription;

  private map!: maplibregl.Map;
  @ViewChild('map', {static: true}) mapContainer!: ElementRef<HTMLDivElement>;


  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  ngOnDestroy() {
    this.alarmClickSub?.unsubscribe();
    this.renderAlarmsSub?.unsubscribe();
    if (this.map) this.map.remove();
  }

  async ngAfterViewInit(): Promise<void> {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.mapService.getIDECA_style().subscribe({
      next: (IDECA_style) => {
        const convertedStyle = this.idecaStyleService.convert(IDECA_style);

        if (!this.map) {
          this.map = new maplibregl.Map({
            container: this.mapContainer.nativeElement,
            style: convertedStyle,
            center: [-74.1169134, 4.554351],
            zoom: 18
          });

          this.map.addControl(new maplibregl.NavigationControl());

          this.alarmPaintedService.setMap(this.map);

          this.map.on('load', () => {
            this.listenAlarmClicks();
            this.renderAlarms();
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar el estilo IDECA:', error);
        this.createFallbackMap();
      }
    })

  }

  private listenAlarmClicks(): void {
    this.alarmPaintedService.alarmClick$.subscribe(({alarmId, x, y}) => {
      const clickedAlarm = this.facade.getAlarmById(alarmId);
      if (!clickedAlarm) return;
      this.facade.toggleNotification(clickedAlarm, x, y);
    });
  }

  private renderAlarms(): void {
    this.renderAlarmsSub?.unsubscribe();

    this.renderAlarmsSub = this.alarmService.alarms$.subscribe(alarmList => {
      alarmList.forEach(alarm => {
        if (alarm.active) {
          const {lng, lat} = alarm.alarmUserDevice.location;
          this.alarmPaintedService.paintSignal(alarm.id, lng, lat);
        } else {
          this.alarmPaintedService.clearSignal(alarm.id, this.map);
        }
      });
    });
  }

  private createFallbackMap(): void {
    const map = new maplibregl.Map({
      container: 'map',
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [{
          id: 'osm-layer',
          type: 'raster',
          source: 'osm'
        }]
      },
      center: [-74.1, 4.65],
      zoom: 12
    });

    map.addControl(new maplibregl.NavigationControl());

  }
}
