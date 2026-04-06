import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WardrobeProvider } from './context/WardrobeContext';
import SideNav from './components/SideNav';
import BottomNav from './components/BottomNav';
import VisualBackdrop from './components/VisualBackdrop';
import Home from './pages/Home';
import Wardrobe from './pages/Wardrobe';
import Stylist from './pages/Stylist';
import Profile from './pages/Profile';
import AddItem from './pages/AddItem';
import Community from './pages/Community';

function App() {
  return (
    <WardrobeProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <div className="app-shell">
          <VisualBackdrop />
          <div className="relative z-10 min-h-screen">
            <SideNav />
            <main className="lg:ml-0">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/wardrobe" element={<Wardrobe />} />
                <Route path="/stylist" element={<Stylist />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/add" element={<AddItem />} />
                <Route path="/community" element={<Community />} />
              </Routes>
            </main>
            <BottomNav />
          </div>
        </div>
      </BrowserRouter>
    </WardrobeProvider>
  );
}

export default App;
