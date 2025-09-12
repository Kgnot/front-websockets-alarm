import {Injectable} from '@angular/core';
import * as maplibregl from 'maplibre-gl';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlarmPaintedService {
  private markers: { [id: string]: maplibregl.Marker } = {};
  private intervals: { [id: string]: number } = {};

  //
  private alarmClickSubject = new Subject<{ alarmId: string, x: number, y: number }>();
  alarmClick$ = this.alarmClickSubject.asObservable();


  paintSignal(map: maplibregl.Map, alarmId: string, lng: number, lat: number, useAnimation: boolean = true) {
    if (useAnimation) {
      this.clearSignal(alarmId, map);

      const layerId = `alarm-layer-${alarmId}`;
      const sourceId = `alarm-source-${alarmId}`;

      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [lng, lat]
              },
              properties: {
                id: alarmId
              }
            }]
          }
        });
      }

      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: 'circle',
          source: sourceId,
          paint: {
            'circle-radius': 6.5,
            'circle-color': '#c25757',
            'circle-stroke-color': '#ce9393',
            'circle-stroke-width': 2,
            'circle-opacity': 1
          }
        });
      }

      map.on('click', layerId, (e: any) => {
        this.alarmClickSubject.next({
          alarmId: alarmId,
          x: e.point.x,
          y: e.point.y
        });
      });


      // Animación de parpadeo
      let visible = true;
      this.intervals[alarmId] = window.setInterval(() => {
        visible = !visible;
        map.setPaintProperty(layerId, 'circle-opacity', visible ? 1 : 0);
      }, 900);

    } else {
      // Lógica original - marker estático
      if (!this.markers[alarmId]) {
        this.markers[alarmId] = new maplibregl.Marker({color: '#9f384e'})
          .setLngLat([lng, lat])
          .addTo(map);
      }
    }
  }

  clearSignal(id: string, map: maplibregl.Map) {
    // Limpiar intervalo si existe
    if (this.intervals[id]) {
      clearInterval(this.intervals[id]);
      delete this.intervals[id];
    }

    // Limpiar layer animado si existe
    const layerId = `alarm-layer-${id}`;
    const sourceId = `alarm-source-${id}`;

    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }

    // Limpiar marker si existe
    if (this.markers[id]) {
      this.markers[id].remove();
      delete this.markers[id];
    }
  }
}
