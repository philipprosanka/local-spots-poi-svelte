<script lang="ts">
  import SpotMap from '$lib/components/SpotMap.svelte';
  let { data } = $props();
</script>

<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
</svelte:head>

<section class="section">
  <div class="container">
    <div class="has-text-centered mb-6">
        <h1 class="title is-2 coffee-text">Global Intelligence</h1>
        <p class="subtitle">Managing {data.allSpots.length} locations across the network</p>
    </div>

    <div class="box mb-6">
        <div class="level is-mobile mb-4">
            <div class="level-left"><h2 class="title is-4">Master Map</h2></div>
            <div class="level-right"><span class="tag is-primary is-light">{data.allSpots.length} Spots</span></div>
        </div>
        
        <SpotMap 
            spots={data.allSpots} 
            categories={data.categories} 
            height="500px" 
            interactive={true} 
        />
        <p class="is-size-7 mt-2 has-text-grey is-italic">
             <i class="fas fa-layer-group mr-1"></i> Switch between Map & Satellite view using the layer icon.
        </p>
    </div>

    <hr class="my-6">

    <h2 class="title is-4 mb-5">Category Deep Dive</h2>

    <div class="columns is-multiline">
        
        <div class="column is-6">
            <div class="card map-card">
                <div class="card-content p-0">
                    <SpotMap spots={data.natureSpots} categories={data.categories} height="250px" interactive={true} />
                </div>
                <div class="card-content">
                    <p class="title is-5"><span class="icon has-text-success mr-2"><i class="fas fa-tree"></i></span>Nature</p>
                    <p class="subtitle is-6">{data.natureSpots.length} Spots</p>
                </div>
            </div>
        </div>

        <div class="column is-6">
            <div class="card map-card">
                <div class="card-content p-0">
                    <SpotMap spots={data.foodSpots} categories={data.categories} height="250px" interactive={true} />
                </div>
                <div class="card-content">
                    <p class="title is-5"><span class="icon has-text-danger mr-2"><i class="fas fa-utensils"></i></span>Food & Drink</p>
                    <p class="subtitle is-6">{data.foodSpots.length} Spots</p>
                </div>
            </div>
        </div>

        <div class="column is-6">
            <div class="card map-card">
                <div class="card-content p-0">
                    <SpotMap spots={data.cultureSpots} categories={data.categories} height="250px" interactive={true} />
                </div>
                <div class="card-content">
                    <p class="title is-5"><span class="icon has-text-info mr-2"><i class="fas fa-landmark"></i></span>Culture</p>
                    <p class="subtitle is-6">{data.cultureSpots.length} Spots</p>
                </div>
            </div>
        </div>

       <div class="column is-6">
            <div class="card map-card">
                <div class="card-content p-0">
                    <SpotMap spots={data.nightlifeSpots} categories={data.categories} height="250px" interactive={true} />
                </div>
                <div class="card-content">
                    <p class="title is-5">
                        <span class="icon mr-2" style="color: #8A2BE2;">
                            <i class="fas fa-cocktail"></i>
                        </span>
                        Nightlife
                    </p>
                    <p class="subtitle is-6">{data.nightlifeSpots.length} Spots</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</section>

<style>
    .coffee-text { color: #6F4E37; }
    .map-card {
        border-radius: 8px;
        transition: transform 0.2s, box-shadow 0.2s;
    }
    .map-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
</style>