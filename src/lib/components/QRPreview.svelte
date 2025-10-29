<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Empty from '$lib/components/ui/empty';
	import * as Item from '$lib/components/ui/item';
	import { Button } from '$lib/components/ui/button';
	import {
		QrCodeIcon,
		CopyIcon,
		PrinterIcon,
		WifiIcon,
		LockIcon,
		SettingsIcon
	} from 'lucide-svelte';
	import type { WifiConfig } from '$lib/utils/wifi';
	import { generateWifiQRString } from '$lib/utils/wifi';
	import { createQRCode } from '$lib/utils/qrcode';
	import { colorizeText } from '$lib/utils/text-formatting';
	import type QRCodeStyling from 'qr-code-styling';
	import { cn } from '$lib/utils';
	import QRSettingsPopover from './QRSettingsPopover.svelte';
	import { qrSettingsStore } from '$lib/stores/qr-settings.svelte';

	interface Props {
		config: WifiConfig;
		imageData?: string;
		qrGenerated: boolean;
		onCopy: (text: string, type: string) => Promise<void>;
		onPrint: () => void;
	}

	let { config, imageData, qrGenerated, onCopy, onPrint }: Props = $props();

	let qrContainer: HTMLDivElement | undefined = $state();
	let qrCode: QRCodeStyling | null = null;
	let settingsOpen = $state(false);

	// Generate and update QR code - reactively updates when settings change
	$effect(() => {
		if (!qrContainer || !qrGenerated) return;

		// Get reactive settings from store
		const qrSettings = qrSettingsStore.value;
		const qrString = generateWifiQRString(config);

		// Always recreate QR code to ensure all settings (including colors) are applied
		// The QRCodeStyling.update() method doesn't support updating style properties
		qrCode = createQRCode({
			data: qrString,
			centerImage: imageData,
			size: 360,
			customSettings: qrSettings
		});

		// Clear container and append new QR code
		// eslint-disable-next-line svelte/no-dom-manipulating
		qrContainer.innerHTML = '';
		qrCode.append(qrContainer);
	});
</script>

<Card.Root
	class={cn(
		!qrGenerated && 'bg-muted shadow-none',
		'flex h-full w-full flex-col transition-all duration-300 ease-in-out'
	)}
>
	{#if qrGenerated}
		<Card.Header>
			<Card.Title>QR Preview</Card.Title>
			<Card.Description>Print & scan this to connect to your WiFi network.</Card.Description>
			<Card.Action>
				<QRSettingsPopover bind:open={settingsOpen} hasImage={!!imageData}>
					<!-- eslint-disable-next-line svelte/no-useless-children-snippet -->
					{#snippet children()}
						<Button variant="ghost" size="icon-lg" class="rounded-full">
							<SettingsIcon class="size-5" />
						</Button>
					{/snippet}
				</QRSettingsPopover>
			</Card.Action>
		</Card.Header>
	{/if}
	<Card.Content class="flex flex-1 flex-col justify-between p-6">
		{#if qrGenerated}
			<!-- QR Code -->
			<div class="flex max-h-4/5 min-h-80 items-center justify-center">
				<div
					bind:this={qrContainer}
					class="rounded-lg bg-background p-4"
					aria-label="WiFi QR Code"
				></div>
			</div>

			<!-- Network Details -->
			<div class="mt-6 space-y-3">
				<!-- SSID -->
				<Item.Root variant="muted">
					<Item.Media variant="icon">
						<WifiIcon class="h-5 w-5" />
					</Item.Media>
					<Item.Content>
						<Item.Description class="text-xs text-muted-foreground"
							>Network Name (SSID)</Item.Description
						>
						<Item.Title
							class="gap-px overflow-x-hidden font-mono text-sm tracking-normal text-ellipsis"
						>
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html colorizeText(config.ssid)}
						</Item.Title>
					</Item.Content>
					<Item.Actions>
						<Button
							variant="outline"
							size="icon"
							onclick={() => onCopy(config.ssid, 'Network SSID')}
							aria-label="Copy SSID"
							class="h-8 w-8"
						>
							<CopyIcon class="h-4 w-4" />
						</Button>
					</Item.Actions>
				</Item.Root>

				<!-- Password -->
				{#if config.securityType !== 'nopass' && config.password}
					<Item.Root variant="muted">
						<Item.Media variant="icon">
							<LockIcon class="h-5 w-5" />
						</Item.Media>
						<Item.Content class="flex-nowrap overflow-clip text-nowrap">
							<Item.Description class="text-xs text-muted-foreground">Password</Item.Description>
							<Item.Title
								class="gap-px overflow-x-hidden font-mono text-sm tracking-normal text-ellipsis"
							>
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{@html colorizeText(config.password)}
							</Item.Title>
						</Item.Content>
						<Item.Actions>
							<Button
								variant="outline"
								size="icon"
								onclick={() => onCopy(config.password, 'Password')}
								aria-label="Copy Password"
								class="h-8 w-8"
							>
								<CopyIcon class="h-4 w-4" />
							</Button>
						</Item.Actions>
					</Item.Root>
				{/if}
			</div>
		{:else}
			<!-- Empty State -->
			<div class="flex flex-1 items-center justify-center">
				<Empty.Root class="py-12">
					<Empty.Media>
						<div class="rounded-full bg-muted p-4">
							<QrCodeIcon class="h-12 w-12 text-muted-foreground" />
						</div>
					</Empty.Media>
					<Empty.Content>
						<Empty.Title>No QR Code Generated</Empty.Title>
						<Empty.Description>
							Fill in the required network details and click "Generate QR Code" to create your WiFi
							QR code
						</Empty.Description>
					</Empty.Content>
				</Empty.Root>
			</div>
		{/if}
	</Card.Content>
	{#if qrGenerated}
		<Card.Footer>
			<Button onclick={onPrint} class="w-full" size="lg">
				<PrinterIcon class="mr-2 h-5 w-5" />
				Print
			</Button>
		</Card.Footer>
	{/if}
</Card.Root>
