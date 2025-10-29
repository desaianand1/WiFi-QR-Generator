<script lang="ts">
	import * as Field from '$lib/components/ui/field';
	import * as InputGroup from '$lib/components/ui/input-group';
	import { formatHex, parse } from 'culori';

	interface Props {
		label: string;
		value: string;
		onValueChange: (value: string) => void;
		placeholder?: string;
	}

	let { label, value, onValueChange, placeholder = '000000' }: Props = $props();

	// Local state for hex input and validation
	let hexInput = $state(value.replace('#', '').toUpperCase());
	let errorMessage = $state('');

	// Sync hex input when value changes externally
	$effect(() => {
		hexInput = value.replace('#', '').toUpperCase();
		errorMessage = ''; // Clear error when value updates externally
	});

	function validateAndUpdate(hex: string): boolean {
		// Remove # if present
		const cleanHex = hex.replace(/^#/, '');

		// Try to parse the color
		const color = parse(`#${cleanHex}`);
		if (color) {
			const formatted = formatHex(color);
			onValueChange(formatted);
			hexInput = formatted.replace('#', '').toUpperCase();
			errorMessage = '';
			return true;
		}

		errorMessage = 'Invalid hex color';
		return false;
	}

	function handleInput(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		hexInput = target.value.toUpperCase();
		// Clear error while typing
		if (errorMessage) {
			errorMessage = '';
		}
	}

	function handleBlur() {
		if (!hexInput) {
			// Revert to current valid value if empty
			hexInput = value.replace('#', '').toUpperCase();
			errorMessage = '';
		} else {
			const isValid = validateAndUpdate(hexInput);
			if (!isValid) {
				// Revert to current valid value if invalid
				hexInput = value.replace('#', '').toUpperCase();
			}
		}
	}

	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		const pastedText = e.clipboardData?.getData('text') || '';
		const cleanHex = pastedText.replace(/^#/, '');

		if (!cleanHex) {
			// Ignore empty paste
			return;
		}

		hexInput = cleanHex.toUpperCase();
		validateAndUpdate(cleanHex);
	}

	function handleColorPickerChange(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		const newColor = target.value;
		onValueChange(newColor);
		hexInput = newColor.replace('#', '').toUpperCase();
		errorMessage = '';
	}
</script>

<Field.Field>
	<Field.Label class="text-xs">{label}</Field.Label>
	<InputGroup.Root>
		<InputGroup.Addon>
			<span class="font-mono text-xs text-muted-foreground">#</span>
		</InputGroup.Addon>
		<InputGroup.Input
			type="text"
			value={hexInput}
			oninput={handleInput}
			onblur={handleBlur}
			onpaste={handlePaste}
			maxlength={6}
			{placeholder}
			class="font-mono text-xs uppercase {errorMessage ? 'border-destructive' : ''}"
		/>
		<InputGroup.Addon align="inline-end">
			<input
				type="color"
				{value}
				onchange={handleColorPickerChange}
				class="h-7 w-10 cursor-pointer rounded border-0 bg-transparent p-px"
			/>
		</InputGroup.Addon>
	</InputGroup.Root>
	{#if errorMessage}
		<Field.Error class="mt-1 text-xs">{errorMessage}</Field.Error>
	{/if}
</Field.Field>
