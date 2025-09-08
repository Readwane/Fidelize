import React from "react";
import {
  Building2,
  Users,
  Briefcase,
  Target,
  FileText,
  BarChart3,
  Settings,
  Search,
  Bell,
  MessageSquare,
  Calendar,
  TrendingUp,
  Shield,
  Database,
  Activity,
  Brain,
  Mail,
  Phone,
  Archive,
  AlertTriangle,
  FileCheck,
  Zap,
  Globe,
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  {
    id: "dashboard",
    label: "Tableau de bord",
    icon: BarChart3,
    color: "text-blue-600",
  },
  {
    id: "entities",
    label: "Entreprises",
    icon: Building2,
    color: "text-green-600",
  },
  {
    id: "contacts",
    label: "Contacts",
    icon: Users,
    color: "text-purple-600",
  },
  {
    id: "missions",
    label: "Missions",
    icon: Briefcase,
    color: "text-orange-600",
  },
  {
    id: "activities",
    label: "Activités",
    icon: Activity,
    color: "text-cyan-600",
  },
  {
    id: "opportunities",
    label: "Opportunités",
    icon: Target,
    color: "text-red-600",
  },
  {
    id: "needs-analysis",
    label: "Analyse des besoins",
    icon: Brain,
    color: "text-pink-600",
  },
  {
    id: "communications",
    label: "Communications",
    icon: Mail,
    color: "text-emerald-600",
  },
  {
    id: "calendar",
    label: "Calendrier",
    icon: Calendar,
    color: "text-teal-600",
  },
  {
    id: "interactions",
    label: "Interactions",
    icon: Phone,
    color: "text-violet-600",
  },
  {
    id: "reports",
    label: "Rapports",
    icon: TrendingUp,
    color: "text-yellow-600",
  },
  {
    id: "documents",
    label: "Documents",
    icon: FileText,
    color: "text-slate-600",
  },
  {
    id: "templates",
    label: "Templates",
    icon: FileCheck,
    color: "text-amber-600",
  },
  {
    id: "alerts",
    label: "Alertes",
    icon: AlertTriangle,
    color: "text-rose-600",
  },
  {
    id: "security",
    label: "Sécurité",
    icon: Shield,
    color: "text-indigo-600",
  },
  {
    id: "data-management",
    label: "Gestion des données",
    icon: Database,
    color: "text-stone-600",
  },
  {
    id: "settings",
    label: "Paramètres",
    icon: Settings,
    color: "text-zinc-600",
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg h-full overflow-y-auto transition-all duration-300 border-r border-gray-200`}>
      <div className="p-6 border-b border-gray-200">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Fidalli CRM</h1>
            <p className="text-sm text-gray-500">Cabinet d'expertise</p>
          </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Zap className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-lg text-left transition-all duration-200 group relative ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-blue-600" : item.color
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                  
                  {/* Tooltip pour mode collapsed */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      {item.label}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {!isCollapsed && (
      <div className="p-4 border-t border-gray-200 mt-auto sticky bottom-0 bg-white">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-700">En ligne</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Version 3.0
          </h3>
          <p className="text-xs text-gray-600">
            CRM intégré pour la gestion complète du cycle client
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-500">Dernière sync</span>
            <span className="text-xs font-medium text-gray-700">Il y a 2min</span>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
