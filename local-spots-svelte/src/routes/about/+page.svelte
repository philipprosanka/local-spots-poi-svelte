<script lang="ts">
    import { auth } from "$lib/runes.svelte";
</script>

<section class="hero is-medium">
  <div class="hero-body has-text-centered">
    <p class="title mb-6">
      Local Spots: Explore and Share Local Spot Experiences
    </p>
    
    <div class="columns is-centered is-vcentered">
      <div class="column is-8">
        <div class="box has-background-white-ter">
          <figure class="image is-3by2 mb-4">
            <img class="is-rounded" style="object-fit: cover;" src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Adventure Map">
          </figure>
          
          <div class="content is-medium mt-5">
            <p>
              Welcome to <strong>Local Spots</strong>. Our mission is to help people discover, 
              rate, and share unique points of interest in their neighborhood. 
              Whether it's hidden cafes, peaceful parks, or breathtaking urban viewpoints, 
              Local Spots is your guide to the best experiences nearby.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <p class="mt-6">
      <span class="icon is-large" style="color: #8B4513;">
        <i class="fas fa-map-marked-alt fa-3x"></i>
      </span>
    </p>
  </div>
</section>