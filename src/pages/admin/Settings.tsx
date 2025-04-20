
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsPageRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Redirecting from old Settings page to AdminSettings page");
    navigate('/admin/settings', { replace: true });
  }, [navigate]);

  return null;
};

export default SettingsPageRedirect;
