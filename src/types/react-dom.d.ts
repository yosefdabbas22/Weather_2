declare module "react-dom" {
  import type { ReactNode } from "react";
  export function createRoot(container: Element | DocumentFragment): {
    render(children: ReactNode): void;
    unmount(): void;
  };
  export function hydrateRoot(container: Element, children: ReactNode): void;
}
