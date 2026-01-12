<script lang="ts">
  import { auth } from "$lib/runes.svelte";
  import { page } from "$app/stores"; 
  import { goto } from "$app/navigation";
  import type { Category } from "$lib/types/localspot-types";
  import { onMount } from "svelte";
  import { localSpotService } from "$lib/services/localspot-service";
  import { userState } from "$lib/runes.svelte";

  let categories = $state<Category[]>([]);
  
  let isOpen = $state(false);

  function toggleMenu() {
    isOpen = !isOpen;
  }

  function logout() {
  auth.isAuthenticated = false;
  // Clear the private data immediately!
  userState.spots = [];
  userState.categories = [];
  goto("/login");
}

  function isActive(path: string): string {
    return $page.url.pathname === path ? 'is-active' : '';
  }
</script>

<nav class="navbar is-coffee" aria-label="main navigation">
  <div class="container">
   <div class="navbar-brand">
  <a 
    class="navbar-item title is-4 coffee-text mb-0" 
    href={auth.isAuthenticated ? "/dashboard" : "/"}
    style={!auth.isAuthenticated ? "cursor: default;" : ""}
  >
    <i class="fas fa-mug-hot mr-2"></i> Local Spots
  </a>
</div>

    <div class="navbar-menu is-active">
      <div class="navbar-start">
        {#if auth.isAuthenticated}
          <a class="navbar-item {isActive('/dashboard')}" href="/dashboard">Dashboard</a>
          <a class="navbar-item {isActive('/map')}" href="/map">Global Map</a>
          <a class="navbar-item {isActive('/charts')}" href="/charts">Analytics</a>
          <a class="navbar-item {isActive('/about')}" href="/about">About</a>

          {#if auth.isAdmin}
            <a class="navbar-item admin-link" href="/admin">Admin Panel</a>
          {/if}
        {/if}
      </div>

      <div class="navbar-end">
  <div class="navbar-item">
    {#if auth.isAuthenticated}
      <div class="field is-grouped is-align-items-center">
        <p class="control">
          <span class="tag is-coffee-light is-medium">
            <i class="fas fa-user-circle mr-2"></i> 
            {#if auth.user?.firstName || auth.user?.lastName}
              {auth.user?.firstName} {auth.user?.lastName}
            {:else}
              {auth.user?.email}
            {/if}
          </span>
        </p>
        <p class="control">
          <button class="button is-small is-danger is-light" onclick={() => auth.logout()}>
            Logout
          </button>
        </p>
      </div>
    {/if}
  </div>
</div>
    </div>
  </div>
</nav>

<style>
  .is-coffee { background-color: #faf7f2; border-bottom: 2px solid #6F4E37; }
  .coffee-text { color: #6F4E37; font-weight: 800; }
  .is-coffee-light { background-color: #f0e6d6; color: #6F4E37; border: 1px solid #d2b48c; }
  .admin-link { color: #A67B5B; font-weight: bold; border-left: 1px solid #ddd; margin-left: 10px; padding-left: 20px; }


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