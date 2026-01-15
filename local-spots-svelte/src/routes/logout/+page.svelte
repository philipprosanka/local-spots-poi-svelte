<script lang="ts">
  import { onMount } from "svelte";
  import { authService } from "$lib/services/auth-service";
  import { goto } from "$app/navigation";

  onMount(() => {
    authService.logout();
    
    // Timeout für Redirect
    setTimeout(() => {
        goto("/");
    }, 500);
  });
</script>

<section class="section">
    <div class="container has-text-centered">
        <h2 class="title is-4">Logging out...</h2>
        <progress class="progress is-small is-primary" max="100">15%</progress>
    </div>
</section>