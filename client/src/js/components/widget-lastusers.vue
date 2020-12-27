<template>

    <div class="wrap-widget">
        <div class="cc-loader" v-if="loading">
            <div class="spinner"></div>
        </div>

        <div v-else>
            <div v-if="!fetchError" class="widget-lastusers">

                <div class="columns">
                    <div v-for="user in users" :key="user" class="user-item">
                        <router-link :to="{name:'user-profile', params:{id: user._id}}">
                            <p class="user-name">
                                {{user.firstname|capitalize}} {{user.lastname|upper}}
                            </p>
                            <p>
                                {{user.username}}
                            </p>
                        </router-link>
                    </div>
                </div>

            </div>

            <div v-else class="alert alert-error">
                {{fetchError}}
            </div>
        </div>
    </div>
</template>

<script>
    import { findAllUsers } from '../services/user.service'

	export default {
        // Name of the component
        name: 'widget-lastusers',

        // Datas : model
        data () {
            return {
                loading:true,
                fetchError : '',
                users: []
            }
        },
        
        created () {
            this.fetchData()
        },
        
        methods: {
            
            fetchData () {
                
                this.fetchError = ''
                this.loading = true


                findAllUsers().then(response => {

                    if(response.data.error) {
                        this.showError('data.error : API return an error value')
                    } else {
                        this.loading = false
                        this.users = _.reverse(response.data)
                    }

                }).catch(error => {
                    this.showError('Error : JSON file not found OR error during fetching datas')

                })
            },
            
            showError(msg) {
                this.fetchError = msg
                this.loading = false
                this.users = []
            }
        }
    }

</script>
