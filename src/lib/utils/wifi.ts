/**
 * WiFi security types supported by the QR code format
 */
export type WifiSecurityType = 'WPA' | 'WPA2' | 'WPA3' | 'WEP' | 'nopass';

/**
 * WiFi configuration for QR code generation
 */
export interface WifiConfig {
	ssid: string;
	password: string;
	securityType: WifiSecurityType;
	hidden?: boolean;
}

/**
 * Escapes special characters in WiFi QR code strings
 * Characters that need escaping: \ ; , " :
 */
function escapeString(str: string): string {
	return str
		.replace(/\\/g, '\\\\')
		.replace(/;/g, '\\;')
		.replace(/,/g, '\\,')
		.replace(/:/g, '\\:')
		.replace(/"/g, '\\"');
}

/**
 * Generates a WiFi QR code format string
 * Format: WIFI:T:<type>;S:<ssid>;P:<password>;H:<hidden>;;
 *
 * @param config - WiFi configuration
 * @returns WiFi QR code format string
 */
export function generateWifiQRString(config: WifiConfig): string {
	const { ssid, password, securityType, hidden = false } = config;

	// Map security types to QR code format
	const typeMap: Record<WifiSecurityType, string> = {
		WPA: 'WPA',
		WPA2: 'WPA',
		WPA3: 'SAE', // WPA3 uses SAE (Simultaneous Authentication of Equals)
		WEP: 'WEP',
		nopass: ''
	};

	const parts: string[] = ['WIFI:'];

	// Add security type
	const type = typeMap[securityType];
	if (type) {
		parts.push(`T:${type};`);
	}

	// Add SSID (required)
	parts.push(`S:${escapeString(ssid)};`);

	// Add password (if not open network)
	if (securityType !== 'nopass' && password) {
		parts.push(`P:${escapeString(password)};`);
	}

	// Add hidden flag
	if (hidden) {
		parts.push('H:true;');
	}

	// End with double semicolon
	parts.push(';');

	return parts.join('');
}

/**
 * Validates WiFi configuration
 */
export function validateWifiConfig(config: Partial<WifiConfig>): {
	valid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (!config.ssid || config.ssid.trim() === '') {
		errors.push('SSID is required');
	}

	if (config.securityType !== 'nopass' && (!config.password || config.password.trim() === '')) {
		errors.push('Password is required for secured networks');
	}

	return {
		valid: errors.length === 0,
		errors
	};
}
