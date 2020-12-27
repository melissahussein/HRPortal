<template>
    <div class="user-profil">
        <div class="cc-loader" v-if="loading">
            <div class="spinner"></div>
        </div>

        <div v-else>

            <div v-if="!fetchError">

                <div class="top-page">
                    <div class="cc-inside">
                        <div class="columns">
                            <h1>
                                User
                                <small>• #{{user._id}} </small>
                            </h1>
                            <div class="cc-w-auto cc-right">
                                <router-link class="btn cc-bg-blue fa-angle-left" :to="{name : 'users'}">Back to users</router-link>
                            </div>
                            <div class="cc-w-auto cc-right">
                                <router-link class="btn" :to="{name:'board-admin',params:{username: this.$store.state.auth.user.username}}">Retur</router-link>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cc-inside">
                    <div class="boxed">
                        <pre>{{user}}</pre>
                    </div>
                </div><!-- /end cc-inside -->

            </div><!-- /end v-if="!fetchError" -->

            <div v-else class="alert alert-error">
                {{fetchError}}
            </div>
        </div>

    </div>
</template>

<script>
    //import Vue from 'vue'
    import { findUser } from '../../../services/user.service';

    export default {
        name: 'user-profile',
        data () {
            return {
                loading:true,
                fetchError : '',
                user: []
            }
        },
        props : {
            id : null
        },
        // Meta tags in <head> section
        head: {
            title() {
                return {
                    inner: 'User profil',
                    separator: '-',
                }
            },
            meta() {
                return [
                ]
            }
        },
        watch: {
            // When route change but same component is called, launch "fetchData" method
            // for exemple : from "user/25" -> to -> "user/52"
            '$route' : 'fetchData'
        },
        created () {
            this.fetchData()
        },
        methods: {
            fetchData () {

                // It's loading dude :)
                this.loading = true

                // Set var before fetching datas
                this.fetchError = null
                findUser(this.$route.params.id)
                    .then(response => {

                    if(response.data.error) {

                        this.showError('data.error : JSON file return an error value')

                    } else {

                        this.loading = false
                        this.user = response.data

                    }

                }).catch(error => {

                    this.showError('Error : JSON file not found OR error during fetching datas')

                })
            },

            showError(msg) {

                this.fetchError = msg
                this.loading = false
                this.user = []

            }
        }
    }
</script>
