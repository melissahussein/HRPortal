<template>
  <div class="dashboard">

    <div class="cc-loader" v-if="loading">
        <div class="spinner"></div>
    </div>

    <div v-else>

        <div class="cc-inside">
            <div class="columns">
                <div>
                    <div class="push-item">
                        <span class="push-icon cc-bg-primary">
                            <i class="ion-android-contacts"></i>
                        </span>
                        <div class="push-infos">
                            <p class="push-title">
                                Users
                            </p>
                            <p class="push-number cc-primary">
                                {{pushes.users | formatNumber(0, ' ') }}
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="push-item">
                        <span class="push-icon cc-bg-green">
                            <i class="ion-android-contacts"></i>
                        </span>
                        <div class="push-infos">
                            <p class="push-title">
                                Employees
                            </p>
                            <p class="push-number cc-green">
                                {{pushes.employees | formatNumber(0, ' ') }}
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="push-item">
                        <span class="push-icon cc-bg-purple">
                            <i class="ion-android-globe"></i>
                        </span>
                        <div class="push-infos">
                            <p class="push-title">
                                Companies
                            </p>
                            <p class="push-number cc-purple">
                                {{ pushes.companies | formatNumber(0, ' ') }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="cc-8-m">
                    <div class="boxed widget">
                        <div class="widget-title">
                            <h2 class="cc-primary">Last registered users</h2>
                            <router-link :to="{name:'users'}" class="btn cc-bg-primary">
                                <i class="ion-arrow-right-b"></i>
                                <span>Users list</span>
                            </router-link>
                        </div>

                        <widget-last-users></widget-last-users>
                    </div>
                </div>
                <div class="cc-4-m widget-timeline">
                    <div class="widget boxed">
                        <div class="widget-title">
                            <h2 class="cc-green">
                                Timeline
                                <small>
                                    • {{nbEventToShow}} last events •
                                </small>
                            </h2>
                        </div>

                        <widget-timeline :nbItemToShow="nbEventToShow"></widget-timeline>
                    </div>
                </div>

            </div>
        </div>
    </div>
  </div>
</template>

<script>
    // Import Widgets
    import widgetTimeline from '../../components/widget-timeline.vue'
    import widgetLastUsers from '../../components/widget-lastusers.vue'
    import paycheckadd from '../../../js/views/persons/employees/paycheck-add.vue'
    import { getAll } from '../../services/employee.service'
    import { findAllCompanies } from '../../services/company.service'
    import { findAllUsers } from '../../services/user.service'

    export default {
        name: 'dashboard',
        data () {
            return {
                msg: 'Dashboard',
                loading:true,
                nbEventToShow: 7,
                pushes:{
                    employees: 0,
                    users: 0,
                    companies: 0,
                },
                modalAdd: false,
                modalAddSuccess: false,
            }
        },

        // Meta tags in <head> section
        head: {
            title() {
                return {
                    inner: this.msg
                }
            },
            meta() {
                return [
                ]
            },
            link() {
                return [
                ]
            }
        },
        
        created () {
            this.loading = false
            getAll().then(response => {
                this.pushes.employees = response.data.length
            })
            findAllCompanies().then(response => {
                this.pushes.companies = response.data.length
            })
            findAllUsers().then(response => {
                this.pushes.users = response.data.length
            })
        },
        
        components: {
            widgetTimeline,
            widgetLastUsers,
            paycheckadd
        },

        methods: {
            addSuccess() {
                this.modalAdd = false
                this.modalAddSuccess = true
            },
        }
    }
</script>
