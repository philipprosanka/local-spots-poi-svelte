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
        if(confirm("Are you sure?")) {
            await api.delete(`users/${id}`);
            users = users.filter(u => u._id !== id);
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