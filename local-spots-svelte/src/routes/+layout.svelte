<script lang="ts">
  import "../app.css"; // WICHTIG: Hier laden wir das Coffee-Theme
  import Navbar from "$lib/components/Navbar.svelte";
  
  let { children } = $props();
</script>

<div class="app-container">
  <Navbar /> <main>
    {@render children()}
  </main>
</div>