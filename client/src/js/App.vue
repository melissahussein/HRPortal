<template>
    <div id="vue-chuckadmin" v-cloak>
        <div class="cc-loader" v-if="loading">
            <div class="spinner"></div>
        </div>
        <main>
            <!-- General transition effect when changing page -->
            <transition :duration="{ enter: 600, leave: 30 }" name="fade" mode="out-in" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">

                <!-- Page container -->
                <router-view></router-view>

            </transition>
        </main>

    </div>
</template>

<script>
    import loginForm from './components/login-form.vue'

    export default {
        components: {
            loginForm
        }
    }
</script>
