<template>

    <div class="wrap-widget">
        <div class="cc-loader" v-if="loading">
            <div class="spinner"></div>
        </div>

        <div v-else>
            <div v-if="!fetchError">
                <div class="timeline-legend columns">
                    <div class="other">
                        Standard User
                    </div>
                    <div class="Admin">
                        Administrator
                    </div>
                </div>

                <ul>

                    <div v-for="event in timeline">
                        <ul>
                            <li v-for="(event2,date) in event" :class="event2[1]" :key="event2">
                                <p class="timeline-date">
                                    <i class="ion-ios-clock-outline"></i> {{date}}
                                </p>
                                <div class="timeline-action">
                                    <strong>{{ event2[1] | capitalize }}</strong>
                                    {{event2[0]}}
                                </div>
                            </li>
                        </ul>
                    </div>
                </ul>

            </div>

            <div v-else class="alert alert-error">
                {{fetchError}}
            </div>
        </div>
    </div>
</template>

<script>
    import { getActivityCompany, getActivityAll, getActivityAdmins } from '../services/user.service'

	export default {
		name: 'widget-timeline',
        data() {
            return {
                loading:true,
                timeline: [],
                fetchError: null,
                interval: null,
                total:[]
            }
        },

        created() {
            this.fetchTimeline()
            // Launch interval for notifications
            this.interval = setInterval(function () {
                this.fetchTimeline();
            }.bind(this), 60000)
        },
    
        methods: {
            fetchTimeline() {
                this.fetchError = null

                if (this.$store.state.auth.user.role == 'Admin') {
                    getActivityAll().then(response => {
                        let liste = response.data
                        let i = 0;
                        for (i; i < liste.length; i++) {
                            let activities = Object.values(liste[i])
                            if (activities.length > 0) {
                                let act = activities[0]
                                this.timeline[i] = act
                            }
                        }
                        this.loading = false
                    }).catch(error => {
                        this.showError('Error : JSON file not found OR error during fetching datas')
                    })
                }

                else {

                    getActivityCompany(this.$store.state.auth.user.mycompany).then(response => {
                        let liste = response.data
                        let i = 0;
                        for (i; i < liste.length; i++) {
                            let activities = Object.values(liste[i])
                            if (activities.length > 0) {
                                let act = activities[0]
                                this.timeline[i] = act
                            }
                        }
                        let k = i;
                        getActivityAdmins().then(response2 => {
                            let liste2 = response2.data
                            let j = 0;
                            for (j; j < liste2.length; j++) {
                                let activities2 = Object.values(liste2[j])
                                if (activities2.length > 0) {
                                    let act2 = activities2[0]
                                    this.timeline[j+k] = act2
                                }
                            }
                           

                            this.loading = false
                        }).catch(error => {
                            this.showError('Error : JSON file not found OR error during fetching datas')
                        })
                    })
                }
            },

            // Show error message
            showError(msg) {
                this.fetchError = msg
                this.loading = false
                this.timeline = {}
            }
        }
	}

</script>
