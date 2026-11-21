import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';

// Primary Pages
import { HomePage } from './pages/HomePage';
import { CropScanPage } from './pages/CropScanPage';
import { AskAIPage } from './pages/AskAIPage';
import { WeatherPage } from './pages/WeatherPage';
import { MyFarmPage } from './pages/MyFarmPage';

// Regional & Secondary Modules
import { FloodPage } from './pages/FloodPage';
import { SoilDoctorPage } from './pages/SoilDoctorPage';
import { CropAdvisorPage } from './pages/CropAdvisorPage';
import { MarketPage } from './pages/MarketPage';
import { ProfilePage } from './pages/ProfilePage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="scan" element={<CropScanPage />} />
            <Route path="ask" element={<AskAIPage />} />
            <Route path="weather" element={<WeatherPage />} />
            <Route path="farm" element={<MyFarmPage />} />
            <Route path="flood" element={<FloodPage />} />
            <Route path="soil" element={<SoilDoctorPage />} />
            <Route path="advisor" element={<CropAdvisorPage />} />
            <Route path="market" element={<MarketPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
