<script lang="ts">
  import { userState } from "$lib/runes.svelte";

</script>

<div class="table-container">
  <table class="table is-fullwidth is-striped is-hoverable">
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Category</th>
        <th>Latitude</th>
        <th>Longitude</th>
      </tr>
    </thead>
    <tbody>
      {#each userState.spots as spot}
        <tr>
          <td><strong>{spot.title}</strong></td>
          <td>{spot.description}</td>
          <td>
            <span class="tag is-info is-light">
              {typeof spot.category === 'object' ? spot.category?.name ?? 'Uncategorized' : 'Uncategorized'}
            </span>
          </td>
          <td class="is-family-monospace">{spot.latitude.toFixed(4)}</td>
          <td class="is-family-monospace">{spot.longitude.toFixed(4)}</td>
        </tr>
      {/each}
      
      {#if userState.spots.length === 0}
        <tr>
          <td colspan="5" class="has-text-centered has-text-grey italic">
            No spots found.
          </td>
        </tr>
      {/if}
    </tbody>
  </table>
</div>