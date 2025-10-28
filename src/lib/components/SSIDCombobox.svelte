<script lang="ts">
	import { tick } from 'svelte';
	import { CheckIcon, ChevronsUpDownIcon, WifiIcon } from 'lucide-svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { getSSIDHistory } from '$lib/utils/ssid-storage';

	interface Props {
		value: string;
		onValueChange: (value: string) => void;
	}

	let { value = $bindable(), onValueChange }: Props = $props();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement | null>(null);

	// Get SSID history from localStorage
	let ssidHistory = $state(getSSIDHistory());

	// Refresh history when popover opens
	function handleOpenChange(newOpen: boolean) {
		open = newOpen;
		if (newOpen) {
			ssidHistory = getSSIDHistory();
		}
	}

	async function handleSelect(selectedSSID: string) {
		value = selectedSSID;
		onValueChange(selectedSSID);
		open = false;
		await tick();
		triggerRef?.focus();
	}
</script>

<Popover.Root bind:open onOpenChange={handleOpenChange}>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				bind:ref={triggerRef}
				variant="outline"
				role="combobox"
				aria-expanded={open}
				class="max-w-full justify-between sm:w-sm md:w-md lg:w-lg xl:w-xl 2xl:w-2xl"
			>
				<span class="flex items-center gap-2">
					<WifiIcon class="h-4 w-4 text-muted-foreground" />
					{#if value}
						<span class="truncate">{value}</span>
					{:else}
						<span class="text-muted-foreground">Select or type network name...</span>
					{/if}
				</span>
				<ChevronsUpDownIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="max-w-full sm:w-sm md:w-md lg:w-lg xl:w-xl 2xl:w-2xl">
		<Command.Root>
			<Command.Input placeholder="Search or type network name..." bind:value />
			<Command.List>
				<Command.Empty class="text-muted-foreground"
					>No networks saved yet. Please enter a network name.</Command.Empty
				>
				{#if ssidHistory.length > 0}
					<Command.Group heading="Recent Networks">
						{#each ssidHistory as item (item.ssid)}
							<Command.Item value={item.ssid} onSelect={() => handleSelect(item.ssid)}>
								<CheckIcon
									class={cn('mr-2 h-4 w-4', value === item.ssid ? 'opacity-100' : 'opacity-0')}
								/>
								<div class="flex flex-1 items-center justify-between">
									<span>{item.ssid}</span>
								</div>
							</Command.Item>
						{/each}
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
