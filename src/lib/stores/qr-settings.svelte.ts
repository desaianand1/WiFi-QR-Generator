/**
 * QR Code Settings Store
 * Manages reactive QR code customization settings with localStorage persistence
 */

import { formatHex, oklch } from 'culori';

const STORAGE_KEY = 'wifi-qr-settings';

export type DotsType =
	| 'rounded'
	| 'dots'
	| 'classy'
	| 'classy-rounded'
	| 'square'
	| 'extra-rounded';

export type CornersSquareType =
	| 'dot'
	| 'square'
	| 'extra-rounded'
	| 'rounded'
	| 'dots'
	| 'classy'
	| 'classy-rounded';

export type CornersDotType =
	| 'dot'
	| 'square'
	| 'rounded'
	| 'dots'
	| 'classy'
	| 'classy-rounded'
	| 'extra-rounded';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QRCustomSettings {
	// Dot customization
	dotsColor: string;
	dotsType: DotsType;

	// Corner square customization
	cornersSquareColor: string;
	cornersSquareType: CornersSquareType;

	// Corner dot customization
	cornersDotColor: string;
	cornersDotType: CornersDotType;

	// Background customization
	backgroundColor: string;

	// Size settings
	size: number;
	margin: number;

	// Image settings
	imageSize: number;
	imageMargin: number;
	hideBackgroundDots: boolean;

	// Error correction
	errorCorrectionLevel: ErrorCorrectionLevel;
}

/**
 * Get the current primary color from CSS variables
 * Converts oklch format to hex using culori
 */
function getPrimaryColor(): string {
	if (typeof window === 'undefined') return '#000000';

	try {
		const root = document.documentElement;
		const primaryValue = getComputedStyle(root).getPropertyValue('--primary').trim();

		if (!primaryValue) return '#000000';

		// Parse oklch format: "oklch(l c h)" or "oklch(l c h / a)"
		const oklchMatch = primaryValue.match(
			/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/
		);

		if (!oklchMatch) {
			const color = oklch(primaryValue);
			return color ? formatHex(color) : '#000000';
		}

		const l = parseFloat(oklchMatch[1]);
		const c = parseFloat(oklchMatch[2]);
		const h = parseFloat(oklchMatch[3]);
		const alpha = oklchMatch[4] ? parseFloat(oklchMatch[4]) : undefined;

		const color =
			alpha !== undefined
				? { mode: 'oklch' as const, l, c, h, alpha }
				: { mode: 'oklch' as const, l, c, h };
		return formatHex(color);
	} catch (error) {
		console.error('Error converting primary color:', error);
		return '#000000';
	}
}

/**
 * Get default QR code settings
 */
function getDefaultSettings(): QRCustomSettings {
	return {
		dotsColor: '#000000',
		dotsType: 'rounded',
		cornersSquareColor: '#000000',
		cornersSquareType: 'extra-rounded',
		cornersDotColor: '#000000',
		cornersDotType: 'extra-rounded',
		backgroundColor: '#ffffff',
		size: 360,
		margin: 5,
		imageSize: 1,
		imageMargin: 0,
		hideBackgroundDots: true,
		errorCorrectionLevel: 'H'
	};
}

class QRSettingsStore {
	private current = $state<QRCustomSettings>(getDefaultSettings());

	constructor() {
		if (typeof window !== 'undefined') {
			this.init();
		}
	}

	private init() {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				const parsed = JSON.parse(stored) as QRCustomSettings;
				// Merge with defaults to ensure all properties exist
				this.current = { ...getDefaultSettings(), ...parsed };
			} catch (e) {
				console.warn('Failed to parse stored QR settings, using defaults', e);
			}
		}
	}

	get value() {
		return this.current;
	}

	update(settings: Partial<QRCustomSettings>) {
		this.current = { ...this.current, ...settings };
		this.persist();
	}

	reset() {
		this.current = getDefaultSettings();
		if (typeof window !== 'undefined') {
			localStorage.removeItem(STORAGE_KEY);
		}
	}

	applyPrimaryColor = () => {
		const primaryColor = getPrimaryColor();
		this.update({
			dotsColor: primaryColor,
			cornersSquareColor: primaryColor,
			cornersDotColor: primaryColor
		});
	};

	private persist() {
		if (typeof window !== 'undefined') {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(this.current));
			} catch (error) {
				console.error('Error saving QR settings:', error);
			}
		}
	}
}

export const qrSettingsStore = new QRSettingsStore();
