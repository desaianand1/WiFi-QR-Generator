<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Item from '$lib/components/ui/item';
	import { WifiIcon, LockIcon } from 'lucide-svelte';
	import type { WifiConfig } from '$lib/utils/wifi';
	import { generateWifiQRString } from '$lib/utils/wifi';
	import { createQRCode } from '$lib/utils/qrcode';
	import { colorizeText } from '$lib/utils/text-formatting';
	import type QRCodeStyling from 'qr-code-styling';
	import { qrSettingsStore } from '$lib/stores/qr-settings.svelte';

	interface Props {
		config: WifiConfig;
		imageData?: string;
	}

	let { config, imageData }: Props = $props();

	let qrContainer: HTMLDivElement;
	let qrCode: QRCodeStyling | null = null;

	// Generate QR code - reactively updates when settings change
	$effect(() => {
		if (!qrContainer) return;

		// Get reactive settings from store
		const qrSettings = qrSettingsStore.value;
		const qrString = generateWifiQRString(config);

		// Always recreate QR code to ensure all settings (including colors) are applied
		// The QRCodeStyling.update() method doesn't support updating style properties
		qrCode = createQRCode({
			data: qrString,
			centerImage: imageData,
			size: 400,
			customSettings: qrSettings
		});

		// Clear container and append new QR code
		// eslint-disable-next-line svelte/no-dom-manipulating
		qrContainer.innerHTML = '';
		qrCode.append(qrContainer);
	});
</script>

<div
	class="hidden print:flex print:min-h-screen print:items-center print:justify-center print:bg-white print:p-8 print:text-gray-900"
>
	<Card.Root class="w-full max-w-2xl border-2 border-gray-200! bg-white! text-gray-900!">
		<Card.Header class="text-center">
			<Card.Title class="flex items-center justify-center gap-2 text-3xl text-gray-900!">
				<WifiIcon class="h-8 w-8 text-blue-600!" />
				Scan for WiFi
			</Card.Title>
			<Card.Description class="text-base text-gray-600!"
				>Scan the QR code to connect</Card.Description
			>
		</Card.Header>

		<Card.Content class="space-y-6 pb-8">
			<!-- QR Code -->
			<div class="flex justify-center">
				<div bind:this={qrContainer} class="rounded-lg bg-white! p-4"></div>
			</div>

			<!-- Network Details -->
			<div class="space-y-3">
				<!-- SSID -->
				<Item.Root variant="muted" class="bg-gray-100! text-gray-900!">
					<Item.Media variant="icon" class="bg-gray-200">
						<WifiIcon class="h-5 w-5 text-gray-500!" />
					</Item.Media>
					<Item.Content>
						<Item.Description class="text-xs text-gray-500!">Network Name (SSID)</Item.Description>
						<Item.Title
							class="gap-px overflow-x-clip font-mono text-lg tracking-normal text-ellipsis text-gray-900!"
						>
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html colorizeText(config.ssid)}
						</Item.Title>
					</Item.Content>
				</Item.Root>

				<!-- Password -->
				{#if config.securityType !== 'nopass' && config.password}
					<Item.Root variant="muted" class="bg-gray-100! text-gray-900!">
						<Item.Media variant="icon" class="bg-gray-200">
							<LockIcon class="h-5 w-5 text-gray-500!" />
						</Item.Media>
						<Item.Content>
							<Item.Description class="text-xs text-gray-500!">Password</Item.Description>
							<Item.Title
								class="gap-px overflow-x-clip font-mono text-lg tracking-normal text-ellipsis text-gray-900!"
							>
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{@html colorizeText(config.password)}
							</Item.Title>
						</Item.Content>
					</Item.Root>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>
</div>
