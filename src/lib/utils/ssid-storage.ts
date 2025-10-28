/**
 * SSID History Storage Service
 * Manages localStorage for storing and retrieving WiFi SSID history
 */

const STORAGE_KEY = 'wifi-qr-ssid-history';
const MAX_HISTORY = 10;

export interface SSIDHistoryItem {
	ssid: string;
	usageCount: number;
	lastUsed: string; // ISO date string
}

/**
 * Get all SSID history sorted by usage count (descending)
 */
export function getSSIDHistory(): SSIDHistoryItem[] {
	if (typeof window === 'undefined') return [];

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return [];

		const history: SSIDHistoryItem[] = JSON.parse(stored);
		return history.sort((a, b) => b.usageCount - a.usageCount);
	} catch (error) {
		console.error('Error reading SSID history:', error);
		return [];
	}
}

/**
 * Add or update SSID in history
 */
export function addSSIDToHistory(ssid: string): void {
	if (typeof window === 'undefined' || !ssid || ssid.trim() === '') return;

	try {
		const history = getSSIDHistory();
		const existingIndex = history.findIndex((item) => item.ssid === ssid);

		if (existingIndex >= 0) {
			// Update existing entry
			history[existingIndex].usageCount++;
			history[existingIndex].lastUsed = new Date().toISOString();
		} else {
			// Add new entry
			history.push({
				ssid,
				usageCount: 1,
				lastUsed: new Date().toISOString()
			});
		}

		// Sort by usage count and keep only top MAX_HISTORY items
		const sortedHistory = history.sort((a, b) => b.usageCount - a.usageCount).slice(0, MAX_HISTORY);

		localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedHistory));
	} catch (error) {
		console.error('Error saving SSID history:', error);
	}
}

/**
 * Clear all SSID history
 */
export function clearSSIDHistory(): void {
	if (typeof window === 'undefined') return;

	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		console.error('Error clearing SSID history:', error);
	}
}

/**
 * Remove specific SSID from history
 */
export function removeSSIDFromHistory(ssid: string): void {
	if (typeof window === 'undefined') return;

	try {
		const history = getSSIDHistory();
		const filteredHistory = history.filter((item) => item.ssid !== ssid);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory));
	} catch (error) {
		console.error('Error removing SSID from history:', error);
	}
}
