<template>
    <div>
        <app-header :loggedUser="loggedUser" @logout="logout"> </app-header>

        <nav>
            <div class="cc-inside">
                <ul>
                    <li>
                        <h3>
                            <i class="ion-person-stalker"></i>
                            Persons
                        </h3>
                        <ul>
                            <li>
                                <router-link :to="{name:'admins'}">
                                    <i class="ion-arrow-right-b"></i>
                                    <span>Administrators</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link :to="{name:'users'}">
                                    <i class="ion-arrow-right-b"></i>
                                    <span>Users</span>
                                </router-link>

                                <ul>
                                    <li>
                                        <router-link :to="{name:'users'}">
                                            <i class="ion-arrow-right-b"></i>
                                            <span>Users list</span>
                                        </router-link>
                                    </li>
                                    <li>
                                        <router-link :to="{name:'user-add'}">
                                            <i class="ion-arrow-right-b"></i>
                                            <span>Add a user</span>
                                        </router-link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    <li>
                        <h3>
                            <i class="ion-android-folder"></i>
                            Companies
                        </h3>

                        <ul>
                            <li>
                                <router-link :to="{name:'companies'}">
                                    <i></i>
                                    <span>Companies list</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link :to="{name:'companies-payroll'}">
                                    <i></i>
                                    <span>Companies payroll</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link :to="{name:'company-add'}">
                                    <i class="ion-arrow-right-b"></i>
                                    <span>Add a company</span>
                                </router-link>
                            </li>
                        </ul>
                    </li>

                </ul>
            </div>
        </nav>

        <dashboard></dashboard>
    </div>
</template>

<script>
    import appHeader from '../../components/header.vue'
    import dashboard from '../dashboard/dashboard.vue'

    export default {
        data() {
            return {
                loggedUser: this.$store.state.auth.user,
            }
        },
        methods: {
            logout() {
                this.$store.dispatch('auth/logout');
                this.$router.push('/login');
            }
        },

        components: {
            appHeader,
            dashboard
        }
    }
</script>
