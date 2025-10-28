<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import { CoffeeIcon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	const currentYear = new Date().getFullYear();
</script>

<footer
	class="mt-auto border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 print:hidden"
>
	<div class="container mx-auto px-4 py-6">
		<div
			class="flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground"
		>
			<p class="flex flex-1 items-center justify-center">
				Made with &nbsp;<CoffeeIcon class="size-4 text-amber-800 dark:text-amber-700" />&nbsp; by
				&nbsp;
				<Button
					href="https://ananddesai.dev"
					target="_blank"
					rel="noopener noreferrer"
					variant="link"
					class="m-0 p-0 font-normal text-muted-foreground transition-colors duration-300 hover:text-primary"
				>
					Anand Desai
				</Button>
			</p>
			<p class="text-xs">© {currentYear} Nirnshard. All rights reserved.</p>
		</div>
	</div>
</footer>
