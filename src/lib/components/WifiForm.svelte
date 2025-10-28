<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Switch } from '$lib/components/ui/switch';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { CircleQuestionMarkIcon, QrCodeIcon } from 'lucide-svelte';
	import SSIDCombobox from './SSIDCombobox.svelte';
	import PasswordInputGroup from './PasswordInputGroup.svelte';
	import FileDropzone from './FileDropzone.svelte';
	import type { WifiConfig, WifiSecurityType } from '$lib/utils/wifi';
	import { validateWifiConfig } from '$lib/utils/wifi';
	import { fileToDataURL } from '$lib/utils/qrcode';
	import { addSSIDToHistory } from '$lib/utils/ssid-storage';
	import { cn } from '$lib/utils';
	import { slide } from 'svelte/transition';

	interface Props {
		onConfigChange: (config: WifiConfig, imageData?: string) => void;
		onGenerate: () => void;
	}

	let { onConfigChange, onGenerate }: Props = $props();

	// Form state
	let ssid = $state('');
	let password = $state('');
	let securityType = $state<WifiSecurityType>('WPA3');
	let isPasswordEnabled = $state(true);
	let isHiddenNetwork = $state(false);
	let imageDataURL = $state<string | undefined>(undefined);

	// Field-level errors
	let ssidError = $state<string | null>(null);
	let passwordError = $state<string | null>(null);

	// Form validation
	let isFormValid = $derived.by(() => {
		const config: WifiConfig = {
			ssid,
			password: isPasswordEnabled ? password : '',
			securityType: isPasswordEnabled ? securityType : 'nopass',
			hidden: isHiddenNetwork
		};
		const { valid } = validateWifiConfig(config);
		return valid;
	});

	// Handle image file change
	async function handleFileChange(file: File | null) {
		if (file) {
			try {
				imageDataURL = await fileToDataURL(file);
			} catch {
				imageDataURL = undefined;
			}
		} else {
			imageDataURL = undefined;
		}
	}

	// Handle security type change - auto-disable password if "nopass" selected
	function handleSecurityTypeChange(type: WifiSecurityType) {
		securityType = type;
		if (type === 'nopass') {
			isPasswordEnabled = false;
			password = '';
			passwordError = null;
		}
	}

	// Handle password toggle
	function handlePasswordToggle(checked: boolean) {
		isPasswordEnabled = checked;
		if (!checked) {
			securityType = 'nopass';
			password = '';
			passwordError = null;
		} else if (securityType === 'nopass') {
			securityType = 'WPA3';
		}
	}

	// Validate individual fields
	function validateField(field: 'ssid' | 'password') {
		if (field === 'ssid') {
			if (!ssid || ssid.trim() === '') {
				ssidError = 'Network name is required';
			} else {
				ssidError = null;
			}
		} else if (field === 'password') {
			if (isPasswordEnabled && (!password || password.trim() === '')) {
				passwordError = 'Password is required for secured networks';
			} else {
				passwordError = null;
			}
		}
	}

	// Handle form submission
	function handleSubmit() {
		// Validate all fields
		validateField('ssid');
		validateField('password');

		const config: WifiConfig = {
			ssid,
			password: isPasswordEnabled ? password : '',
			securityType: isPasswordEnabled ? securityType : 'nopass',
			hidden: isHiddenNetwork
		};

		const { valid } = validateWifiConfig(config);

		if (valid) {
			// Save SSID to history only on successful submission
			addSSIDToHistory(ssid);

			// Update parent component
			onConfigChange(config, imageDataURL);

			// Trigger QR generation
			onGenerate();
		}
	}
</script>

<Tooltip.Provider>
	<Card.Root class="h-full w-full">
		<Card.Header>
			<Card.Title>WiFi Configuration</Card.Title>
			<Card.Description>Enter your network details to generate a QR code</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-1 flex-col space-y-6">
			<!-- SSID Field -->
			<div class="space-y-2">
				<div class="flex items-center gap-1.5">
					<Tooltip.Root>
						<Tooltip.Trigger
							class={cn(
								buttonVariants({ variant: 'link', size: 'icon-sm' }),
								'm-0 size-4 p-0 text-muted-foreground transition-colors hover:text-foreground'
							)}
						>
							<CircleQuestionMarkIcon class="size-4" />
						</Tooltip.Trigger>
						<Tooltip.Content class="text-sm">
							<p>Your WiFi network's name that appears when searching for networks.</p>
						</Tooltip.Content>
					</Tooltip.Root>
					<Label>
						Network Name (SSID)
						<span class="text-destructive">*</span>
					</Label>
				</div>
				<SSIDCombobox
					bind:value={ssid}
					onValueChange={(value) => {
						ssid = value;
						validateField('ssid');
					}}
				/>
				{#if ssidError}
					<p class="animate-in text-sm text-destructive duration-200 fade-in slide-in-from-top-1">
						{ssidError}
					</p>
				{/if}
			</div>

			<!-- Password Field -->
			{#if isPasswordEnabled}
				<div class="space-y-2" transition:slide={{ duration: 300 }}>
					<div class="flex items-center gap-1.5">
						<Tooltip.Root>
							<Tooltip.Trigger
								class={cn(
									buttonVariants({ variant: 'link', size: 'icon-sm' }),
									'm-0 size-4 p-0 text-muted-foreground transition-colors hover:text-foreground'
								)}
							>
								<CircleQuestionMarkIcon class="size-4" />
							</Tooltip.Trigger>
							<Tooltip.Content class="text-sm">
								<p>The password required to connect to your network.</p>
							</Tooltip.Content>
						</Tooltip.Root>
						<Label>
							Password
							<span class="text-destructive">*</span>
						</Label>
					</div>

					<PasswordInputGroup
						bind:password
						bind:securityType
						onSecurityTypeChange={handleSecurityTypeChange}
						onPasswordChange={() => validateField('password')}
					/>
					{#if passwordError}
						<p class="animate-in text-sm text-destructive duration-200 fade-in slide-in-from-top-1">
							{passwordError}
						</p>
					{/if}
				</div>
			{/if}

			<!-- Password Enabled Switch -->
			<Label
				for="password-enabled"
				class="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all duration-300 hover:bg-accent/50 has-aria-checked:border-primary/10 has-aria-checked:bg-primary/5"
			>
				<Switch
					id="password-enabled"
					checked={isPasswordEnabled}
					onCheckedChange={handlePasswordToggle}
					class="data-[state=checked]:bg-primary"
				/>
				<div class="flex-1 space-y-1">
					<p class="text-sm leading-none font-medium">Password-protected?</p>
					<p class="text-sm text-muted-foreground">
						Enable if your network requires a password to connect
					</p>
				</div>
			</Label>

			<!-- Hidden Network Switch -->
			<Label
				for="hidden-network"
				class="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all duration-300 hover:bg-accent/50 has-aria-checked:border-primary/10 has-aria-checked:bg-primary/5"
			>
				<Switch
					id="hidden-network"
					checked={isHiddenNetwork}
					onCheckedChange={(checked) => (isHiddenNetwork = checked)}
					class="data-[state=checked]:bg-primary"
				/>
				<div class="flex-1 space-y-1">
					<p class="text-sm leading-none font-medium">Hidden Network?</p>
					<p class="text-sm text-muted-foreground">
						Enable if your network doesn't broadcast its name
					</p>
				</div>
			</Label>

			<!-- Image Upload Field -->
			<div class="space-y-2">
				<div class="flex items-center gap-1.5">
					<Tooltip.Root>
						<Tooltip.Trigger
							class={cn(
								buttonVariants({ variant: 'link', size: 'icon-sm' }),
								'm-0 size-4 p-0 text-muted-foreground transition-colors hover:text-foreground'
							)}
						>
							<CircleQuestionMarkIcon class="size-4" />
						</Tooltip.Trigger>
						<Tooltip.Content class="text-sm">
							<p>Add a logo or icon at the center of your QR code.</p>
							<p>Use images with transparent backgrounds for best results.</p>
						</Tooltip.Content>
					</Tooltip.Root>
					<Label>Image Logo (Optional)</Label>
				</div>
				<FileDropzone onFileChange={handleFileChange} previewUrl={imageDataURL} />
				<p class="text-xs text-muted-foreground">
					Upload a logo or icon to personalize your QR code
				</p>
			</div>
		</Card.Content>
		<Card.Footer>
			<Button
				onclick={handleSubmit}
				disabled={!isFormValid}
				variant="default"
				class="w-full"
				size="lg"
			>
				<QrCodeIcon /> Generate QR Code</Button
			>
		</Card.Footer>
	</Card.Root>
</Tooltip.Provider>
