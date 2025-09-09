import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private URL = "https://tiles.arcgis.com/tiles/J5ltM0ovtzXUbp7B/arcgis/rest/services/Mapa_Base_Bogot%C3%A1/VectorTileServer/resources/styles/root.json";
  private http = inject(HttpClient);
  private IDECA_style!: Observable<any[]>;

  getIDECA_style(): Observable<any[]> {
    if (!this.IDECA_style) {
      this.IDECA_style = this.http.get<any[]>(this.URL)
    }
    return this.IDECA_style;
  }

}
