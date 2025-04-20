
export interface RouteType {
  path: string;
  element: JSX.Element;
  children?: RouteType[];
  index?: boolean;
}
