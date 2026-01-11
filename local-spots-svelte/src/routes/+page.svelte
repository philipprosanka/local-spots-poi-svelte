<script lang="ts">
  import { auth } from "$lib/runes.svelte";
</script>




<section class="hero is-fullheight-with-navbar is-light">
  <div class="hero-body">
    <div class="container">
      <div class="columns is-vcentered">
        
        <div class="column is-5 has-text-centered-mobile">
          <p class="title is-2 mb-6">
            Welcome to <span style="color: #8B4513;">Local Spots</span>
          </p>
          
          <p class="subtitle is-4 mb-6">
            Sign up or Log in to discover the best hidden gems in your neighborhood.
          </p>
          
          {#if !auth.token}
            <div class="buttons are-medium">
              <a href="/login" class="button is-primary is-rounded px-6">Log in</a>
              <a href="/signup" class="button is-light is-rounded px-6">Sign up</a>
            </div>
          {:else}
             <a href="/dashboard" class="button is-primary is-rounded px-6">Go to Dashboard</a>
          {/if}
        </div>

        <div class="column is-7">
          <figure class="image is-4by3">
            <img 
              src="/images/idylic_cafe.jpg" 
              alt="Idyllic Cafe" 
              style="border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.1); object-fit: cover;"
            >
          </figure>
        </div>

      </div>
    </div>
  </div>
</section>