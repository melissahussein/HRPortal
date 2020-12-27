<template>
    <div class="datatable-pages">

        <!-- If loading -->
        <div class="cc-loader" v-if="loading">
            <div class="spinner"></div>
        </div>

        <!-- else -->
        <div v-else>

            <!-- If no errors after fetching datas -->
            <div v-if="!fetchError">

                <div class="top-page">
                    <div class="cc-inside">
                        <div class="columns">
                            <h1>
                                Employee Plannings
                                {{employee.lastname}} {{employee.firstname}}
                                <small>• {{maxDatas|pluralize}} •</small>
                            </h1>
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

                    <!-- Pagination, pages -->
                    <div class="filters boxed">

                            <div class="form-item  cc-txt-center cc-w-auto cc-right">
                                <div class="form-ps">
                                    <span>Nb per page</span>
                                    <select v-model="nbPerPageSelect">
                                        <option value="1">1 ligne</option>
                                        <option value="5">5 lignes</option>
                                        <option value="10">10 lignes</option>
                                        <option value="20">20 lignes</option>
                                        <option value="50">50 lignes</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-item cc-txt-center cc-w-auto" v-if="maxDatas > nbPerPage">
                                <div class="form-ps">
                                    <span>Go to page</span>
                                    <input type="number" class="small" v-model.number="currentPage" min="1" />
                                </div>
                            </div>
                    </div>

                    <pagination class="cc-w-auto" :records="maxDatas" :currentpage="currentPage" :number-per-page="nbPerPage" @changepage="changePage"></pagination>


                    <!-- Results table datas -->
                    <div class="boxed cc-ma-0">
                        <table class="cc-equal-cols cc-hovered">
                            <thead>
                                <tr>
                                    <th>
                                        Date
                                    </th>
                                    <th>
                                        Regular hours worked
                                    </th>
                                    <th>
                                        Extra hours worked
                                    </th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <th>
                                        Date
                                    </th>
                                    <th>
                                        Regular hours
                                    </th>
                                    <th>
                                        Extra hours
                                    </th>
                                </tr>
                            </tfoot>
                            <tbody>
                                <tr  v-for="(data, index) in datasShown">
                                    <td>
                                          {{Object.keys(data)[0]}}
                                    </td>
                                    <td>
                                         {{Object.values(data)[0][0]['regular hours']}}
                                    </td>
                                    <td>
                                        {{Object.values(data)[0][1]['extra hours']}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div><!-- /end cc-inside -->

            </div><!-- /end v-if="!fetchError" -->
            <!-- else, show errors logs -->
            <div v-else>
                <div class="top-page">
                    <div class="cc-inside">
                        <div class="columns">
                            <h1>
                                Employee Planning
                            </h1>
                        </div>
                    </div>
                </div>
                <div class="cc-inside">
                    <div class="alert alert-error">
                        {{fetchError}}
                    </div>
                </div>
            </div>
        </div> <!-- /end - v-else not loading -->

    </div>
</template>

<script>
    import Pagination from '../../../components/pagination.vue'
    import { findPlanning, findById } from '../../../services/employee.service'


    export default {
        // Name of the component
        name: 'monthly-planning-all',
        // Datas : model
        data() {
            return {
                // ============
                // General datas
                // ============
                // Is the page loading ?
                loading: true,

                // If fetchData() returns an error, will be filled with error detail
                fetchError: '',
                

                // ============
                // Datas
                // ============
                // Tab contains all datas - used for back-up (when searching datas)
                datas: [],
                

                // Tab contains shown datas
                datasShown: [],

                // ============
                // Pagination datas
                // ============
                // Current active page (1 by default)
                currentPage: 1,

                // Nb of datas per page
                nbPerPage: 10,

                // Select list default value
                nbPerPageSelect: 10,

                //Current employee
                employee: null,

                //=============
                //Current User role
                role: this.$store.state.auth.user.role,
                admin: null,
                LR: null,
                HR: null
            }
        },

        // Meta tags in <head> section
        head: {
            title() {
                return {
                    inner: 'Employee Planning panel'
                }
            },
            meta() {
                return [
                ]
            }
        },
        

        // Computed datas
        computed: {

            maxDatas() {
                //get user role
                if (this.role == "Admin") this.admin = 1;
                if (this.role == "Legal Representative") this.LR = 1;
                if (this.role == "Human Resources Manager") this.HR = 1;

                findById(this.$route.params.id)
                    .then(response => {
                        if (response.data.error) {
                            this.showError('data.error')
                        } else {
                            this.employee = response.data
                        }
                    }).catch(error => {
                        this.showError('Error during fetching datas')
                    })

                // get the total nb of datas
                return this.datasShown.length;
            },

        },
        // Watchers
        watch: {
            // When route change but same component is called, launch "fetchData" method
            // for exemple : from "user/25" -> to -> "user/52"
            '$route': 'fetchData',

            // When select pagination changes
            nbPerPageSelect() {


                // Nb of data per page is set to the select value
                this.nbPerPage = _.toInteger(this.nbPerPageSelect)

                // Set the first pagination active
                this.currentPage = 1

                // Refresh page
                this.refreshPage()
            },
            
            // When the table pagination section shows 0 data (by deleting the last data on the table for example)
            datasShown() {

                if (this.datasShown.length < 1 && this.datas.length > 0) {
                    this.currentPage = 1
                    this.refreshPage()
                }
            },

            // Input "Go to page" binding value
            currentPage() {

                this.changePage(this.currentPage)
            }
        },

        // When view is created
        created() {

            findById(this.$route.params.id)
                .then(response => {
                    if (response.data.error) {
                        this.showError('data.error')
                    } else {
                        this.employee = response.data
                    }
                }).catch(error => {
                    this.showError('Error during fetching datas')
                })

            this.fetchData(this.$route.params.id)
        },


        // Methods
        methods: {

            // get datas
            fetchData(id) {

                // Reset error msg
                this.fetchError = ''
                // It's loading dude :)
                this.loading = true

                findPlanning(id)
                    .then(response => {

                        if (response.data.error) {

                            this.showError('data.error')

                        } else {

                            // Loading is finished :)
                            this.loading = false

                            // Contains all datas
                            this.datas = response.data
                            this.datasShown = this.datas
                        }

                    }).catch(error => {
                        // Set the error msg
                        this.showError('Error during fetching datas')

                    })
            },



            // Show Error message if fetching data return an error
            showError(msg) {
                this.fetchError = msg
                this.loading = false
                this.datas = []
            },

            // Bind when the page changes
            changePage(index) {
                // Active class to the current number
                this.currentPage = index

                // Refresh page
                this.refreshPage()
            },

            // Refresh page
            refreshPage() {

                // Set start to the first 'data' of the current line
                let start = this.getStartPagination()

                // Set datasShown from `start` to `this.nbPerPage`
                this.datasShown = this.datasShown.slice(start, start + this.nbPerPage)
            },

            // Return the start of the current pagination
            getStartPagination() {
                return (this.currentPage - 1) * this.nbPerPage
            },

        },
       

        // Components
        components: {
            Pagination
        },
    }
</script>
