declare module "react" {
  export interface ReactElement<P = unknown, T = string> {
    type: T;
    props: P;
    key: string | null;
  }

  export type ReactNode =
    | ReactElement
    | string
    | number
    | boolean
    | null
    | undefined
    | ReactNode[];

  export function useState<T>(initial: T): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useCallback<T>(callback: T, deps: unknown[]): T;
  export function useRef<T>(initialValue: T | null): { current: T | null };
  export function useRef<T>(initialValue?: T): { current: T | undefined };
}
