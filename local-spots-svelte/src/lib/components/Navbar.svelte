<script lang="ts">
  import { page } from "$app/stores"; 
  import { enhance } from '$app/forms';

  
  let { user } = $props();

  function isActive(path: string): string {
    return $page.url.pathname === path ? 'is-active' : '';
  }
</script>

<nav class="navbar is-coffee" aria-label="main navigation">
  <div class="container">
    <div class="navbar-brand">
      <a 
        class="navbar-item title is-4 coffee-text mb-0" 
        href={user ? "/dashboard" : "/"}
        style={!user ? "cursor: default;" : ""}
      >
        <i class="fas fa-mug-hot mr-2"></i> Local Spots
      </a>
    </div>

    <div class="navbar-menu is-active">
      <div class="navbar-start">
        {#if user}
          <a class="navbar-item {isActive('/dashboard')}" href="/dashboard">Dashboard</a>
          <a class="navbar-item {isActive('/map')}" href="/map">Global Map</a>
          <a class="navbar-item {isActive('/charts')}" href="/charts">Analytics</a>
          <a class="navbar-item {isActive('/about')}" href="/about">About</a>

          {#if user.isAdmin}
            <a class="navbar-item admin-link" href="/admin">Admin Panel</a>
          {/if}
        {/if}
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          {#if user}
            <div class="field is-grouped is-align-items-center">
              <p class="control">
                <span class="tag is-coffee-light is-medium">
                  <i class="fas fa-user-circle mr-2"></i> 
                  {#if user?.firstName || user?.lastName}
                    {user.firstName} {user.lastName}
                  {:else}
                    {user?.email ?? 'User'}
                  {/if}
                </span>
              </p>
              
              <div class="control">
                <form action="/logout" method="POST" use:enhance>
                    <button class="button is-small is-danger is-light">
                        Logout
                    </button>
                </form>
              </div>
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