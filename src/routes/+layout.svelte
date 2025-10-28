<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { paletteStore } from '$lib/stores/palette.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	// Initialize palette on mount
	onMount(() => {
		// Store is already initialized, just ensure the attribute is applied
		paletteStore.value; // Access to ensure initialization
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<div class="flex min-h-screen flex-col">
	<Navbar />
	<main class="flex-1">
		{@render children?.()}
	</main>
	<Footer />
</div>
