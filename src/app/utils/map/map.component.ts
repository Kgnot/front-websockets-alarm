import {AfterViewInit, Component, Inject, inject, PLATFORM_ID} from '@angular/core';
import * as maplibregl from 'maplibre-gl';
import {MapService} from '../../service/map.service';
import {IdecaStyleService} from '../../service/ideca-style.service';
import {AlarmPaintedService} from '../../service/alarm-painted.service';
import {AlarmService} from '../../service/alarm.service';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {

  private mapService = inject(MapService);
  private idecaStyleService = inject(IdecaStyleService);
  private alarmPaintedService = inject(AlarmPaintedService);
  private alarmService = inject(AlarmService);

  private map!: maplibregl.Map;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  async ngAfterViewInit(): Promise<void> {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.mapService.getIDECA_style().subscribe({
      next: (IDECA_style) => {
        const convertedStyle = this.idecaStyleService.convert(IDECA_style);

        this.map = new maplibregl.Map({
          container: 'map',
          style: convertedStyle,
          center: [-74.1169134, 4.554351],
          zoom: 18
        });

        this.map.addControl(new maplibregl.NavigationControl());

        this.map.on('load', () => {

          this.alarmService.alarms$.subscribe(alarmList => {
            alarmList.forEach(alarm => {
              if (alarm.active) {
                const lng = alarm.alarmUserDevice.location.lng;
                const lat = alarm.alarmUserDevice.location.lat;
                this.alarmPaintedService.paintSignal(this.map, alarm.id, lng, lat);
              } else {
                this.alarmPaintedService.clearSignal(alarm.id, this.map);
              }
            });
          });


        })
      },
      error: (error) => {
        console.error('Error al cargar el estilo IDECA:', error);
        this.createFallbackMap();
      }
    })

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
