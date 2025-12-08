import { Routes, Route } from 'react-router-dom';
import { Dashboard, Profile, Fitness, Vitals, Resources, HealthcareSystems, Landing, Login, Register } from './pages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      
      {/* Fitness with sub-routes */}
      <Route path="/fitness" element={<Fitness />} />
      <Route path="/fitness/dashboard" element={<Fitness />} />
      <Route path="/fitness/history" element={<Fitness />} />
      <Route path="/fitness/entry" element={<Fitness />} />
      <Route path="/fitness/feed" element={<Fitness />} />
      
      {/* Vitals with sub-routes */}
      <Route path="/vitals" element={<Vitals />} />
      <Route path="/vitals/dashboard" element={<Vitals />} />
      <Route path="/vitals/history" element={<Vitals />} />
      <Route path="/vitals/entry" element={<Vitals />} />
      <Route path="/vitals/reminders" element={<Vitals />} />
      
      {/* Resources/Library with sub-routes */}
      <Route path="/resources" element={<Resources />} />
      <Route path="/resources/articles" element={<Resources />} />
      <Route path="/resources/videos" element={<Resources />} />
      <Route path="/resources/podcasts" element={<Resources />} />
      <Route path="/resources/personal" element={<Resources />} />
      <Route path="/resources/community" element={<Resources />} />
      <Route path="/resources/community/create" element={<Resources />} />
      <Route path="/resources/community/topic/:topicId" element={<Resources />} />
      
      {/* Healthcare Systems with nested routes */}
      <Route path="/healthcare-systems" element={<HealthcareSystems />} />
      <Route path="/healthcare-systems/appointments" element={<HealthcareSystems />} />
      <Route path="/healthcare-systems/schedule" element={<HealthcareSystems />} />
      <Route path="/healthcare-systems/provider/:providerId" element={<HealthcareSystems />} />
      <Route path="/healthcare-systems/provider/:providerId/video" element={<HealthcareSystems />} />
      <Route path="/healthcare-systems/provider/:providerId/message" element={<HealthcareSystems />} />
    </Routes>
  );
}

export default App;
