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
		description: 'Classic slate theme',
		preview: {
			primary: 'oklch(0.208 0.042 265.755)',
			secondary: 'oklch(0.968 0.007 247.896)',
			accent: 'oklch(0.968 0.007 247.896)'
		}
	},
	{
		id: 'lavender',
		name: 'Lavender Mist',
		description: 'Warm background with cool purple accents',
		preview: {
			primary: 'oklch(0.442 0.102 254.5)',
			secondary: 'oklch(0.950 0.025 89.2)',
			accent: 'oklch(0.764 0.120 77.1)'
		}
	},
	{
		id: 'twilight',
		name: 'Twilight',
		description: 'Deep purple evening theme',
		preview: {
			primary: 'oklch(0.833 0.030 57.3)',
			secondary: 'oklch(0.329 0.063 259.4)',
			accent: 'oklch(0.454 0.063 254.8)'
		}
	},
	{
		id: 'ocean',
		name: 'Ocean',
		description: 'Aquatic cyan and blue depths',
		preview: {
			primary: 'oklch(0.420 0.108 247.3)',
			secondary: 'oklch(0.741 0.067 190.9)',
			accent: 'oklch(0.288 0.147 292.8)'
		}
	},
	{
		id: 'forest',
		name: 'Forest',
		description: 'Natural green wilderness',
		preview: {
			primary: 'oklch(0.452 0.058 149.3)',
			secondary: 'oklch(0.824 0.117 145.8)',
			accent: 'oklch(0.615 0.082 151.8)'
		}
	},
	{
		id: 'periwinkle',
		name: 'Periwinkle',
		description: 'Soft blue and pink pastels',
		preview: {
			primary: 'oklch(0.636 0.058 255.5)',
			secondary: 'oklch(0.878 0.048 18.1)',
			accent: 'oklch(0.812 0.049 216.3)'
		}
	},
	{
		id: 'bumblebee',
		name: 'Bumblebee',
		description: 'Bold purple and yellow contrast',
		preview: {
			primary: 'oklch(0.406 0.165 274.2)',
			secondary: 'oklch(0.851 0.169 88.0)',
			accent: 'oklch(0.704 0.091 68.2)'
		}
	},
	{
		id: 'arctic',
		name: 'Arctic',
		description: 'Cool cyan winter landscape',
		preview: {
			primary: 'oklch(0.481 0.075 227.5)',
			secondary: 'oklch(0.947 0.030 161.1)',
			accent: 'oklch(0.739 0.112 158.4)'
		}
	},
	{
		id: 'sunset',
		name: 'Sunset',
		description: 'Warm purple and orange dusk',
		preview: {
			primary: 'oklch(0.522 0.056 270.5)',
			secondary: 'oklch(0.913 0.063 67.7)',
			accent: 'oklch(0.802 0.098 19.4)'
		}
	},
	{
		id: 'desert',
		name: 'Desert',
		description: 'Warm earthy sand tones',
		preview: {
			primary: 'oklch(0.309 0.077 41.2)',
			secondary: 'oklch(0.960 0.012 79.8)',
			accent: 'oklch(0.774 0.174 65.1)'
		}
	},
	{
		id: 'abyss',
		name: 'Abyss',
		description: 'Deep ocean purple depths',
		preview: {
			primary: 'oklch(0.788 0.036 185.3)',
			secondary: 'oklch(0.232 0.066 281.3)',
			accent: 'oklch(0.614 0.032 224.1)'
		}
	},
	{
		id: 'golden',
		name: 'Golden',
		description: 'Warm golden hour glow',
		preview: {
			primary: 'oklch(0.564 0.231 29.1)',
			secondary: 'oklch(0.968 0.025 78.9)',
			accent: 'oklch(0.810 0.157 76.2)'
		}
	},
	{
		id: 'meadow',
		name: 'Meadow',
		description: 'Fresh spring greens',
		preview: {
			primary: 'oklch(0.520 0.061 123.2)',
			secondary: 'oklch(0.944 0.032 89.1)',
			accent: 'oklch(0.739 0.105 118.4)'
		}
	}
];

export const defaultPalette = palettes[0];
