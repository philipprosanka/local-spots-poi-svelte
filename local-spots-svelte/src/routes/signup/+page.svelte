<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';
    import Navbar from "$lib/components/Navbar.svelte"; 

    
    let { form }: { form: ActionData } = $props();
</script>


<section class="section">
    <div class="container column is-4 is-offset-4">
        <div class="box">
            <h1 class="title has-text-centered">Sign Up</h1>
            
            <form method="POST" use:enhance>
                <div class="field">
                    <div class="columns">
                        <div class="column">
                            <label class="label" for="firstName">First Name</label>
                            <div class="control">
                                <input 
                                    id="firstName" 
                                    name="firstName" 
                                    class="input" 
                                    type="text" 
                                    required 
                                    placeholder="Homer"
                                    autocomplete="given-name"
                                    value={form?.firstName ?? ''} 
                                >
                                </div>
                        </div>
                        <div class="column">
                            <label class="label" for="lastName">Last Name</label>
                            <div class="control">
                                <input 
                                    id="lastName" 
                                    name="lastName" 
                                    class="input" 
                                    type="text" 
                                    required 
                                    placeholder="Simpson"
                                    autocomplete="family-name"
                                    value={form?.lastName ?? ''}
                                >
                                </div>
                        </div>
                    </div>
                </div>

                <div class="field">
                    <label class="label" for="email">Email</label>
                    <div class="control">
                        <input 
                            id="email" 
                            name="email" 
                            class="input" 
                            type="email" 
                            required 
                            placeholder="homer@simpson.com" 
                            autocomplete="email"
                            value={form?.email ?? ''}
                        >
                    </div>
                </div>

                <div class="field">
                    <label class="label" for="password">Password</label>
                    <div class="control">
                        <input 
                            id="password" 
                            name="password" 
                            class="input" 
                            type="password" 
                            autocomplete="new-password" 
                            required
                        >
                    </div>
                </div>

                {#if form?.error}
                    <div class="notification is-danger is-light">
                        {form.error}
                    </div>
                {/if}

                <div class="field mt-5">
                    <button class="button is-primary is-fullwidth">Sign up</button>
                </div>
            </form>
             <p class="is-size-7 has-text-centered mt-4">
                Already have an account? <a href="/login">Log in here</a>
            </p>
        </div>
    </div>
</section>