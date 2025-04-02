export {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Rectangle,
  useMapEvent,
  useMap,
  CircleMarker,
  Tooltip,
  Circle,
  ZoomControl,
  GeoJSON,
  Pane,
} from "react-leaflet";
export { default as MarkerClusterGroup } from "react-leaflet-cluster";

import { smoothWheelZoom } from "./smoothWheelZoom";

smoothWheelZoom();
