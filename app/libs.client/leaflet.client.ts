export {
  Map,
  tileLayer,
  Icon,
  icon,
  divIcon,
  DivIcon,
  point,
  Point,
  LatLngBounds,
  CRS,
  latLng,
} from "leaflet";

import type { MarkerCluster as MarkerClusterType } from "leaflet";
// @ts-ignore
import { MarkerCluster as ActualMarkerCluster } from "leaflet.markercluster";

export type MarkerCluster = ActualMarkerCluster;
export const MarkerCluster = ActualMarkerCluster as typeof MarkerClusterType;

// export { MarkerClusterGroup } from "leaflet.markercluster";
