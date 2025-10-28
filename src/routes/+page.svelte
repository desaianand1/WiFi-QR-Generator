<script lang="ts">
	import WifiForm from '$lib/components/WifiForm.svelte';
	import QRPreview from '$lib/components/QRPreview.svelte';
	import PrintableSheet from '$lib/components/PrintableSheet.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { Toaster, toast } from 'svelte-sonner';
	import { ShieldCheckIcon } from 'lucide-svelte';
	import type { WifiConfig } from '$lib/utils/wifi';
	import { validateWifiConfig } from '$lib/utils/wifi';

	let config = $state<WifiConfig>({
		ssid: '',
		password: '',
		securityType: 'WPA3',
		hidden: false
	});

	let imageData = $state<string | undefined>(undefined);
	let qrGenerated = $state(false);

	function handleConfigChange(newConfig: WifiConfig, newImageData?: string) {
		config = newConfig;
		imageData = newImageData;
		// Reset QR generated state when config changes
		qrGenerated = false;
	}

	function handleGenerate() {
		qrGenerated = true;
	}

	// Check if form is valid
	let isFormValid = $derived.by(() => {
		const { valid } = validateWifiConfig(config);
		return valid;
	});

	// Handle print
	function handlePrint() {
		if (!isFormValid) {
			toast.error('Validation Error', {
				description: 'Please fill in all required fields before printing.'
			});
			return;
		}

		window.print();
	}

	// Copy to clipboard
	async function copyToClipboard(text: string, type: string) {
		try {
			await navigator.clipboard.writeText(text);
			toast.success('Copied!', {
				description: `${type} copied to clipboard.`
			});
		} catch {
			toast.error('Copy Failed', {
				description: 'Could not copy to clipboard.'
			});
		}
	}
</script>

<svelte:head>
	<title>WiFi QR Code Generator</title>
	<meta name="description" content="Generate printable WiFi QR codes for easy network sharing" />
</svelte:head>

<Toaster richColors position="top-center" />

<!-- Main Content -->
<div class="container mx-auto px-4 py-8 print:hidden">
	<div class="grid gap-8 lg:grid-cols-2 lg:items-stretch">
		<!-- Left Column: Form -->
		<div class="flex flex-col">
			<WifiForm onConfigChange={handleConfigChange} onGenerate={handleGenerate} />
		</div>

		<!-- Right Column: Preview & Actions -->
		<div class="flex flex-col">
			<QRPreview
				{config}
				{imageData}
				{qrGenerated}
				onCopy={copyToClipboard}
				onPrint={handlePrint}
			/>
		</div>
	</div>

	<!-- Privacy Alert -->
	<Alert.Root
		class="mt-8 border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-500 print:hidden"
	>
		<Alert.Title class="mb-3 flex flex-1 items-center justify-start gap-1.5">
			<ShieldCheckIcon class="size-6 text-blue-700 dark:text-blue-500" />

			<span class="text-xl">Your privacy is protected.</span></Alert.Title
		>

		<Alert.Description class="text-blue-700/75 dark:text-blue-500/75">
			QR codes are generated locally in your browser.
			<p>
				Your WiFi password <u>never leaves your device</u>
				and is not stored or transmitted anywhere.
			</p>
			<p>Feel free to use this page offline too!</p>
		</Alert.Description>
	</Alert.Root>
</div>

<!-- Printable Sheet - hidden on screen, visible on print -->
<PrintableSheet {config} {imageData} />
