import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Upload, Sparkles, Camera, Loader2 } from 'lucide-react';
import { Game, GameStatus } from '../types';
import { StarRating } from './StarRating';
import { suggestGameDetails } from '../services/geminiService';

interface GameFormProps {
  initialData?: Game;
  onSave: (game: Omit<Game, 'id' | 'addedAt'>) => void;
  onCancel: () => void;
}

export const GameForm: React.FC<GameFormProps> = ({ initialData, onSave, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [genre, setGenre] = useState(initialData?.genre || '');
  const [status, setStatus] = useState<GameStatus>(initialData?.status || GameStatus.NotStarted);
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [coverImage, setCoverImage] = useState<string | undefined>(initialData?.coverImage);
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery || []);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      genre,
      status,
      rating,
      coverImage,
      gallery
    });
  };

  const handleAiFill = async () => {
    if (!title) return;
    setIsAiLoading(true);
    const suggestion = await suggestGameDetails(title);
    setIsAiLoading(false);
    if (suggestion) {
      setDescription(suggestion.description);
      setGenre(suggestion.genre);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert file to base64
    (Array.from(files) as File[]).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isCover) {
          setCoverImage(base64String);
        } else {
          setGallery(prev => [...prev, base64String]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index: number) => {
    setGallery(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-800 rounded-2xl w-full max-w-3xl border border-slate-700 shadow-2xl my-8 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/50 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">
            {initialData ? 'Edit Game' : 'Add New Game'}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="gameForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title Section with AI */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Game Title</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                  placeholder="e.g. The Legend of Zelda"
                />
                <button
                  type="button"
                  onClick={handleAiFill}
                  disabled={isAiLoading || !title}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-all shadow-lg shadow-indigo-500/20"
                >
                  {isAiLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                  <span>Auto-Fill</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">Use AI to generate description and genre.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status & Rating */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as GameStatus)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {Object.values(GameStatus).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Rating</label>
                <div className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 flex items-center h-[42px]">
                   <StarRating rating={rating} onRate={setRating} size={24} />
                </div>
              </div>
            </div>

            {/* Genre & Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Genre</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600"
                placeholder="e.g. Action RPG, Simulation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none placeholder-slate-600"
                placeholder="Add your thoughts or game synopsis..."
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4 pt-4 border-t border-slate-700/50">
               <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                 <Camera size={20} className="text-indigo-400"/> Picture Library
               </h3>
               
               {/* Cover Image */}
               <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-1/3">
                    <label className="block text-xs uppercase tracking-wide font-bold text-slate-500 mb-2">Cover Art</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden group ${coverImage ? 'border-indigo-500/50' : 'border-slate-600 hover:border-indigo-500 hover:bg-slate-700/30'}`}
                    >
                      {coverImage ? (
                        <>
                          <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                             <span className="text-white text-sm font-medium">Change Cover</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4">
                          <Upload className="mx-auto h-8 w-8 text-slate-500 mb-2" />
                          <span className="text-sm text-slate-400 block">Upload Cover</span>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={(e) => handleImageUpload(e, true)} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>

                  {/* Gallery */}
                  <div className="flex-1">
                    <label className="block text-xs uppercase tracking-wide font-bold text-slate-500 mb-2">Gallery Photos</label>
                    <div className="grid grid-cols-3 gap-2">
                      {gallery.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-md overflow-hidden group">
                           <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                           <button
                             type="button"
                             onClick={() => removeGalleryImage(idx)}
                             className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                             <X size={12} />
                           </button>
                        </div>
                      ))}
                      <button
                         type="button"
                         onClick={() => galleryInputRef.current?.click()}
                         className="aspect-square rounded-md border-2 border-dashed border-slate-600 hover:border-indigo-500 hover:bg-slate-700/30 flex items-center justify-center transition-colors"
                      >
                         <Plus className="text-slate-500" />
                      </button>
                    </div>
                    <input 
                      type="file" 
                      ref={galleryInputRef} 
                      onChange={(e) => handleImageUpload(e, false)} 
                      accept="image/*" 
                      multiple
                      className="hidden" 
                    />
                    <p className="text-xs text-slate-500 mt-2">Add screenshots, box art, or memories.</p>
                  </div>
               </div>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-slate-700 bg-slate-800/50 rounded-b-2xl flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="gameForm"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105"
          >
            {initialData ? 'Update Game' : 'Add to Library'}
          </button>
        </div>
      </div>
    </div>
  );
};