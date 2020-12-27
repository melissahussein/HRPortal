<template>
    <div>
        <div class="top-page">
            <div class="cc-inside">
                <div class="columns">
                    <h1>
                        Documents
                        <small>• {{maxDatas|pluralize}} •</small>
                    </h1>
                    <div class="cc-w-auto cc-right">
                        <router-link class="btn cc-bg-green fa-plus" :to="{name:'file-add'}">Add a document</router-link>
                    </div>
                    <div class="cc-w-auto cc-right">
                        <router-link class="btn" :to="{name:'employees' , params:{name: loggedUser.mycompany}}">Return</router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="cc-inside">
            <ul>
                <li v-for="allfiles in datasShown" v-bind:key="allfiles">
                    <ul>
                        <li v-for="file in allfiles.files" v-bind:key="file">
                            {{ file }}
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
    
</template>

<script>
    import Pagination from '../../components/pagination.vue'
    import { findAllFiles, DeleteFile } from '../../services/employee.service'

    export default {
        // Name of the component
        name: 'file',

        // Datas : model
        data() {
            return {
                loggedUser: this.$store.state.auth.user,

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
                
                // ============
                // Datas
                // ============
                // Tab contains all datas - used for back-up (when searching datas)
                datas: [],
                
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
                    inner: 'Files panel',
                }
            },
            meta() {
                return [
                ]
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

                findAllFiles(this.$route.params.id)
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


            // Open Modal before deleting data
            openModal(id, index) {

                var toDelete = this.datasShown[index]

                // Fill the data to delete
                this.dataToDelete = {
                    'index': index,
                    '_id': toDelete.id,
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
                DeleteFile(idSearch)
                    .then(response => {
                        console.log(response.data);
                        this.$router.push({ name: "file" });
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        },
        
        // Components
        components: {
            Pagination
        }
    }
</script>
