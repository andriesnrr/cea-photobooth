'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, useState } from 'react';
import { AppState, Photo, Sticker, FilterType, TemplateType } from './types';

type Action =
  | { type: 'ADD_PHOTO'; photo: Photo }
  | { type: 'REPLACE_PHOTO'; index: number; photo: Photo }
  | { type: 'CLEAR_PHOTOS' }
  | { type: 'SET_FILTER'; filter: FilterType }
  | { type: 'SET_TEMPLATE'; template: TemplateType }
  | { type: 'ADD_STICKER'; sticker: Sticker }
  | { type: 'UPDATE_STICKER'; sticker: Sticker }
  | { type: 'REMOVE_STICKER'; id: string }
  | { type: 'CLEAR_STICKERS' }
  | { type: 'SET_PHOTOSTRIP'; dataUrl: string | null }
  | { type: 'INCREMENT_SESSION' }
  | { type: 'NEW_SESSION' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'LOAD_STATE'; state: Partial<AppState> };

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Use a fixed session ID for initial state to avoid hydration mismatch
const initialState: AppState = {
  photos: [],
  selectedTemplate: 'classic',
  selectedFilter: 'normal',
  stickers: [],
  sessionId: 'initial',
  sessionCount: 0,
  photostripDataUrl: null,
  isSoundEnabled: true,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_PHOTO':
      return { ...state, photos: [...state.photos, action.photo] };
    case 'REPLACE_PHOTO': {
      const newPhotos = [...state.photos];
      newPhotos[action.index] = action.photo;
      return { ...state, photos: newPhotos };
    }
    case 'CLEAR_PHOTOS':
      return { ...state, photos: [] };
    case 'SET_FILTER':
      return { ...state, selectedFilter: action.filter };
    case 'SET_TEMPLATE':
      return { ...state, selectedTemplate: action.template };
    case 'ADD_STICKER':
      return { ...state, stickers: [...state.stickers, action.sticker] };
    case 'UPDATE_STICKER':
      return {
        ...state,
        stickers: state.stickers.map((s) =>
          s.id === action.sticker.id ? action.sticker : s
        ),
      };
    case 'REMOVE_STICKER':
      return {
        ...state,
        stickers: state.stickers.filter((s) => s.id !== action.id),
      };
    case 'CLEAR_STICKERS':
      return { ...state, stickers: [] };
    case 'SET_PHOTOSTRIP':
      return { ...state, photostripDataUrl: action.dataUrl };
    case 'INCREMENT_SESSION':
      return { ...state, sessionCount: state.sessionCount + 1 };
    case 'NEW_SESSION':
      return {
        ...state,
        photos: [],
        stickers: [],
        photostripDataUrl: null,
        sessionId: generateId(),
        selectedFilter: 'normal',
      };
    case 'TOGGLE_SOUND':
      return { ...state, isSoundEnabled: !state.isSoundEnabled };
    case 'LOAD_STATE':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addPhoto: (photo: Photo) => void;
  replacePhoto: (index: number, photo: Photo) => void;
  clearPhotos: () => void;
  setFilter: (filter: FilterType) => void;
  setTemplate: (template: TemplateType) => void;
  addSticker: (sticker: Sticker) => void;
  updateSticker: (sticker: Sticker) => void;
  removeSticker: (id: string) => void;
  clearStickers: () => void;
  setPhotostrip: (dataUrl: string | null) => void;
  newSession: () => void;
  toggleSound: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [mounted, setMounted] = useState(false);

  // Only render children after client mount to prevent hydration mismatches
  useEffect(() => {
    setMounted(true);

    // Load persisted state
    try {
      const saved = localStorage.getItem('cea-photobooth-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', state: { sessionCount: parsed.sessionCount || 0 } });
      }
    } catch {}

    // Generate proper sessionId on client
    dispatch({ type: 'LOAD_STATE', state: { sessionId: generateId() } });
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('cea-photobooth-state', JSON.stringify({
        sessionCount: state.sessionCount,
      }));
    } catch {}
  }, [state.sessionCount, mounted]);

  const addPhoto = useCallback((photo: Photo) => dispatch({ type: 'ADD_PHOTO', photo }), []);
  const replacePhoto = useCallback((index: number, photo: Photo) => dispatch({ type: 'REPLACE_PHOTO', index, photo }), []);
  const clearPhotos = useCallback(() => dispatch({ type: 'CLEAR_PHOTOS' }), []);
  const setFilter = useCallback((filter: FilterType) => dispatch({ type: 'SET_FILTER', filter }), []);
  const setTemplate = useCallback((template: TemplateType) => dispatch({ type: 'SET_TEMPLATE', template }), []);
  const addSticker = useCallback((sticker: Sticker) => dispatch({ type: 'ADD_STICKER', sticker }), []);
  const updateSticker = useCallback((sticker: Sticker) => dispatch({ type: 'UPDATE_STICKER', sticker }), []);
  const removeSticker = useCallback((id: string) => dispatch({ type: 'REMOVE_STICKER', id }), []);
  const clearStickers = useCallback(() => dispatch({ type: 'CLEAR_STICKERS' }), []);
  const setPhotostrip = useCallback((dataUrl: string | null) => dispatch({ type: 'SET_PHOTOSTRIP', dataUrl }), []);
  const newSession = useCallback(() => {
    dispatch({ type: 'NEW_SESSION' });
    dispatch({ type: 'INCREMENT_SESSION' });
  }, []);
  const toggleSound = useCallback(() => dispatch({ type: 'TOGGLE_SOUND' }), []);

  // Show nothing until client-side hydration is complete
  if (!mounted) {
    return null;
  }

  return (
    <StoreContext.Provider value={{
      state, dispatch,
      addPhoto, replacePhoto, clearPhotos, setFilter, setTemplate,
      addSticker, updateSticker, removeSticker, clearStickers,
      setPhotostrip, newSession, toggleSound,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextType {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
