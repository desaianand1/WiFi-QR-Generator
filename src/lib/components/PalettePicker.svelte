<script lang="ts">
	import { PaletteIcon } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { palettes } from '$lib/utils/palettes';
	import { paletteStore } from '$lib/stores/palette.svelte';

	let selectedValue = $state(paletteStore.value.id);

	// Update store when selection changes
	$effect(() => {
		const palette = palettes.find((p) => p.id === selectedValue);
		if (palette && palette.id !== paletteStore.value.id) {
			paletteStore.set(palette);
		}
	});

	// Update selection when store changes
	$effect(() => {
		if (paletteStore.value.id !== selectedValue) {
			selectedValue = paletteStore.value.id;
		}
	});
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="icon" class="transition-all! hover:scale-105">
				<PaletteIcon class="h-[1.2rem] w-[1.2rem]" />
				<span class="sr-only">Change color palette</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-60" align="end">
		<DropdownMenu.Label>Color Palette</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.RadioGroup bind:value={selectedValue}>
			{#each palettes as palette}
				<DropdownMenu.RadioItem value={palette.id} class="cursor-pointer">
					<div class="flex w-full items-center justify-between gap-3">
						<div class="min-w-0 flex-1">
							<div class="text-sm font-medium">{palette.name}</div>
							<div class="truncate text-xs text-muted-foreground">
								{palette.description}
							</div>
						</div>
						<div class="flex shrink-0 gap-1">
							<div
								class="h-3.5 w-3.5 rounded-full border border-border/50 transition-transform! hover:scale-110"
								style="background: {palette.preview.primary};"
							></div>
							<div
								class="h-3.5 w-3.5 rounded-full border border-border/50 transition-transform! hover:scale-110"
								style="background: {palette.preview.secondary};"
							></div>
							<div
								class="h-3.5 w-3.5 rounded-full border border-border/50 transition-transform! hover:scale-110"
								style="background: {palette.preview.accent};"
							></div>
						</div>
					</div>
				</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
