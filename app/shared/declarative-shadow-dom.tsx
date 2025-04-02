import React from "react";
import ReactDOM from "react-dom";

const is_client = typeof document !== "undefined";
/// TODO Render the actual template element for React to hydrate if there is no shadowRootMode support?
const supports_declarative_shadow_dom =
  is_client && "shadowRootMode" in HTMLTemplateElement.prototype;

export const DeclarativeShadowDOM = ({
  children,
  template,
  as = "x-component",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  template: React.ReactNode;
  children?: React.ReactNode;
  as?: string;
}) => {
  const As = as as "div";

  if (is_client) {
    return (
      <DeclarativeShadowDOMClient template={template} as={as} props={props}>
        {children}
      </DeclarativeShadowDOMClient>
    );
  } else {
    return (
      <As {...props}>
        <template
          // @ts-ignore - shadowRootMode is not yet in the types
          shadowrootmode="open"
        >
          {template}
        </template>
        {children}
      </As>
    );
  }
};

const DeclarativeShadowDOMClient = ({
  children,
  template,
  as = "x-template",
  props,
}: {
  template: React.ReactNode;
  children?: React.ReactNode;
  as?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
}) => {
  const As = as as "div";
  const ref = React.useRef<HTMLDivElement>(null);
  const [shadowroot, set_shadowroot] = React.useState<ShadowRoot | null>(null);

  React.useLayoutEffect(() => {
    let host = ref.current;
    if (host == null) {
      return;
    }

    if (host.shadowRoot != null) {
      /// Clear the shadow root from the server, because react can not yet hydrate portals :(
      host.shadowRoot.replaceChildren();
      // ReactDOM.flushSync(() => {
      set_shadowroot(host.shadowRoot);
      // });
    } else {
      set_shadowroot(host.attachShadow({ mode: "open" }));
    }
  }, []);

  return (
    <As ref={ref} {...props}>
      {shadowroot && ReactDOM.createPortal(template, shadowroot)}
      {children}
    </As>
  );
};
