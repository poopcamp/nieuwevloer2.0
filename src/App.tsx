
import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import "./App.css";

import Home from "./pages/Home";

import AdminCalendarManagement from "./pages/admin/CalendarManagement";
import AdminBlogManagement from "./pages/admin/BlogManagement";
import AdminMediaManagement from "./pages/admin/MediaManagement";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminTilePage from "./pages/admin/TileManagement";
import ConfiguratorBuilder from "./pages/admin/ConfiguratorBuilder";
import QuickCalculatorManagement from "./pages/admin/QuickCalculatorManagement";
import ExtendedCalculatorManagement from "./pages/admin/ExtendedCalculatorManagement";
import AdminDashboard from "./pages/admin/index";
import AdminInspirationalContentPage from "./pages/admin/InspirationalContentManagement";
import AdminContentPage from "./pages/admin/ContentManagement";
import InspirationManagement from "./pages/admin/InspirationManagement";
import SeoManagementPage from "./pages/admin/SeoManagement";
import LeadManagementPage from "./pages/admin/LeadManagement";
import NieuwTerrasOverviewPage from "./pages/admin/NieuwTerrasOverview";
import AdminLogin from "./pages/admin/AdminLogin";

import NotFound from "./pages/NotFound";
import Configurator from "./pages/Configurator";
import Contact from "./pages/Contact";
import GuidesPage from "./pages/guides/GuidesPage";
import ServicesPage from "./pages/services/ServicesPage";
import BlogPage from "./pages/blog/BlogPage";
import ProjectsPage from "./pages/projects/ProjectsPage";
import SingleBlogPage from "./pages/blog/SingleBlogPage";
import { mappedSeoPaths } from "./seo";

import { AuthProvider } from "./contexts/auth-context";
import { BrandProvider } from "./contexts/brand-context";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const MappedSeoPage = lazy(() => import("./pages/seo/MappedSeoPage"));
const DienstenDetailPage = lazy(() => import("./pages/services/DienstenDetailPage"));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <BrandProvider>
            <Suspense fallback={<div className="p-8 text-center">Laden…</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/configurator" element={<Configurator />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/diensten" element={<ServicesPage />} />
              <Route path="/diensten/vloeren" element={<DienstenDetailPage />} />
              <Route path="/diensten/terrassen" element={<DienstenDetailPage />} />
              <Route path="/diensten/badkamerrenovatie" element={<DienstenDetailPage />} />
              <Route path="/gids" element={<GuidesPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:postId" element={<SingleBlogPage />} />
              <Route path="/projecten" element={<ProjectsPage />} />
              {mappedSeoPaths.map((routePath) => (
                <Route
                  key={routePath}
                  path={routePath.slice(0, -1)}
                  element={<MappedSeoPage />}
                />
              ))}

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="leads" element={<LeadManagementPage />} />
                <Route path="nieuwterras" element={<NieuwTerrasOverviewPage />} />
                <Route path="calendar" element={<AdminCalendarManagement />} />
                <Route path="blog" element={<AdminBlogManagement />} />
                <Route path="media" element={<AdminMediaManagement />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="tiles" element={<AdminTilePage />} />
                <Route path="configurator-builder" element={<ConfiguratorBuilder />} />
                <Route path="quick-calculator" element={<QuickCalculatorManagement />} />
                <Route path="extended-calculator" element={<ExtendedCalculatorManagement />} />
                <Route path="content" element={<AdminContentPage />} />
                <Route path="inspiration" element={<AdminInspirationalContentPage />} />
                <Route path="inspiration-tiles" element={<InspirationManagement />} />
                <Route path="seo" element={<SeoManagementPage />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </BrandProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
