import React from 'react';
import { Search, User, Settings, LogOut, Menu, Maximize, Minimize, RefreshCw, HelpCircle, Sun, Moon, Monitor } from 'lucide-react';
import NotificationCenter from '../UI/NotificationCenter';

interface HeaderProps {
  user?: {
    firstName: string;
    lastName: string;
    role: string;
  };
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  user = { firstName: 'Admin', lastName: 'Fidalli', role: 'Directeur' }, 
  onMenuToggle,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock notifications data
  const notifications = [
    {
      id: '1',
      type: 'info' as const,
      title: 'Nouvelle opportunité',
      message: 'Une nouvelle opportunité a été créée pour ALPHA Industries',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      isRead: false,
    },
    {
      id: '2',
      type: 'warning' as const,
      title: 'Mission en retard',
      message: 'La mission "Audit BETA Télécoms" dépasse la date prévue',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false,
    },
    {
      id: '3',
      type: 'success' as const,
      title: 'Opportunité gagnée',
      message: 'L\'opportunité GAMMA ONG a été marquée comme gagnée',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true,
    },
  ];

  const handleMarkAsRead = (id: string) => {
    console.log('Mark as read:', id);
  };

  const handleMarkAllAsRead = () => {
    console.log('Mark all as read');
  };

  const handleDeleteNotification = (id: string) => {
    console.log('Delete notification:', id);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simuler un refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return Sun;
      case 'dark': return Moon;
      case 'auto': return Monitor;
    }
  };

  const ThemeIcon = getThemeIcon();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher entreprises, contacts, missions..."
              className="pl-10 pr-4 py-2.5 w-96 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded">
                Ctrl K
              </kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Actions */}
          <div className="flex items-center space-x-1 mr-4">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              title="Actualiser"
            >
              <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <div className="relative group">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ThemeIcon className="w-4 h-4 text-gray-600" />
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {[
                    { value: 'light', label: 'Clair', icon: Sun },
                    { value: 'dark', label: 'Sombre', icon: Moon },
                    { value: 'auto', label: 'Auto', icon: Monitor },
                  ].map((themeOption) => {
                    const Icon = themeOption.icon;
                    return (
                      <button
                        key={themeOption.value}
                        onClick={() => setTheme(themeOption.value as any)}
                        className={`flex items-center space-x-2 px-3 py-2 text-sm w-full text-left hover:bg-gray-50 ${
                          theme === themeOption.value ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{themeOption.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4 text-gray-600" />
              ) : (
                <Maximize className="w-4 h-4 text-gray-600" />
              )}
            </button>

            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Aide"
            >
              <HelpCircle className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Notifications */}
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDelete={handleDeleteNotification}
          />

          {/* User Menu */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-gray-500">{user.role}</p>
                <div className="w-2 h-2 bg-green-500 rounded-full" title="En ligne"></div>
              </div>
            </div>
            
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                    <User className="w-4 h-4" />
                    <span>Mon profil</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                    <Settings className="w-4 h-4" />
                    <span>Paramètres</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                    <HelpCircle className="w-4 h-4" />
                    <span>Aide & Support</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                    <Globe className="w-4 h-4" />
                    <span>Langue</span>
                  </button>
                  <hr className="my-2" />
                  <div className="px-4 py-2">
                    <div className="text-xs text-gray-500 mb-1">Statut</div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-700">En ligne</span>
                    </div>
                  </div>
                  <hr className="my-2" />
                  <button className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                    <LogOut className="w-4 h-4" />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};