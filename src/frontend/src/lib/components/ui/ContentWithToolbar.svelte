<script lang="ts">
	import { nonNullish } from '@dfinity/utils';

	export let minHeight: string | undefined = undefined;
</script>

<div class={`stretch ${nonNullish(minHeight) ? `min-h-[${minHeight}]` : ''}`}>
	<slot />
</div>

<div class="flex w-full">
	<slot name="toolbar" />
</div>
