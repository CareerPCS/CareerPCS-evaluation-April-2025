import { divIcon } from "~/libs.client/leaflet.client";
import { Marker } from "~/libs.client/react-leaflet.client";
import React, { useImperativeHandle } from "react";
import type { Marker as TMarker } from "leaflet";
import type { MarkerProps } from "react-leaflet";
import { createPortal } from "react-dom";

/// Looking forward sooooo much to removing forwardRef in React 19
export const ReactMarker = ({
  eventHandlers,
  children,
  ref,
  ...otherProps
}: Omit<MarkerProps, "icon"> & {
  children: React.ReactNode;
  ref: React.Ref<TMarker>;
}) => {
  "use client";

  const [markerRendered, setMarkerRendered] = React.useState(false);

  const marker_ref = React.useRef<TMarker>(null);
  useImperativeHandle(ref, () => marker_ref.current!);

  const node = React.useMemo(() => {
    const node = document.createElement("div");
    node.style.width = "max-content";
    return node;
  }, []);

  const icon = React.useMemo(
    () => divIcon({ html: node, iconSize: [0, 0], iconAnchor: [0, 0] }),
    [node],
  );

  return (
    <>
      <Marker
        {...otherProps}
        ref={marker_ref}
        eventHandlers={{
          ...eventHandlers,
          add: (...args) => {
            setMarkerRendered(true);
            if (eventHandlers?.add) eventHandlers.add(...args);
          },
          remove: (...args) => {
            setMarkerRendered(false);
            if (eventHandlers?.remove) eventHandlers.remove(...args);
          },
        }}
        icon={icon}
      />
      {markerRendered && createPortal(children, node!)}
      {/* {createPortal(children, node!)} */}
    </>
  );
};
