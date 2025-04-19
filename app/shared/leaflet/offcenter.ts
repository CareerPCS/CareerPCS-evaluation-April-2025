/* eslint-disable */

import {
  CRS,
  DivIcon,
  latLng,
  LatLngBounds,
  Map,
  Point,
  divIcon,
} from "~/libs.client/leaflet.client";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  MarkerClusterGroup,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvent,
  ZoomControl,
} from "~/libs.client/react-leaflet.client";

export type SafeareaOffsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export const Offcenter = {
  zoomToFitBounds: (
    map: Map,
    bounds: LatLngBounds,
    safearea: SafeareaOffsets,
  ) => {
    const inside = false;

    let size = map
        .getSize()
        .subtract(
          new Point(
            safearea.left + safearea.right,
            safearea.top + safearea.bottom,
          ),
        ),
      zoom = map.options.minZoom || 0,
      maxZoom = map.getMaxZoom(),
      ne = bounds.getNorthEast(),
      sw = bounds.getSouthWest(),
      boundsSize,
      nePoint,
      swPoint,
      zoomNotFound = true;

    if (inside) {
      zoom--;
    }

    do {
      zoom++;
      nePoint = map.project(ne, zoom);
      swPoint = map.project(sw, zoom);

      boundsSize = new Point(
        Math.abs(nePoint.x - swPoint.x),
        Math.abs(swPoint.y - nePoint.y),
      );

      if (!inside) {
        zoomNotFound = boundsSize.x <= size.x && boundsSize.y <= size.y;
      } else {
        zoomNotFound = boundsSize.x < size.x || boundsSize.y < size.y;
      }
    } while (zoomNotFound && zoom <= maxZoom);

    if (zoomNotFound && inside) {
      return undefined;
    }

    return inside ? zoom : zoom - 1;
  },
  getBounds: (map: Map, safearea: SafeareaOffsets) => {
    const pixel_bounds = map.getPixelBounds();
    const top_left = map.unproject(
      new Point(
        pixel_bounds.min!.x + safearea.left,
        pixel_bounds.min!.y + safearea.top,
      ),
      map.getZoom(),
    );
    const bottom_right = map.unproject(
      new Point(
        pixel_bounds.max!.x - safearea.right,
        pixel_bounds.max!.y - safearea.bottom,
      ),
      map.getZoom(),
    );

    return new LatLngBounds(top_left, bottom_right);
  },
  /**
   * Given a point that is currently in the center, return the point that would be in
   */
  uncenter: (
    coordinates: [number, number],
    zoom: number,
    offsets: SafeareaOffsets,
  ) => {
    return CRS.EPSG3857.pointToLatLng(
      CRS.EPSG3857.latLngToPoint(latLng(coordinates[0], coordinates[1]), zoom)
        .add([offsets.left / 2, offsets.top / 2])
        .subtract([offsets.right / 2, offsets.bottom / 2]),
      zoom,
    );
  },
  recenter: (
    position: [number, number],
    zoom: number,
    offsets: SafeareaOffsets,
  ) => {
    return CRS.EPSG3857.pointToLatLng(
      CRS.EPSG3857.latLngToPoint(latLng(position[0], position[1]), zoom)
        .subtract([offsets.left / 2, offsets.top / 2])
        .add([offsets.right / 2, offsets.bottom / 2]),
      zoom,
    );
  },
};
