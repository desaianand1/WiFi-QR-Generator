<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.ico';
	import { ModeWatcher } from 'mode-watcher';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { paletteStore } from '$lib/stores/palette.svelte';
	import { mode } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();

	// Initialize palette on mount
	onMount(() => {
		// Store is already initialized, just ensure the attribute is applied
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		paletteStore.value; // Access to ensure initialization
	});

	// Watch for mode changes and re-apply the current palette
	$effect(() => {
		// Track mode changes
		const currentMode = mode.current;
		// Re-apply palette to ensure data-palette attribute persists
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('data-palette', paletteStore.value.id);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<Toaster richColors position="top-center" />

<div class="flex min-h-screen flex-col">
	<Navbar />
	<main class="flex-1">
		{@render children?.()}
	</main>
	<Footer />
</div>
