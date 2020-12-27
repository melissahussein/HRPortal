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
                                    <i></i>
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
                    <li>
                        <h3>
                            <i class="ion-android-folder"></i>
                            Registers
                        </h3>

                        <ul>
                            <li>
                                <router-link :to="{name:'view-register', params:{name: loggedUser.mycompany} }">
                                    <i class="ion-arrow-right"></i>
                                    <span>View registers</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link :to="{name:'employee-register'}">
                                    <i class="ion-arrow-right-b"></i>
                                    <span>Add register</span>
                                </router-link>
                            </li>
                     </ul>
                 </li>
               </ul>
            </div>
        </nav>

        <dashboardHR></dashboardHR>
    </div>
</template>
<script>
    import appHeader from '../../components/header.vue'
    import dashboardHR from '../dashboard/dashboard-HR.vue'

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
            dashboardHR
        }
    }
</script>
