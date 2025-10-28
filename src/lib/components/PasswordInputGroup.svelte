<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as InputGroup from '$lib/components/ui/input-group';
	import { Badge } from '$lib/components/ui/badge';
	import {
		EyeIcon,
		EyeOffIcon,
		CheckIcon,
		LockIcon,
		ChevronDownIcon,
		BadgeCheckIcon
	} from 'lucide-svelte';
	import type { WifiSecurityType } from '$lib/utils/wifi';

	interface Props {
		password: string;
		securityType: WifiSecurityType;
		onSecurityTypeChange: (type: WifiSecurityType) => void;
		onPasswordChange?: () => void;
		disabled?: boolean;
	}

	let {
		password = $bindable(),
		securityType = $bindable(),
		onSecurityTypeChange,
		onPasswordChange,
		disabled = false
	}: Props = $props();

	let showPassword = $state(false);

	const securityOptions: {
		value: WifiSecurityType;
		label: string;
		description: string;
		recommended?: boolean;
	}[] = [
		{ value: 'WPA3', label: 'WPA3', description: 'Latest and most secure', recommended: true },
		{ value: 'WPA2', label: 'WPA/WPA2', description: 'Most common' },
		{ value: 'WEP', label: 'WEP', description: 'Legacy and insecure' },
		{ value: 'nopass', label: 'Open Network', description: 'No password required' }
	];

	function getSecurityLabel(type: WifiSecurityType): string {
		return securityOptions.find((opt) => opt.value === type)?.label || 'WPA3';
	}

	function handleSecuritySelect(type: WifiSecurityType) {
		securityType = type;
		onSecurityTypeChange(type);
	}

	function handlePasswordInput() {
		if (onPasswordChange) {
			onPasswordChange();
		}
	}
</script>

<InputGroup.Root>
	<!-- Show/Hide Password Toggle (Leading) -->
	<InputGroup.Addon>
		<InputGroup.Button
			variant="ghost"
			size="icon-xs"
			aria-label={showPassword ? 'Hide password' : 'Show password'}
			onclick={() => (showPassword = !showPassword)}
			class="transition-colors"
		>
			{#if showPassword}
				<EyeOffIcon class="h-4 w-4 transition-transform hover:scale-110" />
			{:else}
				<EyeIcon class="h-4 w-4 transition-transform hover:scale-110" />
			{/if}
		</InputGroup.Button>
	</InputGroup.Addon>

	<!-- Password Input -->
	<InputGroup.Input
		type={showPassword ? 'text' : 'password'}
		placeholder="Enter WiFi password"
		bind:value={password}
		oninput={handlePasswordInput}
		{disabled}
		class="font-mono"
	/>

	<!-- Security Type Dropdown (Trailing) -->
	<InputGroup.Addon align="inline-end">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<InputGroup.Button
						{...props}
						variant="secondary"
						class="pr-1.5! text-xs transition-colors"
					>
						<LockIcon class="mr-1 h-3 w-3 transition-transform hover:scale-110" />
						{getSecurityLabel(securityType)}
						<ChevronDownIcon class="ml-1 h-3 w-3 transition-transform" />
					</InputGroup.Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				{#each securityOptions as option (option.value)}
					<DropdownMenu.Item
						onclick={() => handleSecuritySelect(option.value)}
						class="transition-colors"
					>
						<div class="flex w-full items-center justify-center gap-2">
							<CheckIcon
								class="mt-0.5 h-4 w-4 transition-opacity {securityType === option.value
									? 'opacity-100'
									: 'opacity-0'}"
							/>
							<div class="flex flex-1 flex-col">
								<div class="flex items-center gap-2">
									<span class="font-medium">{option.label}</span>
									{#if option.recommended}
										<Badge
											variant="secondary"
											class="border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-xs text-emerald-700 dark:text-emerald-500"
										>
											<BadgeCheckIcon class="size-3 text-emerald-700 dark:text-emerald-500" />
											Recommended
										</Badge>
										<!-- <Badge variant="" class="px-1.5 py-0 text-xs"></Badge> -->
									{/if}
								</div>
								<span class="text-xs text-muted-foreground">{option.description}</span>
							</div>
						</div>
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</InputGroup.Addon>
</InputGroup.Root>
