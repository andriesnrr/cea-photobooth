import { renderPhotostripAsBlob } from './photostrip';
import { Photo, TemplateType, Sticker } from './types';

export async function downloadPhotostrip(
  photos: Photo[],
  template: TemplateType,
  stickers: Sticker[] = []
): Promise<void> {
  const blob = await renderPhotostripAsBlob(photos, template, stickers);
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cea-photobooth.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function sharePhotostrip(
  photos: Photo[],
  template: TemplateType,
  stickers: Sticker[] = []
): Promise<boolean> {
  const blob = await renderPhotostripAsBlob(photos, template, stickers);
  if (!blob) return false;

  if (navigator.share && navigator.canShare) {
    const file = new File([blob], 'cea-photobooth.png', { type: 'image/png' });
    const shareData = { files: [file], title: 'Cea Photobooth 🌻' };

    if (navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return true;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    }
  }

  // Fallback to download
  await downloadPhotostrip(photos, template, stickers);
  return true;
}

export function saveToMemories(photostripDataUrl: string): void {
  try {
    const memories: { id: string; dataUrl: string; timestamp: number }[] = 
      JSON.parse(localStorage.getItem('cea-memories') || '[]');
    
    memories.unshift({
      id: `memory-${Date.now()}`,
      dataUrl: photostripDataUrl,
      timestamp: Date.now(),
    });

    // Keep max 20 memories
    if (memories.length > 20) memories.pop();

    localStorage.setItem('cea-memories', JSON.stringify(memories));
  } catch (e) {
    console.error('Failed to save memory:', e);
  }
}

export function getMemories(): { id: string; dataUrl: string; timestamp: number }[] {
  try {
    return JSON.parse(localStorage.getItem('cea-memories') || '[]');
  } catch {
    return [];
  }
}

export function deleteMemory(id: string): void {
  try {
    const memories = getMemories().filter(m => m.id !== id);
    localStorage.setItem('cea-memories', JSON.stringify(memories));
  } catch {}
}
