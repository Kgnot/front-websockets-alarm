import {Injectable} from '@angular/core';
import * as maplibregl from 'maplibre-gl';

@Injectable({
  providedIn: 'root'
})
export class AlarmPaintedService {
  private markers: { [id: string]: maplibregl.Marker } = {};
  private intervals: { [id: string]: number } = {};

  paintSignal(map: maplibregl.Map, id: string, lng: number, lat: number, useAnimation: boolean = true) {
    if (useAnimation) {
      // Lógica de startAlarm - círculo animado
      this.clearSignal(id, map); // Limpiar primero

      const layerId = `alarm-layer-${id}`;
      const sourceId = `alarm-source-${id}`;

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
            properties: null
          }]
        }
      });

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

      // Animación de parpadeo
      let visible = true;
      this.intervals[id] = window.setInterval(() => {
        visible = !visible;
        map.setPaintProperty(layerId, 'circle-opacity', visible ? 1 : 0);
      }, 900);

    } else {
      // Lógica original - marker estático
      if (!this.markers[id]) {
        this.markers[id] = new maplibregl.Marker({color: '#9f384e'})
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
