import QRCodeStyling, { type Options as QRCodeOptions } from 'qr-code-styling';

/**
 * QR code generation options
 */
export interface QRGenerationOptions {
	data: string;
	centerImage?: string;
	size?: number;
	errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

/**
 * Creates a QR code with optional center image
 * @param options - QR code generation options
 * @returns QRCodeStyling instance
 */
export function createQRCode(options: QRGenerationOptions): QRCodeStyling {
	const { data, centerImage, size = 512, errorCorrectionLevel = 'H' } = options;

	const qrOptions: QRCodeOptions = {
		width: size,
		height: size,
		type: 'svg',
		data,
		margin: 10,
		qrOptions: {
			typeNumber: 0,
			mode: 'Byte',
			errorCorrectionLevel
		},
		dotsOptions: {
			color: '#000000',
			type: 'rounded'
		},
		backgroundOptions: {
			color: '#ffffff'
		},
		cornersSquareOptions: {
			color: '#000000',
			type: 'extra-rounded'
		},
		cornersDotOptions: {
			color: '#000000',
			type: 'dot'
		}
	};

	// Add image and imageOptions if center image is provided
	if (centerImage) {
		qrOptions.image = centerImage;
		qrOptions.imageOptions = {
			hideBackgroundDots: true,
			imageSize: 1,
			margin: 2,
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
