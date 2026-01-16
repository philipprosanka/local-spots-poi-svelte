<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';

    // 1. User Daten vom Server empfangen
    let { data }: { data: PageData } = $props();
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
                    {#each data.users as user (user._id)}
                        <tr>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.isAdmin ? '✅' : ''}</td>
                            <td>
                                {#if !user.isAdmin}
                                    <form method="POST" action="?/deleteUser" use:enhance>
                                        <input type="hidden" name="id" value={user._id}>
                                        <button class="button is-small is-danger">
                                            Delete
                                        </button>
                                    </form>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</section>