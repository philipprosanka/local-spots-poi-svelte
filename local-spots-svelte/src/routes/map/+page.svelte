<script lang="ts">
  import { onMount } from 'svelte';
  import SpotMap from '$lib/components/SpotMap.svelte';
  import { userState } from "$lib/runes.svelte";

  let isLoading = $state(true);

  onMount(async () => {
    try {
      // Ensure the global state is populated. 
      // If the Dashboard already ran this, it will be nearly instant.
      await userState.refresh();
    } finally {
      isLoading = false;
    }
  });
</script>

<section class="section">
  <div class="container">
    <div class="level">
      <div class="level-left">
        <h1 class="title">My Global Map</h1>
      </div>
      <div class="level-right">
        <p class="has-text-grey">Showing {userState.spots.length} private spots.</p>
      </div>
    </div>

    {#if isLoading}
      <progress class="progress is-primary" max="100">Loading Map Data...</progress>
    {:else}
      <SpotMap spots={userState.spots} categories={userState.categories} />
    {/if}
  </div>
</section>