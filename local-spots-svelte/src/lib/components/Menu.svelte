<script lang="ts">
  import { auth } from "$lib/runes.svelte";
  import { goto } from "$app/navigation";
  
  // Svelte 5 Syntax für Props
  let { active = "" } = $props();

  function handleLogout() {
    auth.logout();
    goto("/login");
  }
</script>

<nav class="navbar custom-navbar">
  <div class="navbar-brand">
    <a class="navbar-item" href="/dashboard">
      <span class="icon"><i class="fas fa-map-marker-alt"></i></span>
      <span class="ml-1"><strong>Localspots</strong></span>
    </a>
  </div>
  <div id="navbarMenu" class="navbar-menu">
    <div class="navbar-end">
      {#if auth.token}
        <a class="navbar-item {active === 'dashboard' ? 'is-active' : ''}" href="/dashboard">Dashboard</a>
        <a class="navbar-item {active === 'about' ? 'is-active' : ''}" href="/about">About</a>
        
        {#if auth.user?.isAdmin}
          <a class="navbar-item {active === 'admin' ? 'is-active' : ''}" href="/admin">Admin Dashboard</a>
        {/if}
        
        <a class="navbar-item" href="#" onclick={handleLogout}>Logout [{auth.user?.email}]</a>
      {:else}
        <a class="navbar-item {active === 'login' ? 'is-active' : ''}" href="/login">Log in</a>
        <a class="navbar-item {active === 'signup' ? 'is-active' : ''}" href="/signup">Sign up</a>
      {/if}
    </div>
  </div>
</nav>