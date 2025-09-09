import {Injectable} from '@angular/core';
import * as maplibregl from 'maplibre-gl';

@Injectable({
  providedIn: 'root'
})
export class AlarmPaintedService {
  private markers: { [id: string]: maplibregl.Marker } = {};

  paintSignal(map: maplibregl.Map, id: string, lng: number, lat: number) {
    if (!this.markers[id]) {
      this.markers[id] = new maplibregl.Marker({ color: '#9f384e' })
        .setLngLat([lng, lat])
        .addTo(map);
    }
  }

  clearSignal(id: string, map: maplibregl.Map) {
    if (this.markers[id]) {
      this.markers[id].remove();
      delete this.markers[id];
    }
  }
}
