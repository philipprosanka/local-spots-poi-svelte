<script lang="ts">
    import "../app.css"; // Ensure Bulma/CSS is loaded
    import Navbar from "$lib/components/Navbar.svelte";
    import { page } from '$app/stores';
    import type { LayoutData} from './$types';
     
    let { data, children } = $props();
</script>

<div class="app-container">
    <Navbar user={data.user} />
    
    <main class="main-content">
        {@render children()}
    </main>
</div>