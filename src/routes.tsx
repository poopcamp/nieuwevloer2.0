
// NOTE: This file is not currently being used. Routes are defined in App.tsx.

import { lazy, Suspense } from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import AdminLayout from "./components/admin/AdminLayout";
import NotFound from "./pages/NotFound";

// Home Page Component
const HomePage = lazy(() => import("./components/HomePage"));
const IndexPage = lazy(() => import("./pages/Index"));

// Public Pages
const Configurator = lazy(() => import("./pages/Configurator"));

// Admin Pages
const AdminDashboardPage = lazy(() => import("./pages/admin/Dashboard"));
const AdminSettingsPage = lazy(() => import("./pages/admin/Settings"));
const AdminTilePage = lazy(() => import("./pages/admin/TileManagement"));
const CalendarManagement = lazy(() => import("./pages/admin/CalendarManagement"));
const ExtendedCalculatorManagement = lazy(() => import("./pages/admin/ExtendedCalculatorManagement"));

// Content Management Pages
const HeroImagesPage = lazy(() => import("./pages/admin/ContentManagement"));
const ServicesPage = lazy(() => import("./pages/admin/ContentManagement"));
const MonthlyProjectsPage = lazy(() => import("./pages/admin/ContentManagement"));
const TileExamplesPage = lazy(() => import("./pages/admin/ContentManagement"));
const InspirationTilesPage = lazy(() => import("./pages/admin/InspirationManagement"));
const ServicePagesManagement = lazy(() => import("./pages/admin/ContentManagement"));
const BlogPostsPage = lazy(() => import("./pages/admin/BlogManagement"));

// Import RouteType
import type { RouteType } from "./types/routes";

// Define Admin Routes
const adminRoutes: RouteType[] = [
  {
    path: "/admin",
    element: <AdminLayout>
      <Outlet />
    </AdminLayout>, 
    children: [
      {
        path: "",
        element: <AdminDashboardPage />,
        index: true
      },
      {
        path: "settings",
        element: <AdminSettingsPage />,
      },
      {
        path: "tile-management",
        element: <AdminTilePage />,
      },
      {
        path: "calendar",
        element: <CalendarManagement />,
      },
      {
        path: "calculator-management",
        element: <ExtendedCalculatorManagement />,
      },
      // Content Management Routes
      {
        path: "hero-images",
        element: <HeroImagesPage />,
      },
      {
        path: "services",
        element: <ServicesPage />,
      },
      {
        path: "monthly-projects",
        element: <MonthlyProjectsPage />,
      },
      {
        path: "tile-examples",
        element: <TileExamplesPage />,
      },
      {
        path: "inspiration-tiles",
        element: <InspirationTilesPage />,
      },
      {
        path: "service-pages",
        element: <ServicePagesManagement />,
      },
      {
        path: "blog-posts",
        element: <BlogPostsPage />,
      },
      // Redirect for Extended Calculator
      {
        path: "extended-calculator",
        element: <ExtendedCalculatorManagement />,
      },
    ],
  },
];

// Export all routes
export const routes: RouteType[] = [
  {
    path: "/",
    element: <HomePage />,
    index: true
  },
  {
    path: "/configurator",
    element: <Configurator />,
  },
  ...adminRoutes,
  // Add other routes as needed once their components are available
];

// Export a function that renders all routes
export function AppRoutes() {
  return (
    <Routes>
      {/* Home route */}
      <Route path="/" element={
        <Suspense fallback={<div>Loading...</div>}>
          <HomePage />
        </Suspense>
      } />
      
      {/* Configurator route */}
      <Route path="/configurator" element={
        <Suspense fallback={<div>Loading...</div>}>
          <Configurator />
        </Suspense>
      } />
      
      {/* Admin routes */}
      <Route path="/admin" element={
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      }>
        <Route index element={<AdminDashboardPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="tile-management" element={<AdminTilePage />} />
        <Route path="calendar" element={<CalendarManagement />} />
        <Route path="calculator-management" element={<ExtendedCalculatorManagement />} />
        
        {/* Content Management Routes */}
        <Route path="hero-images" element={<HeroImagesPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="monthly-projects" element={<MonthlyProjectsPage />} />
        <Route path="tile-examples" element={<TileExamplesPage />} />
        <Route path="inspiration-tiles" element={<InspirationTilesPage />} />
        <Route path="service-pages" element={<ServicePagesManagement />} />
        <Route path="blog-posts" element={<BlogPostsPage />} />
        
        {/* Redirect for extended calculator */}
        <Route path="extended-calculator" element={<ExtendedCalculatorManagement />} />
      </Route>
      
      {/* Fallback route for non-existent pages */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
