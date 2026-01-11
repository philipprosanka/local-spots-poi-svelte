<script lang="ts">
  let { localspots } = $props();
</script>

<table class="table is-fullwidth">
  <thead>
    <tr>
      <th>Name</th>
      <th>Beschreibung</th>
      <th>Kategorie</th>
      <th>Latitude</th>
      <th>Longitude</th>
    </tr>
  </thead>
  <tbody>
    {#each localspots as spot}
      <tr>
        <td>{spot.name}</td>
        <td>{spot.description}</td>
        <td>{spot.category?.name}</td>
        <td>{spot.lat}</td>
        <td>{spot.lng}</td>
      </tr>
    {/each}
  </tbody>
</table>