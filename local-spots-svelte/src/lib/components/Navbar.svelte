<script lang="ts">
  import { auth } from "$lib/runes.svelte";
  import { page } from "$app/stores"; 
  import { goto } from "$app/navigation";
  
  let isOpen = $state(false);

  function toggleMenu() {
    isOpen = !isOpen;
  }

  function logout() {
    auth.logout();
    isOpen = false;
    goto("/"); 
  }

  function isActive(path: string): string {
    return $page.url.pathname === path ? 'is-active' : '';
  }
</script>

<nav class="navbar is-coffee" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item title is-4 mb-0 mr-4" href="/" style="color: #8B4513;">
      <i class="fas fa-map-marked-alt mr-2"></i> Local Spots
    </a>

    <a role="button" class="navbar-burger {isOpen ? 'is-active' : ''}" aria-label="menu" aria-expanded="false" onclick={toggleMenu}>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div class="navbar-menu {isOpen ? 'is-active' : ''}">
    <div class="navbar-start">
      {#if auth.isAuthenticated}
        <a class="navbar-item {isActive('/dashboard')}" href="/dashboard">Dashboard</a>
        <a class="navbar-item {isActive('/about')}" href="/about">About</a>
        
        {#if auth.isAdmin}
          <a class="navbar-item {isActive('/admin')}" href="/admin">Admin Panel</a>
        {/if}
      {/if}
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        {#if auth.isAuthenticated}
          <button class="button is-light is-small" onclick={logout}>
            <span class="icon"><i class="fas fa-sign-out-alt"></i></span>
            <span>Logout ({auth.user?.email})</span>
          </button>
        {:else}
          <div class="buttons">
            <a href="/login" class="button is-primary is-small">Log in</a>
            <a href="/signup" class="button is-light is-small">Sign up</a>
          </div>
        {/if}
      </div>
    </div>
  </div>
</nav>

<style>
  .navbar.is-coffee { 
    background-color: #f5f5f5; 
    border-bottom: 2px solid #e0e0e0; 
  }
  .navbar-item.is-active {
    background-color: #3F5D45 !important;
    color: #fff !important;
    border-radius: 4px;
  }
</style>