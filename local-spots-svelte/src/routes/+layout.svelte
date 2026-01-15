<script lang="ts">
  import "../app.css"; // Ensure Bulma/CSS is loaded
  import Navbar from "$lib/components/Navbar.svelte";
  import { auth, userState } from "$lib/runes.svelte";
  import { onMount } from "svelte";
  
  
  export const ssr = true;       // Server Side Rendering ON
  export const prerender = false; // Static Site Generation OFF

  // This ensures data is fetched only once when the app starts
  onMount(async () => {
    if (auth.isAuthenticated) {
      await userState.refresh();
    }
  });
</script>

<Navbar />

<main>
  <slot /> </main>