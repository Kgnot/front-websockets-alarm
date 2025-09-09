import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdecaStyleService {

  private readonly TILE_URL = "https://tiles.arcgis.com/tiles/J5ltM0ovtzXUbp7B/arcgis/rest/services/Mapa_Base_Bogot%C3%A1/VectorTileServer/tile/{z}/{y}/{x}.pbf";
  private readonly SPRITE_URL = "https://tiles.arcgis.com/tiles/J5ltM0ovtzXUbp7B/arcgis/rest/services/Mapa_Base_Bogot%C3%A1/VectorTileServer/resources/sprites/sprite.json";
  private readonly GLYPHS_URL = "https://tiles.arcgis.com/tiles/J5ltM0ovtzXUbp7B/arcgis/rest/services/Mapa_Base_Bogot%C3%A1/VectorTileServer/resources/fonts/{fontstack}/{range}.pbf";


  constructor() {
  }

  convert(idecaStyle: any): any {
    const style = JSON.parse(JSON.stringify(idecaStyle));

    // version
    if (!style.version) {
      style.version = 8; // MapLibre requiere version 8
    }

    // sources
    if (!style.sources) {
      style.sources = {};
    }

    // layers
    if (!Array.isArray(style.layers)) {
      style.layers = [];
    }

    // sources.esri
    if (style.sources?.esri) {
      style.sources.esri.tiles = [this.TILE_URL];
      delete style.sources.esri.url;
      delete style.sources.esri.scheme;
    }

    // sprites
    if (style.sprite?.startsWith('../')) {
      style.sprite = this.SPRITE_URL;
    }

    // glyphs
    if (style.glyphs?.startsWith('../')) {
      style.glyphs = this.GLYPHS_URL;
    }

    // layers
    if (Array.isArray(style.layers)) {
      style.layers = style.layers
        .map((layer: any) => {
          if (!layer.id || !layer.type || !layer.source) {
            console.warn('Capa inválida:', layer);
            return null;
          }
          return {
            ...layer,
            id: String(layer.id),
            type: String(layer.type),
            source: String(layer.source),
            layout: layer.layout || {},
            paint: this.cleanPaint(layer.paint)
          };
        })
        .filter((l: any) => l !== null);
    }

    return style;
  }


  private cleanPaint(paint: any): any {
    if (!paint || typeof paint !== 'object') return {};
    return Object.fromEntries(
      Object.entries(paint).filter(([_, v]) => v !== null && v !== undefined)
    );
  }

}
