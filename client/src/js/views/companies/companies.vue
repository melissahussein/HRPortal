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
                                Companies
                                <small>• {{maxDatas|pluralize}} •</small>
                            </h1>
                            <div class="cc-w-auto cc-right">
                                <router-link class="btn cc-bg-purple fa-plus" :to="{name:'company-add'}">Add a company</router-link>
                            </div>
                            <div class="cc-w-auto cc-right">
                                <router-link class="btn" :to="{name:'board-admin',params:{username: this.$store.state.auth.user.username}}">Return</router-link>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cc-inside">

                    <!-- Pagination, pages -->
                    <div class="filters boxed">
                        <form class="columns">
                            <div class="form-item cc-txt-center cc-w-auto">
                                <div class="form-ps">
                                    <span>Search</span>
                                    <input type="text" v-model="searchQuery" placeholder="Search by names,ID.." />
                                </div>
                            </div>

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
                        </form>
                    </div>

                    <pagination class="cc-w-auto" :records="maxDatas" :currentpage="currentPage" :number-per-page="nbPerPage" @changepage="changePage"></pagination>


                    <!-- Results table datas -->
                    <div class="boxed cc-ma-0" v-show="datasShown.length >= 1">
                        <table class="cc-equal-cols cc-hovered">
                            <thead>
                                <tr>
                                    <th @click="sortBy('datas.name')" :class="[{ active: sortKey == 'datas.name' },sortType[0], 'sort']">
                                        Name
                                    </th>
                                    <th @click="sortBy('datas.LR')" :class="[{ active: sortKey == 'datas.LR' },sortType[0], 'sort']">
                                        LR
                                    </th>
                                    <th @click="sortBy('datas.HR')" :class="[{ active: sortKey == 'datas.HR' },sortType[0], 'sort']">
                                        HR
                                    </th>
                                    <th @click="sortBy('registered')" :class="[{ active: sortKey == 'registered' },sortType[0], 'sort']">
                                        Resgistered
                                    </th>
                                    <th>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <th>
                                        Company name
                                    </th>
                                    <th>
                                        LR
                                    </th>
                                    <th>
                                        HR
                                    </th>
                                    <th>
                                        Date inscription
                                    </th>
                                    <th>
                                        Action
                                    </th>
                                </tr>
                            </tfoot>
                            <tbody>
                                <tr v-for="(data, index) in datasShown">
                                   
                                    <td>
                                        {{ data.name }}
                                    </td>
                                    <td>
                                        {{ data.LR }}
                                    </td>
                                    <td>
                                        {{ data.HR }}
                                    </td>
                                    <td class="data-date">
                                        {{ data.registered | formatDate('fr','[Le] DD.MM.YYYY') }}
                                    </td>

                                    <td>
                                        <a @click.prevent="openModal(data._id,index)" class="btn cc-thin cc-bg-red fa-times">Del.</a>
                                        <router-link class="btn cc-thin cc-bg-primary fa-edit" :to="{name:'employees', params:{name: data.name}}">Empl.</router-link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                    <div class="alert alert-error" v-show="datasShown.length < 1">
                        No data found, please change your filters
                    </div>


                    <!-- MODAL SHOWN BEFORE DELETING ROW -->
                    <div :class="[{'active' : modalDelete}, 'modal']">
                        <!-- Close button -->
                        <button class="modal-close" @click="modalDelete = false"></button>
                        <!-- Overlay -->
                        <div class="modal-overlay" @click="modalDelete = false"></div>
                        <!-- Modal content -->
                        <div class="modal-content">
                            <div class="modal-header">
                                Confirm action
                            </div>
                            <div class="modal-body">
                                <div class="alert alert-info">
                                    Do you really want to delete the company <strong v-if="dataToDelete.name">{{ dataToDelete.name }} </strong> ?
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button class="cc-bg-red fa-check" @click.prevent="deleteData">CONFIRM DELETE</button>
                            </div>
                        </div>
                    </div>

                </div><!-- /end cc-inside -->

            </div><!-- /end v-if="!fetchError" -->
            <!-- else, show errors logs -->
            <div v-else>
                <div class="top-page">
                    <div class="cc-inside">
                        <div class="columns">
                            <h1>
                                Companies
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
    import Pagination from '../../components/pagination.vue'
    import { findAllCompanies, DeleteCompany } from '../../services/company.service'


    export default {
        // Name of the component
        name: 'companies',

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

                // Modal delete data (row) : Set to true for modal appearance
                modalDelete: false,


                // ============
                // Sort datas
                // ============
                // Asc / Desc sort datas
                sortType: ['desc', 'asc'],

                // Default sort table (ie. "sort by registration date")
                sortKey: 'registered',

                // Search input
                searchQuery: '',


                // ============
                // Datas
                // ============
                // Tab contains all datas - used for back-up (when searching datas)
                datas: [],

                // Tab contains datas when searching in input
                datasFiltered: [],

                // Tab contains shown datas
                datasShown: [],

                // Array with infos about data to delete
                dataToDelete: {},


                // ============
                // Pagination datas
                // ============
                // Current active page (1 by default)
                currentPage: 1,

                // Nb of datas per page
                nbPerPage: 10,

                // Select list default value
                nbPerPageSelect: 10
            }
        },

        // Meta tags in <head> section
        head: {
            title() {
                return {
                    inner: 'Companies panel',
                }
            },
            meta() {
                return [
                ]
            }
        },

        // Computed datas : Here the total nb of datas
        computed: {
            maxDatas() {
                return this.datasFiltered.length
            }
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

            // When search input change, launch request
            searchQuery() {

                // Launch search
                this.searchInTable()
            },

            // When the table pagination section shows 0 data (by deleting the last data on the table for example)
            datasShown() {

                if (this.datasShown.length < 1 && this.datasFiltered.length > 0 && this.datas.length > 0) {
                    this.currentPage = 1
                    this.refreshPage()
                }
            },

            // Input "Go to page" binding value
            currentPage() {

                this.changePage(this.currentPage)
            }
        },

        // When view is created, launch ajax fetchData
        created() {
            this.fetchData()
        },

        // Methods
        methods: {

            // get datas
            fetchData() {

                // Reset error msg
                this.fetchError = ''

                // It's loading dude :)
                this.loading = true

                findAllCompanies()
                    .then(response => {

                        if (response.data.error) {

                            this.showError('data.error')

                        } else {

                            // Loading is finished :)
                            this.loading = false

                            // Contains all datas
                            this.datas = response.data
                            this.datasFiltered = response.data

                            // Slice datas to show the `this.nbPerPage` first datas
                            this.datasShown = this.datasFiltered.slice(0, this.nbPerPage)

                            // Sort table by default sortKey
                            this.sortBy(this.sortKey)
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
                this.datasFiltered = []
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
                this.datasShown = this.datasFiltered.slice(start, start + this.nbPerPage)
            },

            // Return the start of the current pagination
            getStartPagination() {

                return (this.currentPage - 1) * this.nbPerPage
            },

            // Ordering datas into table
            sortBy(key) {

                // Order datas tabs with lodash _.orderBy method
                this.datasFiltered = _.orderBy(this.datasFiltered, key, [this.sortType[0]])

                // Reverse sortType for next click (reverse order)
                this.sortType = _.reverse(this.sortType)

                // Set `this.sortKey`to the 'key value for active class on <th> elements
                this.sortKey = key

                // Refresh, always refresh :)
                this.refreshPage()
            },

            // Search in table
            searchInTable() {

                // Refer to the instance
                let that = this

                // Make an array with matching search
                let filtered_datas = _.filter(that.datas, function (p) {
                    return _.includes(p.name.toLowerCase(), that.searchQuery.toLowerCase()) || _.includes(p._id, that.searchQuery.toLowerCase())
                })

                // set datasFiltered with filtered results
                that.datasFiltered = filtered_datas

                // Set the first pagination active
                this.currentPage = 1

                // Refresh :)
                that.refreshPage()
            },

            // Open Modal before deleting data
            openModal(id_data, index) {

                var toDelete = this.datasShown[index]

                // Fill the data to delete
                this.dataToDelete = {
                    'index': index,
                    '_id': id_data,
                    'name': toDelete.name
                }

                this.modalDelete = true
            },

            // Delete a data
            deleteData() {

                var
                    idSearch = this.dataToDelete._id,
                    indexSearch = this.dataToDelete.index

                // I. this.datas
                var toDelete = _.findIndex(this.datas, function (o) {
                    return o._id == idSearch
                })
                this.datas.splice(toDelete, 1)


                // II. this.datasShown
                this.datasShown.splice(indexSearch, 1)


                // III. this.datasFiltered
                var dataFiltered = _.findIndex(this.datasFiltered, function (o) {
                    return o._id == idSearch
                })
                this.datasFiltered.splice(dataFiltered, 1);

                // Hide modal
                this.modalDelete = false

                // Reset dataToDelete array
                this.dataToDelete = {}

                // Delete from database
                DeleteCompany(idSearch)
                    .then(response => {
                        console.log(response.data);
                        this.$router.push({ name: "companies" });
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
        },

        // Filters
        filters: {

            // Pluralize nb of results found (for <h2> in top of page)
            pluralize(value) {
                return (value > 1) ? value + ' users found' : value + ' user found'
            }
        },

        // Components
        components: {
            Pagination
        }
    }
</script>
