import React, { useState } from 'react';
import { LaundryProvider, useLaundry } from './context/LaundryContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { DemoBanner } from './components/common/DemoBanner';
import { ToastContainer } from './components/common/ToastContainer';
import { PrototypeGuideModal } from './components/prototype/PrototypeGuideModal';
import { StudentDashboard } from './components/student/StudentDashboard';
import { SubmitLaundry } from './components/student/SubmitLaundry';
import { TrackOrder } from './components/student/TrackOrder';
import { MyOrders } from './components/student/MyOrders';
import { ReportProblem } from './components/student/ReportProblem';
import { StaffDashboard } from './components/staff/StaffDashboard';
import { WardenOverview } from './components/warden/WardenOverview';

const MainAppContent: React.FC = () => {
  const { currentRole, activeTab, setActiveTab } = useLaundry();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Render correct view based on role and active tab
  const renderCurrentView = () => {
    if (currentRole === 'staff') {
      return <StaffDashboard />;
    }

    if (currentRole === 'warden') {
      return <WardenOverview />;
    }

    // Student Role Views
    switch (activeTab) {
      case 'dashboard':
        return <StudentDashboard />;
      case 'submit':
        return <SubmitLaundry />;
      case 'track':
        return <TrackOrder />;
      case 'orders':
        return <MyOrders />;
      case 'complaints':
        return <ReportProblem />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 antialiased selection:bg-sky-500 selection:text-white">
      {/* Top Academic Banner */}
      <DemoBanner />

      {/* Main Navbar */}
      <Navbar
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Responsive Sidebar */}
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Interactive Evaluation Modal */}
      <PrototypeGuideModal />

      {/* Toast Alerts System */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <LaundryProvider>
      <MainAppContent />
    </LaundryProvider>
  );
}
