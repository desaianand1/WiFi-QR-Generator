import QRCodeStyling, { type Options as QRCodeOptions } from 'qr-code-styling';
import type { QRCustomSettings } from '$lib/stores/qr-settings.svelte';

/**
 * QR code generation options
 */
export interface QRGenerationOptions {
	data: string;
	centerImage?: string;
	size?: number;
	errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
	customSettings?: QRCustomSettings;
}

/**
 * Creates a QR code with optional center image
 * @param options - QR code generation options
 * @returns QRCodeStyling instance
 */
export function createQRCode(options: QRGenerationOptions): QRCodeStyling {
	const { data, centerImage, size = 512, errorCorrectionLevel = 'H', customSettings } = options;

	// Use custom settings if provided, otherwise use defaults
	const dotsColor = customSettings?.dotsColor ?? '#000000';
	const dotsType = customSettings?.dotsType ?? 'rounded';
	const cornersSquareColor = customSettings?.cornersSquareColor ?? '#000000';
	const cornersSquareType = customSettings?.cornersSquareType ?? 'extra-rounded';
	const cornersDotColor = customSettings?.cornersDotColor ?? '#000000';
	const cornersDotType = customSettings?.cornersDotType ?? 'dot';
	const backgroundColor = customSettings?.backgroundColor ?? '#ffffff';
	const qrSize = customSettings?.size ?? size;
	const qrMargin = customSettings?.margin ?? 10;
	const qrErrorCorrectionLevel = customSettings?.errorCorrectionLevel ?? errorCorrectionLevel;
	const imageSize = customSettings?.imageSize ?? 0.3;
	const imageMargin = customSettings?.imageMargin ?? 2;
	const hideBackgroundDots = customSettings?.hideBackgroundDots ?? true;

	const qrOptions: QRCodeOptions = {
		width: qrSize,
		height: qrSize,
		type: 'svg',
		data,
		margin: qrMargin,
		qrOptions: {
			typeNumber: 0,
			mode: 'Byte',
			errorCorrectionLevel: qrErrorCorrectionLevel
		},
		dotsOptions: {
			color: dotsColor,
			type: dotsType
		},
		backgroundOptions: {
			color: backgroundColor
		},
		cornersSquareOptions: {
			color: cornersSquareColor,
			type: cornersSquareType
		},
		cornersDotOptions: {
			color: cornersDotColor,
			type: cornersDotType
		}
	};

	// Add image and imageOptions if center image is provided
	if (centerImage) {
		qrOptions.image = centerImage;
		qrOptions.imageOptions = {
			hideBackgroundDots,
			imageSize,
			margin: imageMargin,
			crossOrigin: 'anonymous',
			saveAsBlob: true
		};
	}

	return new QRCodeStyling(qrOptions);
}

/**
 * Converts a file to a data URL
 * @param file - The file to convert
 * @returns Promise that resolves to a data URL string
 */
export function fileToDataURL(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result;
			if (typeof result === 'string') {
				resolve(result);
			} else {
				reject(new Error('Failed to read file'));
			}
		};
		reader.onerror = () => reject(new Error('Failed to read file'));
		reader.readAsDataURL(file);
	});
}

/**
 * Validates that a file is an image of allowed types
 * @param file - The file to validate
 * @returns true if valid, error message if invalid
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
	const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

	if (!allowedTypes.includes(file.type)) {
		return {
			valid: false,
			error: 'Please upload a PNG, JPEG, or WEBP image'
		};
	}

	// Check file size (max 10MB)
	const maxSize = 10 * 1024 * 1024;
	if (file.size > maxSize) {
		return {
			valid: false,
			error: 'Image must be smaller than 10MB'
		};
	}

	return { valid: true };
}
