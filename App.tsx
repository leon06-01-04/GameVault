import React, { useState, useEffect } from 'react';
import { Plus, Search, Save, Gamepad2, Filter } from 'lucide-react';
import { Game, GameStatus } from './types';
import { GameCard } from './components/GameCard';
import { GameForm } from './components/GameForm';

const STORAGE_KEY = 'game-vault-library';

const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showToast, setShowToast] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setGames(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse game library", e);
      }
    }
  }, []);

  // Save functionality (The "Safe Button")
  const handleSaveLibrary = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Auto-save effect (optional, but good practice. We keep manual save as requested)
  // useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(games)); }, [games]);

  const handleAddGame = (gameData: Omit<Game, 'id' | 'addedAt'>) => {
    const newGame: Game = {
      ...gameData,
      id: crypto.randomUUID(),
      addedAt: Date.now(),
    };
    setGames(prev => [newGame, ...prev]);
    setIsFormOpen(false);
    handleSaveLibrary(); // Auto-trigger safe on add
  };

  const handleUpdateGame = (gameData: Omit<Game, 'id' | 'addedAt'>) => {
    if (!editingGame) return;
    setGames(prev => prev.map(g => g.id === editingGame.id ? { ...g, ...gameData } : g));
    setEditingGame(undefined);
    setIsFormOpen(false);
    handleSaveLibrary(); // Auto-trigger safe on update
  };

  const handleDeleteGame = (id: string) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      setGames(prev => prev.filter(g => g.id !== id));
      handleSaveLibrary();
    }
  };

  const openAddForm = () => {
    setEditingGame(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (game: Game) => {
    setEditingGame(game);
    setIsFormOpen(true);
  };

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          game.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || game.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen pb-12">
      {/* Toast Notification */}
      <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl transition-all duration-300 z-50 flex items-center gap-2 ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
        <Save size={18} />
        <span className="font-medium">Library Saved Successfully!</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Gamepad2 className="text-white h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
                GameVault
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleSaveLibrary}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 border border-slate-600 transition-colors text-sm font-medium"
                title="Save your progress manually"
              >
                <Save size={18} />
                Save Library
              </button>
              
              <button
                onClick={openAddForm}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-indigo-500/20 font-medium transform active:scale-95"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add Game</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Filters & Stats */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-end md:items-center">
           <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors" size={20} />
               <input
                 type="text"
                 placeholder="Search library..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full sm:w-64 bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
               />
             </div>
             
             <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-48 bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-8 py-2.5 text-slate-200 appearance-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  {Object.values(GameStatus).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
             </div>
           </div>

           <div className="text-slate-400 text-sm font-medium">
             Showing {filteredGames.length} of {games.length} games
           </div>
        </div>

        {/* Game Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map(game => (
              <GameCard
                key={game.id}
                game={game}
                onEdit={openEditForm}
                onDelete={handleDeleteGame}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
            <Gamepad2 className="mx-auto h-16 w-16 text-slate-600 mb-4" />
            <h3 className="text-xl font-medium text-slate-300 mb-2">No games found</h3>
            <p className="text-slate-500 mb-6">
              {games.length === 0 
                ? "Your library is empty. Start by adding your first game!" 
                : "No games match your current filters."}
            </p>
            {games.length === 0 && (
              <button
                onClick={openAddForm}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Add Your First Game
              </button>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      {isFormOpen && (
        <GameForm
          initialData={editingGame}
          onSave={editingGame ? handleUpdateGame : handleAddGame}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default App;