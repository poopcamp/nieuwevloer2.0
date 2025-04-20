
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import './App.css';

// Import the unified homepage component
import Home from './pages/Home';

// Import admin components
import AdminCalendarManagement from './pages/admin/CalendarManagement';
import AdminBlogManagement from './pages/admin/BlogManagement';
import AdminMediaManagement from './pages/admin/MediaManagement';
import AdminSettings from './pages/admin/Settings';
import AdminTilePage from './pages/admin/TileManagement';
import ConfiguratorBuilder from './pages/admin/ConfiguratorBuilder';
import QuickCalculatorManagement from './pages/admin/QuickCalculatorManagement';
import ExtendedCalculatorManagement from './pages/admin/ExtendedCalculatorManagement';
import AdminDashboard from './pages/admin/index';
import AdminInspirationalContentPage from './pages/admin/InspirationalContentManagement';
import AdminContentPage from './pages/admin/ContentManagement';
import InspirationManagement from './pages/admin/InspirationManagement';
import SeoManagementPage from './pages/admin/SeoManagement';

// Import other pages
import NotFound from './pages/NotFound';
import Configurator from './pages/Configurator';
import Contact from './pages/Contact';
import GuidesPage from './pages/guides/GuidesPage';
import ServicesPage from './pages/services/ServicesPage';
import BlogPage from './pages/blog/BlogPage';
import ProjectsPage from './pages/projects/ProjectsPage'; 
import SingleBlogPage from './pages/blog/SingleBlogPage'; 

// Import authentication context
import { AuthProvider } from './contexts/auth-context';
import RouteLoader from './components/ui/RouteLoader';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes - Using the unified Home component */}
            <Route path="/" element={<Home />} />
            <Route path="/configurator" element={<Configurator />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/diensten" element={<ServicesPage />} />
            <Route path="/gids" element={<GuidesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:postId" element={<SingleBlogPage />} /> 
            <Route path="/projecten" element={<ProjectsPage />} /> 
            
            {/* Admin Routes with appropriate nesting */}
            <Route path="/admin">
              <Route index element={<AdminDashboard />} />
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
              
              {/* Catch-all route for admin section - redirects to admin dashboard instead of 404 */}
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
            
            {/* Default route if nothing else matches */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
