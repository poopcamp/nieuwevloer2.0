/**
 * Drop-in react-router-dom that sends every Link, NavLink, Navigate,
 * and navigate() call through the final-URL helper. Route `path` values
 * stay as they are.
 */
import { forwardRef, type ComponentProps } from "react";
import type { NavigateProps, To } from "react-router-dom/dist/index.js";
import * as RR from "react-router-dom/dist/index.js";
import { mapTo } from "./links.mjs";

export const {
  AbortedDeferredError,
  Await,
  BrowserRouter,
  Form,
  HashRouter,
  MemoryRouter,
  NavigationType,
  Outlet,
  Route,
  Router,
  RouterProvider,
  Routes,
  ScrollRestoration,
  UNSAFE_DataRouterContext,
  UNSAFE_DataRouterStateContext,
  UNSAFE_ErrorResponseImpl,
  UNSAFE_FetchersContext,
  UNSAFE_LocationContext,
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
  UNSAFE_ViewTransitionContext,
  UNSAFE_useRouteId,
  UNSAFE_useScrollRestoration,
  createBrowserRouter,
  createHashRouter,
  createMemoryRouter,
  createPath,
  createRoutesFromChildren,
  createRoutesFromElements,
  createSearchParams,
  defer,
  generatePath,
  isRouteErrorResponse,
  json,
  matchPath,
  matchRoutes,
  parsePath,
  redirect,
  redirectDocument,
  renderMatches,
  replace,
  resolvePath,
  unstable_HistoryRouter,
  unstable_usePrompt,
  useActionData,
  useAsyncError,
  useAsyncValue,
  useBeforeUnload,
  useBlocker,
  useFetcher,
  useFetchers,
  useFormAction,
  useInRouterContext,
  useLoaderData,
  useLocation,
  useMatch,
  useMatches,
  useNavigation,
  useNavigationType,
  useOutlet,
  useOutletContext,
  useParams,
  useResolvedPath,
  useRevalidator,
  useRouteError,
  useRouteLoaderData,
  useRoutes,
  useSearchParams,
  useSubmit,
  useViewTransitionState,
} = RR;

export const Link = forwardRef<HTMLAnchorElement, ComponentProps<typeof RR.Link>>(
  function Link(props, ref) {
    return <RR.Link {...props} to={mapTo(props.to) as To} ref={ref} />;
  },
);

export const NavLink = forwardRef<HTMLAnchorElement, ComponentProps<typeof RR.NavLink>>(
  function NavLink(props, ref) {
    return <RR.NavLink {...props} to={mapTo(props.to) as To} ref={ref} />;
  },
);

export function Navigate(props: NavigateProps) {
  return <RR.Navigate {...props} to={mapTo(props.to) as To} />;
}

export function useNavigate() {
  const navigate = RR.useNavigate();
  return (to: To | number, options?: { replace?: boolean; state?: unknown }) => {
    if (typeof to === "number") return navigate(to);
    return navigate(mapTo(to) as To, options);
  };
}

export function useHref(to: To, options?: { relative?: "route" | "path" }) {
  return RR.useHref(mapTo(to) as To, options);
}

export function useLinkClickHandler(
  to: To,
  options?: Parameters<typeof RR.useLinkClickHandler>[1],
) {
  return RR.useLinkClickHandler(mapTo(to) as To, options);
}
