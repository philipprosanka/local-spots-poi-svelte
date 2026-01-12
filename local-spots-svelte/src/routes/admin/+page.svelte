<script lang="ts">
    import { onMount } from "svelte";
    import { api } from "$lib/api";
    import { auth } from "$lib/runes.svelte";
    import type { User } from "$lib/types/localspot-types";
    import { goto } from "$app/navigation";

    let users = $state<User[]>([]);

    onMount(async () => {
        if (!auth.isAuthenticated) {
             goto("/login");
             return;
        }
        try {
            users = await api.get("users");
        } catch (e) {
            console.log("Nicht autorisiert oder Fehler", e);
        }
    });

    async function deleteUser(id: string) {
        // 1. Store the current list in case we need to undo (rollback)
        const previousUsers = [...users];

        // 2. Instant UI update: Remove the user from the local $state immediately
        users = users.filter(u => u._id !== id);

        try {
            // 3. Perform the actual API call in the background
            await api.delete(`users/${id}`);
            // Success - the user is already gone from the UI!
        } catch (e) {
            // 4. Rollback: If the server fails, put the users back and then alert
            users = previousUsers;
            console.error("Delete failed", e);
            alert("Could not delete user. You might not have permission.");
        }
    }
</script>

<section class="section">
    <div class="container">
        <h1 class="title">Admin Dashboard</h1>
        <div class="box">
            <table class="table is-fullwidth is-striped">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Admin?</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {#each users as user}
                        <tr>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.isAdmin ? '✅' : ''}</td>
                            <td>
                                {#if !user.isAdmin}
                                    <button class="button is-small is-danger" onclick={() => deleteUser(user._id)}>
                                        Delete
                                    </button>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</section>