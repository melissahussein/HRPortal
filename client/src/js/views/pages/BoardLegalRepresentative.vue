
<template>
    <div>
        <app-header :loggedUser="loggedUser" @logout="logout"> </app-header>

        <nav>
            <div class="cc-inside">
                <ul>
                    <li>
                        <h3>
                            <i class="ion-person-stalker"></i>
                            Employees
                        </h3>
                        <ul>
                            <li>
                                <router-link :to="{name:'employees', params:{name: loggedUser.mycompany}}">
                                    <i class="ion-arrow-right-b"></i>
                                    <span>Employees list</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link :to="{name:'employee-add'}">
                                    <i class="ion-arrow-right-b"></i>
                                    <span>Add an employee</span>
                                </router-link>
                            </li>

                        </ul>
                    </li>

                    <li>
                        <h3>
                            <i class="ion-folder"></i>
                            Monthly planning
                        </h3>
                        <ul>
                            <li>
                                <router-link :to="{name:'monthly-planning',params:{name: loggedUser.mycompany}}">
                                    <i class="ion-arrow-right-b"></i>
                                    <span>Add by employee</span>
                                </router-link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>

        <dashboardLR></dashboardLR>
    </div>
</template>
<script>
    import appHeader from '../../components/header.vue'
    import dashboardLR from '../dashboard/dashboard-LR.vue'

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
            dashboardLR
        }
    }
</script>
