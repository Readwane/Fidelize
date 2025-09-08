import { useState, useEffect } from "react";
import { Sidebar } from "./components/Layout/Sidebar";
import { Header } from "./components/Layout/Header";
import { DashboardOverview } from "./components/Pages/Dashboard/DashboardOverview";
import { EntitiesList } from "./components/Pages/Entities/EntitiesList";
import Contacts from "./components/Pages/Contacts/Contacts";
import Missions from "./components/Pages/Missions/Missions";
import Opportunities from "./components/Pages/Opportunities/Opportunities";
import Analysis from "./components/Pages/Analysis/Analysis";
import Activities from "./components/Pages/Activities/Activities";
import Templates from "./components/Pages/DocTemplates/Templates";
import Reports from "./components/Pages/Reportings/Reports";
import Settings from "./components/Pages/Settings/Settings";
import Fidelization from "./components/Pages/Fidelisations/Fidelization";
import Calendar from "./components/Pages/Calendar/Calendar";
import Interactions from "./components/Pages/Interactions/Interactions";

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Écouter les changements de plein écran
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K pour la recherche
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Rechercher"]') as HTMLInputElement;
        searchInput?.focus();
      }
      
      // Échap pour fermer les modales
      if (e.key === 'Escape') {
        // Logique pour fermer les modales ouvertes
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />;
      case "entities":
        return <EntitiesList />;
      case "contacts":
        return <Contacts />;
      case "missions":
        return <Missions />;
      case "activities":
        return <Activities />;
      case "opportunities":
        return <Opportunities />;
      case "needs-analysis":
        return <Analysis />;
      case "communications":
        return <Fidelization />;
      case "calendar":
        return <Calendar />;
      case "interactions":
        return <Interactions />;
      case "reports":
        return <Reports />;
      case "documents":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Gestion Documentaire
            </h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Module en cours de développement</p>
              <p className="text-sm text-gray-500 mt-2">
                Templates de documents avec préremplissage automatique
              </p>
            </div>
          </div>
        );
      case "templates":
        return <Templates />;
      case "alerts":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Alertes et Notifications
            </h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Module en cours de développement</p>
              <p className="text-sm text-gray-500 mt-2">
                Système d'alertes automatiques et notifications intelligentes
              </p>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Sécurité et Conformité
            </h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Module en cours de développement</p>
              <p className="text-sm text-gray-500 mt-2">
                Gestion des permissions RBAC et conformité RGPD
              </p>
            </div>
          </div>
        );
      case "data-management":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Gestion des Données
            </h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Module en cours de développement</p>
              <p className="text-sm text-gray-500 mt-2">
                Import/export, dédoublonnage et qualité des données
              </p>
            </div>
          </div>
        );
      case "settings":
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex ${isFullscreen ? 'fixed inset-0' : ''}`}>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 overflow-hidden`}
      >
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 lg:p-8">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}

export default App;
