import { DivIcon, Point, MarkerCluster } from "~/libs.client/leaflet.client";

export function createClusterIcon(cluster: MarkerCluster) {
  const count = cluster.getChildCount();

  const sizeClass =
    count < 10 ? "small"
    : count < 100 ? "medium"
    : "large";

  return new DivIcon({
    html: `<div><span>${count}</span></div>`,
    className: `marker-cluster marker-cluster-${sizeClass}`,
    iconSize: new Point(40, 40),
  });
}

export function createHighlightedClusterIcon(cluster: MarkerCluster) {
  const count = cluster.getChildCount();

  return new DivIcon({
    html: `<div><span>${count}</span></div>`,
    className: `dral-marker-cluster dral-marker-cluster-hover`,
    iconSize: new Point(40, 40),
  });
}
