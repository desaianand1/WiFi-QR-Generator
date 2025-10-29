<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import * as Field from '$lib/components/ui/field';
	import * as Select from '$lib/components/ui/select';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as InputGroup from '$lib/components/ui/input-group';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Slider } from '$lib/components/ui/slider';
	import { Switch } from '$lib/components/ui/switch';
	import { PaletteIcon } from 'lucide-svelte';
	import ColorInput from '$lib/components/ColorInput.svelte';
	import {
		qrSettingsStore,
		type DotsType,
		type CornersSquareType,
		type CornersDotType,
		type ErrorCorrectionLevel
	} from '$lib/stores/qr-settings.svelte';
	import { formatHex, parse } from 'culori';

	interface Props {
		open?: boolean;
		children?: import('svelte').Snippet;
		hasImage?: boolean;
	}

	let { open = $bindable(false), children, hasImage = false }: Props = $props();

	// Access reactive settings from store
	const settings = $derived(qrSettingsStore.value);

	// Local state for "Set All Colors" feature
	let allColorsHex = $state('000000');
	let allColorsError = $state('');

	function applyColorToAll() {
		const cleanHex = allColorsHex.replace(/^#/, '');
		const color = parse(`#${cleanHex}`);
		if (color) {
			const formatted = formatHex(color);
			qrSettingsStore.update({
				dotsColor: formatted,
				cornersSquareColor: formatted,
				cornersDotColor: formatted
			});
			allColorsHex = formatted.replace('#', '').toUpperCase();
			allColorsError = '';
		} else {
			allColorsError = 'Invalid hex color';
		}
	}

	function handleAllColorsInput(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		allColorsHex = target.value.toUpperCase();
		if (allColorsError) {
			allColorsError = '';
		}
	}

	function handleAllColorsPaste(e: ClipboardEvent) {
		e.preventDefault();
		const pastedText = e.clipboardData?.getData('text') || '';
		allColorsHex = pastedText.replace(/^#/, '').toUpperCase();
		if (allColorsError) {
			allColorsError = '';
		}
	}

	function handleAllColorsPickerChange(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		allColorsHex = target.value.replace('#', '').toUpperCase();
		if (allColorsError) {
			allColorsError = '';
		}
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		{#if children}
			{@render children()}
		{/if}
	</Popover.Trigger>
	<Popover.Content class="w-sm p-4" align="end" alignOffset={10}>
		<div class="space-y-3">
			<!-- Quick Action -->
			<Button
				onclick={qrSettingsStore.applyPrimaryColor}
				variant="outline"
				class="w-full"
				size="lg"
			>
				<PaletteIcon class="mr-2 h-4 w-4" />
				Use Primary Color
			</Button>

			<Separator />

			<!-- Tabs for organized sections -->
			<Tabs.Root value="colors" class="h-fit max-h-[400px] min-h-72 w-full">
				<Tabs.List class="grid w-full grid-cols-4">
					<Tabs.Trigger value="colors">Colors</Tabs.Trigger>
					<Tabs.Trigger value="styles">Styles</Tabs.Trigger>
					<Tabs.Trigger value="sizes">Sizes</Tabs.Trigger>
					<Tabs.Trigger value="advanced">Advanced</Tabs.Trigger>
				</Tabs.List>

				<!-- Colors Tab -->
				<Tabs.Content value="colors" class="space-y-3 pt-3">
					<!-- Set All Colors -->
					<Field.Field>
						<Field.Label class="text-xs font-medium">Set All Colors</Field.Label>
						<Field.Description class="text-xs"
							>Apply one color to dots and corners</Field.Description
						>
						<div class="flex gap-2">
							<div class="flex-1">
								<InputGroup.Root>
									<InputGroup.Addon>
										<span class="font-mono text-xs text-muted-foreground">#</span>
									</InputGroup.Addon>
									<InputGroup.Input
										type="text"
										value={allColorsHex}
										oninput={handleAllColorsInput}
										onpaste={handleAllColorsPaste}
										maxlength={6}
										placeholder="000000"
										class="font-mono text-xs uppercase {allColorsError ? 'border-destructive' : ''}"
									/>
									<InputGroup.Addon align="inline-end">
										<input
											type="color"
											value={`#${allColorsHex}`}
											onchange={handleAllColorsPickerChange}
											class="h-7 w-10 cursor-pointer rounded border-0 bg-transparent p-px"
										/>
									</InputGroup.Addon>
								</InputGroup.Root>
								{#if allColorsError}
									<Field.Error class="mt-1 text-xs">{allColorsError}</Field.Error>
								{/if}
							</div>
							<Button onclick={applyColorToAll} variant="secondary" size="default" class="px-4">
								Apply
							</Button>
						</div>
					</Field.Field>

					<Separator />

					<div class="grid grid-cols-2 gap-3">
						<!-- Dots Color -->
						<ColorInput
							label="Dots"
							value={settings.dotsColor}
							onValueChange={(color) => qrSettingsStore.update({ dotsColor: color })}
						/>

						<!-- Corner Squares Color -->
						<ColorInput
							label="Corner Squares"
							value={settings.cornersSquareColor}
							onValueChange={(color) => qrSettingsStore.update({ cornersSquareColor: color })}
						/>

						<!-- Corner Dots Color -->
						<ColorInput
							label="Corner Dots"
							value={settings.cornersDotColor}
							onValueChange={(color) => qrSettingsStore.update({ cornersDotColor: color })}
						/>

						<!-- Background Color -->
						<ColorInput
							label="Background"
							value={settings.backgroundColor}
							onValueChange={(color) => qrSettingsStore.update({ backgroundColor: color })}
							placeholder="FFFFFF"
						/>
					</div>
				</Tabs.Content>

				<!-- Styles Tab -->
				<Tabs.Content value="styles" class="space-y-3 pt-3">
					<!-- Dots Style -->
					<Field.Field>
						<Field.Label class="text-xs font-medium">Dots Style</Field.Label>
						<Select.Root
							type="single"
							value={settings.dotsType}
							onValueChange={(v) => v && qrSettingsStore.update({ dotsType: v as DotsType })}
						>
							<Select.Trigger class="h-9 w-full text-sm capitalize">
								{settings.dotsType.replaceAll('-', ' ') || 'Select'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="rounded">Rounded</Select.Item>
								<Select.Item value="dots">Dots</Select.Item>
								<Select.Item value="square">Square</Select.Item>
								<Select.Item value="classy">Classy</Select.Item>
								<Select.Item value="classy-rounded">Classy Rounded</Select.Item>
								<Select.Item value="extra-rounded">Extra Rounded</Select.Item>
							</Select.Content>
						</Select.Root>
					</Field.Field>

					<!-- Corner Squares Style -->
					<Field.Field>
						<Field.Label class="text-xs font-medium">Corner Squares Style</Field.Label>
						<Select.Root
							type="single"
							value={settings.cornersSquareType}
							onValueChange={(v) =>
								v && qrSettingsStore.update({ cornersSquareType: v as CornersSquareType })}
						>
							<Select.Trigger class="h-9 w-full text-sm capitalize">
								{settings.cornersSquareType.replaceAll('-', ' ') || 'Select'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="dot">Dot</Select.Item>
								<Select.Item value="square">Square</Select.Item>
								<Select.Item value="extra-rounded">Extra Rounded</Select.Item>
								<Select.Item value="rounded">Rounded</Select.Item>
								<Select.Item value="dots">Dots</Select.Item>
								<Select.Item value="classy">Classy</Select.Item>
								<Select.Item value="classy-rounded">Classy Rounded</Select.Item>
							</Select.Content>
						</Select.Root>
					</Field.Field>

					<!-- Corner Dots Style -->
					<Field.Field>
						<Field.Label class="text-xs font-medium">Corner Dots Style</Field.Label>
						<Select.Root
							type="single"
							value={settings.cornersDotType}
							onValueChange={(v) =>
								v && qrSettingsStore.update({ cornersDotType: v as CornersDotType })}
						>
							<Select.Trigger class="h-9 w-full text-sm capitalize">
								{settings.cornersDotType.replaceAll('-', ' ') || 'Select'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="dot">Dot</Select.Item>
								<Select.Item value="square">Square</Select.Item>
								<Select.Item value="rounded">Rounded</Select.Item>
								<Select.Item value="dots">Dots</Select.Item>
								<Select.Item value="classy">Classy</Select.Item>
								<Select.Item value="classy-rounded">Classy Rounded</Select.Item>
								<Select.Item value="extra-rounded">Extra Rounded</Select.Item>
							</Select.Content>
						</Select.Root>
					</Field.Field>
				</Tabs.Content>

				<!-- Sizes Tab -->
				<Tabs.Content value="sizes" class="space-y-3 pt-3">
					<Field.Field>
						<Field.Label class="text-xs font-medium">Size: {settings.size}px</Field.Label>
						<Field.Description class="text-xs">QR code dimensions</Field.Description>
						<Slider
							type="single"
							value={settings.size}
							onValueChange={(v: number) => qrSettingsStore.update({ size: v })}
							min={200}
							max={600}
							step={20}
							class="mt-2"
						/>
					</Field.Field>

					<Field.Field>
						<Field.Label class="text-xs font-medium">Margin: {settings.margin}px</Field.Label>
						<Field.Description class="text-xs">Spacing around QR code</Field.Description>
						<Slider
							type="single"
							value={settings.margin}
							onValueChange={(v: number) => qrSettingsStore.update({ margin: v })}
							min={0}
							max={40}
							step={2}
							class="mt-2"
						/>
					</Field.Field>

					{#if hasImage}
						<Separator class="my-3" />

						<Field.Field>
							<Field.Label class="text-xs font-medium"
								>Image Size: {Math.round(settings.imageSize * 100)}%</Field.Label
							>
							<Field.Description class="text-xs">Center image size</Field.Description>
							<Slider
								type="single"
								value={settings.imageSize}
								onValueChange={(v: number) => qrSettingsStore.update({ imageSize: v })}
								min={0.1}
								max={1}
								step={0.05}
								class="mt-2"
							/>
						</Field.Field>

						<Field.Field>
							<Field.Label class="text-xs font-medium"
								>Image Margin: {settings.imageMargin}px</Field.Label
							>
							<Field.Description class="text-xs">Spacing around image</Field.Description>
							<Slider
								type="single"
								value={settings.imageMargin}
								onValueChange={(v: number) => qrSettingsStore.update({ imageMargin: v })}
								min={0}
								max={10}
								step={1}
								class="mt-2"
							/>
						</Field.Field>
					{/if}
				</Tabs.Content>

				<!-- Advanced Tab -->
				<Tabs.Content value="advanced" class="space-y-3 pt-3">
					<Field.Field>
						<Field.Label class="text-xs font-medium">Error Correction Level</Field.Label>
						<Field.Description class="text-xs">Higher = more reliable scanning</Field.Description>
						<Select.Root
							type="single"
							value={settings.errorCorrectionLevel}
							onValueChange={(v) =>
								v && qrSettingsStore.update({ errorCorrectionLevel: v as ErrorCorrectionLevel })}
						>
							<Select.Trigger class="h-9 w-full text-sm">
								{settings.errorCorrectionLevel}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="L">L - Low (7%)</Select.Item>
								<Select.Item value="M">M - Medium (15%)</Select.Item>
								<Select.Item value="Q">Q - Quartile (25%)</Select.Item>
								<Select.Item value="H">H - High (30%)</Select.Item>
							</Select.Content>
						</Select.Root>
					</Field.Field>

					{#if hasImage}
						<Field.Field class="mt-6">
							<div class="flex items-center justify-between">
								<div class="space-y-0.5">
									<Field.Label class="text-xs font-medium">Hide Background Dots</Field.Label>
									<Field.Description class="text-xs">Under center image</Field.Description>
								</div>
								<Switch
									checked={settings.hideBackgroundDots}
									onCheckedChange={(checked) =>
										qrSettingsStore.update({ hideBackgroundDots: checked })}
								/>
							</div>
						</Field.Field>
					{/if}
				</Tabs.Content>
			</Tabs.Root>

			<Separator />

			<!-- Reset Button -->
			<Button
				onclick={() => qrSettingsStore.reset()}
				variant="destructive"
				size="default"
				class="w-full"
			>
				Reset to Defaults
			</Button>
		</div>
	</Popover.Content>
</Popover.Root>
