import {AfterViewInit, Component, inject} from '@angular/core';
import * as maplibregl from 'maplibre-gl';
import {MapService} from '../../service/map.service';
import {IdecaStyleService} from '../../service/ideca-style.service';
import {AlarmPaintedService} from '../../service/alarm-painted.service';
import {AlarmService} from '../../service/alarm.service';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {

  private mapService = inject(MapService);
  private idecaStyleService = inject(IdecaStyleService);
  private alarmService = inject(AlarmPaintedService);
  private signalService = inject(AlarmService);

  private map!: maplibregl.Map;

  async ngAfterViewInit(): Promise<void> {

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

          this.signalService.signals$.subscribe(signals => {
            signals.forEach(signal => {
              if (signal.active) {
                this.alarmService.paintSignal(this.map, signal.id, signal.lng, signal.lat);
              } else {
                this.alarmService.clearSignal(signal.id, this.map);
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
