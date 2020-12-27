<template>
    <div class="wrap-widget">
        <div class="cc-loader" v-if="loading">
            <div class="spinner"></div>
        </div>
        <div v-else>
            <div v-if="!fetchError" class="widget-lastemployees">
                <div class="columns">
                    <div v-for="emp in employees" :key="emp" class="user-item">
                        <router-link :to="{name:'employee-profile', params:{id: emp.id}}">
                            <p class="user-name">
                                {{emp.firstname|capitalize}} {{emp.lastname|upper}}
                            </p>
                            <p>
                                {{emp.username}}
                            </p>
                            <p>
                                Position: {{emp.position}}
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
import { findByCompany } from '../services/employee.service';

	export default {
        // Name of the component
        name: 'widget-lastemployees',

        // Datas : model
        data () {
            return {
                loading:true,
                fetchError : '',
                employees: []
            }
        },

        created () {
            this.fetchData()
        },

        methods: {

            fetchData () {

                this.fetchError = ''
                this.loading = true


                findByCompany(this.$store.state.auth.user.mycompany).then(response => {

                    if(response.data.error) {
                        this.showError('data.error : API return an error value')
                    } else {
                        this.loading = false
                        this.employees = _.reverse(response.data)
                    }

                }).catch(error => {
                    this.showError('Error : JSON file not found OR error during fetching datas')

                })
            },

            showError(msg) {
                this.fetchError = msg
                this.loading = false
                this.employees = []
            }
        }
    }</script>
