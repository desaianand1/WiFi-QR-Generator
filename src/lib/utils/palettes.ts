export interface Palette {
	id: string;
	name: string;
	description: string;
	preview: {
		primary: string;
		secondary: string;
		accent: string;
	};
}

/**
 * Available color palettes for the application.
 * To add a new palette:
 * 1. Add a palette object to this array
 * 2. Add corresponding CSS variables in app.css with [data-palette="your-id"]
 */
export const palettes: Palette[] = [
	{
		id: 'default',
		name: 'Default',
		description: 'Classic purple and slate theme',
		preview: {
			primary: 'oklch(0.208 0.042 265.755)',
			secondary: 'oklch(0.968 0.007 247.896)',
			accent: 'oklch(0.968 0.007 247.896)'
		}
	},
	{
		id: 'ocean',
		name: 'Ocean',
		description: 'Cool blue and teal tones',
		preview: {
			primary: 'oklch(0.45 0.15 220)',
			secondary: 'oklch(0.65 0.1 200)',
			accent: 'oklch(0.55 0.12 180)'
		}
	},
	{
		id: 'rose',
		name: 'Rose',
		description: 'Warm pink and red hues',
		preview: {
			primary: 'oklch(0.55 0.2 10)',
			secondary: 'oklch(0.75 0.08 20)',
			accent: 'oklch(0.65 0.15 350)'
		}
	},
	{
		id: 'forest',
		name: 'Forest',
		description: 'Natural green shades',
		preview: {
			primary: 'oklch(0.45 0.15 140)',
			secondary: 'oklch(0.65 0.1 130)',
			accent: 'oklch(0.55 0.12 150)'
		}
	},
	{
		id: 'sunset',
		name: 'Sunset',
		description: 'Vibrant orange and purple',
		preview: {
			primary: 'oklch(0.55 0.2 50)',
			secondary: 'oklch(0.65 0.15 280)',
			accent: 'oklch(0.6 0.18 30)'
		}
	}
];

export const defaultPalette = palettes[0];
