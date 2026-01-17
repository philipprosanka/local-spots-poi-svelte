<script lang="ts">
  import { enhance } from '$app/forms';

  // Typ-Definitionen
  type ImageItem = string | { url: string; publicId: string };

  let { 
      images = [], 
      spotId = '' 
  }: { 
      images: ImageItem[], 
      spotId?: string
  } = $props();

  let selectedIndex = $state(0);

  // Helper: URL extrahieren (Robust)
  function getUrl(img: any): string {
      if (!img) return '';
      if (typeof img === 'string') return img;
      if (img.url) return img.url;
      if (img.secure_url) return img.secure_url;
      return ''; 
  }

  // Helper: ID extrahieren
  function getPublicId(img: any): string | null {
      if (img && typeof img === 'object' && 'publicId' in img) {
          return img.publicId;
      }
      return null;
  }

  let currentPublicId = $derived(
      images && images.length > 0 && images[selectedIndex] 
      ? getPublicId(images[selectedIndex]) 
      : null
  );
</script>

<div class="gallery-container">
    {#if images && images.length > 0}
        <div class="hero-image-wrapper mb-3">
            <img 
                src={getUrl(images[selectedIndex])} 
                alt="Detail view" 
                class="hero-image"
                onerror={(e) => console.log("Image Load Error", e)}
            />
            
            {#if currentPublicId && spotId}
                <form 
                    action="?/deleteImage" 
                    method="POST" 
                    use:enhance
                    class="hero-delete-form"
                >
                    <input type="hidden" name="spotId" value={spotId}>
                    <input type="hidden" name="imageId" value={currentPublicId}>
                    
                    <button class="button is-small is-danger delete-btn" aria-label="Delete image">
                        <span class="icon is-small"><i class="fas fa-trash"></i></span>
                    </button>
                </form>
            {/if}
        </div>

        {#if images.length > 1}
            <div class="thumbnails-scroll">
                {#each images as img, i}
                    <button 
                        type="button"
                        class="thumbnail-btn {selectedIndex === i ? 'is-active' : ''}"
                        onclick={() => selectedIndex = i}
                        aria-label="View image {i + 1}"
                    >
                        <img 
                            src={getUrl(img)} 
                            alt="Thumb" 
                            class="thumbnail-img"
                        />
                    </button>
                {/each}
            </div>
        {/if}
    {:else}
        <div class="hero-image-wrapper has-background-light is-flex is-align-items-center is-justify-content-center">
            <span class="icon is-large has-text-grey-light">
                <i class="fas fa-image fa-3x"></i>
            </span>
            <p class="is-size-7 ml-2 text-muted">No Images</p>
        </div>
    {/if}
</div>

<style>
    .gallery-container { width: 100%; position: relative; }
    
    .hero-image-wrapper {
        width: 100%; height: 280px; border-radius: 12px; overflow: hidden;
        background-color: #f5f5f5; position: relative; border: 1px solid rgba(0,0,0,0.05);
    }
    .hero-image { width: 100%; height: 100%; object-fit: cover; }
    
    .hero-delete-form { position: absolute; top: 10px; right: 10px; z-index: 10; }
    .delete-btn { 
        border-radius: 50%; height: 36px; width: 36px; padding: 0; 
        border: 2px solid white; cursor: pointer; transition: all 0.2s; opacity: 0.8;
    }
    .delete-btn:hover { transform: scale(1.1); opacity: 1; background-color: #ff3860 !important; color: white !important; }

    .thumbnails-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 5px; scrollbar-width: thin; }
    
    /* FIX: Button Reset Styles für Thumbnails */
    .thumbnail-btn {
        width: 60px; height: 60px; padding: 0; border: 2px solid transparent; 
        background: none; border-radius: 8px; cursor: pointer; overflow: hidden; 
        opacity: 0.6; flex-shrink: 0; transition: all 0.2s;
    }
    .thumbnail-btn:hover, .thumbnail-btn.is-active { opacity: 1; border-color: #6F4E37; transform: translateY(-2px); }
    
    .thumbnail-img { width: 100%; height: 100%; object-fit: cover; }
</style>