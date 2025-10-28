<script lang="ts">
	import { UploadIcon, XIcon, ImageIcon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	interface Props {
		onFileChange: (file: File | null) => void;
		accept?: string;
		maxSize?: number; // in MB
		previewUrl?: string;
	}

	let {
		onFileChange,
		accept = 'image/png,image/jpeg,image/jpg,image/webp',
		maxSize = 10,
		previewUrl
	}: Props = $props();

	let isDragging = $state(false);
	let fileInput: HTMLInputElement;

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;

		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			handleFile(files[0]);
		}
	}

	function handleFileInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			handleFile(file);
		}
	}

	function handleFile(file: File) {
		// Validate file type
		const acceptedTypes = accept.split(',').map((t) => t.trim());
		if (!acceptedTypes.includes(file.type)) {
			alert(`Please upload a valid file type: ${accept}`);
			return;
		}

		// Validate file size
		const maxSizeBytes = maxSize * 1024 * 1024;
		if (file.size > maxSizeBytes) {
			alert(`File size must be less than ${maxSize}MB`);
			return;
		}

		onFileChange(file);
	}

	function clearFile() {
		onFileChange(null);
		if (fileInput) {
			fileInput.value = '';
		}
	}

	function triggerFileInput() {
		fileInput?.click();
	}
</script>

<div class="w-full">
	<div
		role="button"
		tabindex="0"
		class={cn(
			'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
			isDragging
				? 'border-primary bg-primary/10'
				: 'border-border bg-muted/40 hover:border-primary/50 hover:bg-muted/60',
			'cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none'
		)}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		onclick={triggerFileInput}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				triggerFileInput();
			}
		}}
	>
		{#if previewUrl}
			<div class="relative mb-4">
				<img src={previewUrl} alt="Preview" class="h-32 w-32 rounded-md object-cover" />
				<Button
					variant="destructive"
					size="icon"
					class="absolute -top-2 -right-2 h-6 w-6 rounded-full"
					onclick={(e) => {
						e.stopPropagation();
						clearFile();
					}}
				>
					<XIcon class="h-3 w-3" />
				</Button>
			</div>
		{:else}
			<div class="mb-4 rounded-full bg-primary/10 p-4">
				{#if isDragging}
					<UploadIcon class="h-8 w-8 text-primary" />
				{:else}
					<ImageIcon class="h-8 w-8 text-muted-foreground" />
				{/if}
			</div>
		{/if}

		<div class="text-center">
			<p class="mb-2 text-sm font-medium">
				{#if previewUrl}
					Click to change image or drag a new one
				{:else if isDragging}
					Drop your image here
				{:else}
					Drag and drop your image here
				{/if}
			</p>
			<p class="text-xs text-muted-foreground">
				PNG, JPEG, or WEBP (max {maxSize}MB)
			</p>
		</div>

		<input
			bind:this={fileInput}
			type="file"
			{accept}
			class="hidden"
			onchange={handleFileInput}
			aria-label="File upload"
		/>
	</div>
</div>
