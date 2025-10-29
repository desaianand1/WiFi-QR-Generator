import { defaultPalette, type Palette } from '$lib/utils/palettes';

const PALETTE_STORAGE_KEY = 'wifi-qr-generator-color-palette';

class PaletteStore {
	private current = $state<Palette>(defaultPalette);

	constructor() {
		// Initialize from localStorage after mount
		if (typeof window !== 'undefined') {
			this.init();
		}
	}

	private init() {
		const stored = localStorage.getItem(PALETTE_STORAGE_KEY);
		if (stored) {
			try {
				const parsed = JSON.parse(stored) as Palette;
				this.current = parsed;
			} catch (e) {
				console.warn('Failed to parse stored palette, using default', e);
			}
		}
		this.applyPalette(this.current);
	}

	get value() {
		return this.current;
	}

	set(palette: Palette) {
		this.current = palette;
		this.applyPalette(palette);
		if (typeof window !== 'undefined') {
			localStorage.setItem(PALETTE_STORAGE_KEY, JSON.stringify(palette));
		}
	}

	private applyPalette(palette: Palette) {
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('data-palette', palette.id);
		}
	}
}

export const paletteStore = new PaletteStore();
