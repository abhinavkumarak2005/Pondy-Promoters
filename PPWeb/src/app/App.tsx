import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { FeaturedProperties } from './components/FeaturedProperties';
import { ServicesSection } from './components/ServicesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PropertyProvider } from './context/PropertyContext';
import { AdminPanel } from './components/AdminPanel';
import { OurProcess } from './components/OurProcess';
import { AllPropertiesPage } from './components/AllPropertiesPage';

type View = 'home' | 'admin' | 'all-properties';

export default function App() {
  const [view, setView] = useState<View>('home');

  useEffect(() => {
    const check = () => {
      if (window.location.hash === '#admin') setView('admin');
      else if (window.location.hash === '#all-properties') setView('all-properties');
      else setView('home');
    };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, []);

  const goAllProperties = () => {
    window.location.hash = '#all-properties';
    setView('all-properties');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const goHome = () => {
    window.location.hash = '';
    setView('home');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <PropertyProvider>
      {view === 'admin' ? (
        <AdminPanel />
      ) : view === 'all-properties' ? (
        <AllPropertiesPage onBack={goHome} />
      ) : (
        <div className="bg-background min-h-screen">
          <Header />
          <HeroSection />
          <AboutSection />
          <FeaturedProperties onViewAll={goAllProperties} />
          <OurProcess />
          <ServicesSection />
          <TestimonialsSection />
          <ContactSection />
          <Footer />
        </div>
      )}
    </PropertyProvider>
  );
}
