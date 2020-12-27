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
                                Employee
                                <small>• #{{employee.id}} </small>
                            </h1>
                            <div class="cc-w-auto cc-right">
                                <router-link class="btn cc-bg-green fa-angle-left" :to="{name : 'employees',params:{name: this.company}}">Back to employees</router-link>
                            </div>
                            <div v-if="this.admin" class="cc-w-auto cc-right">
                                <router-link class="btn" :to="{name:'board-admin',params:{username: this.$store.state.auth.user.username}}">Return</router-link>
                            </div>
                            <div v-if="this.LR" class="cc-w-auto cc-right">
                                <router-link class="btn" :to="{name:'board-LR',params:{username: this.$store.state.auth.user.username}}">Return</router-link>
                            </div>
                            <div v-if="this.HR" class="cc-w-auto cc-right">
                                <router-link class="btn" :to="{name:'board-HR',params:{username: this.$store.state.auth.user.username}}">Return</router-link>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cc-inside">
                    <div class="boxed">
                        <pre>{{employee}}</pre>
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
    import { findById } from '../../../services/employee.service';

    export default {
        name: 'employee-profile',
        data () {
            return {
                loading:true,
                fetchError : '',
                employee: [],
                
                //=============
                //Current User role and company
                role: this.$store.state.auth.user.role,
                admin: null,
                LR: null,
                HR: null,
                company: this.$store.state.auth.user.mycompany,
            }
        },
        props : {
            id : null
        },
        // Meta tags in <head> section
        head: {
            title() {
                return {
                    inner: 'Employee profile',
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

        created() {
            //get user role
            if (this.role == "Admin") this.admin = 1;
            if (this.role == "Legal Representative") this.LR = 1;
            if (this.role == "Human Resources Manager") this.HR = 1;

            this.fetchData()
        },
        methods: {
            fetchData () {

                // It's loading dude :)
                this.loading = true

                // Set var before fetching datas
                this.fetchError = null
                findById(this.$route.params.id)
                    .then(response => {

                    if(response.data.error) {

                        this.showError('data.error : JSON file return an error value')

                    } else {

                        this.loading = false
                        this.employee = response.data

                    }

                }).catch(error => {

                    this.showError('Error : JSON file not found OR error during fetching datas')

                })
            },

            showError(msg) {

                this.fetchError = msg
                this.loading = false
                this.employee = []

            }
        }
    }
</script>
