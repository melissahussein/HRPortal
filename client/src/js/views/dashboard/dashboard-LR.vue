<template>
    <div class="dashboard">
        <div class="cc-loader" v-if="loading">
            <div class="spinner"></div>
        </div>
        <div v-else>
            <div class="cc-inside">
                <div class="columns">
                    <div>
                        <div class="push-item" v-tooltip="{title: 'Here my awesome title'}">
                            <span class="push-icon cc-bg-primary">
                                <i class="ion-android-contacts"></i>
                            </span>
                            <div class="push-infos">
                                <p class="push-title">
                                    Employees - {{loggedUser.mycompany}}
                                </p>
                                <p class="push-number cc-primary">
                                    {{pushes.employees | formatNumber(0, ' ') }}

                                </p>

                            </div>
                        </div>
                        <br />
                        <div class="cc-8-m">
                            <div class="boxed widget">
                                <div class="widget-title">
                                    <h2 class="cc-primary">Last registered employees</h2>
                                    <router-link :to="{name:'employees',params:{name: loggedUser.mycompany}}" class="btn cc-bg-primary">
                                        <i class="ion-arrow-right-b"></i>
                                        <span>Employees list</span>
                                    </router-link>
                                </div>

                                <widget-last-employees></widget-last-employees>
                            </div>
                        </div>
                        <br />

                        <div class="cc-8-m">
                            <div class="boxed widget">
                                <div class="widget-title">
                                    <h2 class="cc-blue">Actions</h2>
                                </div>

                                <div class="cc-w-auto cc-right">
                                    <a href="javascript:void(0)" @click="modalAdd = true" class="btn cc-bg-green fa-plus">Add absence</a>
                                </div>

                                <div :class="[{'active' : modalAdd}, 'modal']" data-fixed-hf data-disabled-overlay>
                                    <button class="modal-close" @click="modalAdd = false"></button>
                                    <div class="modal-overlay"></div>
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            Add absence
                                        </div>
                                        <div class="wrap-modal-body">
                                            <div class="modal-body">
                                                <absenceadd @addSuccess="addSuccess"></absenceadd>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
    import widgetTimeline from '../../components/widget-timeline.vue'
    import widgetLastEmployees from '../../components/widget-lastemployees.vue'
    import absenceadd from '../../../js/views/persons/employees/absence-add.vue'
    import { findByCompany } from '../../services/employee.service'

    export default {
        name: 'dashboard-LR',
        data () {
            return {
                loggedUser: this.$store.state.auth.user,
                msg: 'Dashboard',
                loading:true,
                nbEventToShow: 7,
                pushes: {
                    employees : 0,
                },
                modalAdd: false,
                modalAddSuccess: false,

            }
        },
        
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
            findByCompany(this.loggedUser.mycompany).then(response => {
                this.pushes.employees = response.data.length

            })
        },
        
        components: {
            widgetTimeline,
            widgetLastEmployees,
            absenceadd,
        },

        methods: {
            addSuccess() {
                this.modalAdd = false
                this.modalAddSuccess = true
            },
        }
    }
</script>
