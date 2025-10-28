<script lang="ts">
	import { toggleMode } from 'mode-watcher';
	import { WifiIcon, SunIcon, MoonIcon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import PalettePicker from '$lib/components/PalettePicker.svelte';
</script>

<nav
	class="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 print:hidden"
>
	<div class="container mx-auto flex h-16 items-center justify-between px-4">
		<div class="flex items-center gap-2">
			<WifiIcon class="h-6 w-6 text-primary" />
			<h1 class="text-xl font-semibold">WiFi QR Generator</h1>
		</div>
		<div class="flex items-center gap-2">
			<PalettePicker />
			<Button onclick={toggleMode} variant="outline" size="icon">
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
				/>
				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>
	</div>
</nav>
