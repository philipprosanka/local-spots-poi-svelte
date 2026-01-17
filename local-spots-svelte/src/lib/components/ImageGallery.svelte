<script lang="ts">
  import { enhance } from '$app/forms';

  type ImageItem = string | { url: string; publicId: string };

  let { 
      images = [], 
      spotId = '' 
  }: { 
      images: ImageItem[], 
      spotId?: string
  } = $props();

  let selectedIndex = $state(0);

  
  $effect(() => {
      
      if (images && selectedIndex >= images.length) {
          selectedIndex = 0;
      }
  });
  

  function getUrl(img: any): string {
      if (!img) return '';
      if (typeof img === 'string') return img;
      if (img.url) return img.url;
      if (img.secure_url) return img.secure_url;
      return ''; 
  }

  function getPublicId(img: any): string | null {
      if (img && typeof img === 'object' && 'publicId' in img) {
          return img.publicId;
      }
      return null;
  }

  // Wir prüfen hier sicherheitshalber, ob das Image an der Stelle existiert
  let currentImage = $derived(images && images[selectedIndex]);
  
  let currentPublicId = $derived(
      currentImage ? getPublicId(currentImage) : null
  );
</script>

<div class="gallery-container">
    {#if images && images.length > 0}
        <div class="hero-image-wrapper mb-3 shadow-sm">
            <img 
                src={getUrl(currentImage)} 
                alt="Detail view" 
                class="hero-image kenburns-effect"
                onerror={(e) => console.log("Image Load Error", e)}
            />
            
            <div class="overlay-gradient"></div>

            {#if currentPublicId && spotId}
                <form 
                    action="?/deleteImage" 
                    method="POST" 
                    use:enhance={() => {
                        
                        return async ({ update }) => {
                            await update(); 
                            
                        };
                    }}
                    class="hero-delete-form"
                >
                    <input type="hidden" name="spotId" value={spotId}>
                    <input type="hidden" name="imageId" value={currentPublicId}>
                    
                    <button class="button delete-btn glass-btn" aria-label="Delete image">
                        <span class="icon is-small"><i class="fas fa-trash"></i></span>
                    </button>
                </form>
            {/if}
        </div>

        {#if images.length > 1}
            <div class="thumbnails-scroll custom-scrollbar pl-1 pr-1 pb-2">
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
        <div class="hero-image-wrapper has-background-light is-flex is-align-items-center is-justify-content-center empty-gallery">
            <div class="has-text-centered opacity-50">
                <span class="icon is-large text-muted mb-2">
                    <i class="far fa-image fa-3x"></i>
                </span>
                <p class="is-size-7 text-muted font-poppins uppercase tracking-wide">No Images</p>
            </div>
        </div>
    {/if}
</div>

<style>
    /* ... deine Styles ... */
    :root {
        --gallery-radius: 16px;
        --thumb-radius: 10px;
        --accent-color: #C57B57; 
    }
    .gallery-container { width: 100%; position: relative; }
    .hero-image-wrapper {
        width: 100%; height: 280px; 
        border-radius: var(--gallery-radius);
        overflow: hidden;
        background-color: #f0f0f0; 
        position: relative; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    }
    .hero-image { width: 100%; height: 100%; object-fit: cover; transition: transform 10s ease; }
    .hero-image-wrapper:hover .hero-image.kenburns-effect { transform: scale(1.05); }
    .overlay-gradient {
        position: absolute; top: 0; left: 0; width: 100%; height: 60px;
        background: linear-gradient(to bottom, rgba(0,0,0,0.2), transparent);
        pointer-events: none;
        border-top-left-radius: var(--gallery-radius);
        border-top-right-radius: var(--gallery-radius);
    }
    .empty-gallery {
        background-image: radial-gradient(#e0e0e0 1px, transparent 1px);
        background-size: 20px 20px;
        border: 2px dashed #d0d0d0;
    }
    .hero-delete-form { position: absolute; top: 12px; left: 12px; z-index: 10; }
    .delete-btn.glass-btn { 
        border-radius: 50%; height: 40px; width: 40px; padding: 0; 
        background: rgba(255, 255, 255, 0.25); backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.4); color: white;
        cursor: pointer; transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }
    .delete-btn:hover { 
        transform: scale(1.15); opacity: 1; 
        background-color: #ff3860 !important; border-color: #ff3860;
        box-shadow: 0 6px 15px rgba(211, 47, 47, 0.3);
    }
    .thumbnails-scroll { 
        display: flex; gap: 10px; overflow-x: auto; padding: 4px 2px 8px 2px;
        scrollbar-width: thin; scrollbar-color: var(--accent-color) transparent;
    }
    .custom-scrollbar::-webkit-scrollbar { height: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(197, 123, 87, 0.3); border-radius: 4px; }
    .thumbnail-btn {
        width: 64px; height: 64px; padding: 2px;
        background: var(--color-white); border-radius: var(--thumb-radius); 
        cursor: pointer; overflow: hidden; opacity: 0.7; flex-shrink: 0; 
        transition: all 0.3s ease; border: 2px solid transparent;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }
    .thumbnail-btn img { border-radius: 8px; width: 100%; height: 100%; object-fit: cover; }
    .thumbnail-btn:hover { opacity: 1; transform: translateY(-3px); }
    .thumbnail-btn.is-active { 
        opacity: 1; border-color: var(--accent-color); 
        box-shadow: 0 4px 12px rgba(197, 123, 87, 0.25); transform: translateY(-2px);
    }
</style>