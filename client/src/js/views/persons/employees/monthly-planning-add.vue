<template>
    <div class="form">

        <form @submit.prevent="submitForm">

            <div class="form-item cc-txt-center">
                <label class="block">Planning for month {{new Date().getMonth()}} of Year {{new Date().getFullYear()}} </label>
                <label class="block">Employee : {{employee.lastname}} {{employee.firstname}} </label>
            </div>

            <div class="form-item cc-txt-center" :class="{ 'error': $v.planning.regularhours.$error }">
                <label class="block">Regular hours worked</label>
                <input type="text" name="regularhours" v-model.trim="planning.regularhours" @input="$v.planning.regularhours.$touch()" />
                <span class="warning" v-if="!$v.planning.regularhours.numeric">
                    Regular hours must be numeric.
                </span>
                <span class="warning" v-if="!$v.planning.regularhours.required">
                    Field is required
                </span>
            </div>

            <div class="form-item cc-txt-center" :class="{ 'error': $v.planning.extrahours.$error }">
                <label class="block">Extra hours worked</label>
                <input type="text" name="extrahours" v-model.trim="planning.extrahours" @input="$v.planning.extrahours.$touch()" />
                <span class="warning" v-if="!$v.planning.extrahours.numeric">
                    Extra hours must be numeric.
                </span>
                <span class="warning" v-if="!$v.planning.extrahours.required">
                    Field is required
                </span>
            </div>

            <div class="cc-txt-center">
                <button type="submit" class="fa-save" ref="submitButton">Send to HR</button>
            </div>
            </br>
            <div class="cc-txt-center">
                <router-link class="btn cc-bg-green fa-angle-left" :to="{name : 'board-LR'}">Return</router-link>
            </div>
            <br />
            <br />
            <div class="cc-txt-center">
                Total absences for this month: 
                {{data}} days
            </div>


            <!-- MODAL SHOWN WHEN COMPANY IS CREATED -->
            <div :class="[{'active' : modalSuccess}, 'modal']">
                <!-- Close button -->
                <button class="modal-close" @click="modalSuccess = false"></button>
                <!-- Overlay -->
                <div class="modal-overlay" @click="modalSuccess = false"></div>
                <!-- Modal content -->
                <div class="modal-content">
                    <div class="modal-header">
                        Registration success
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info fa-thumbs-up">
                            Planning registered with success
                        </div>
                    </div>
                </div>
            </div>

        </form>

    </div>
</template>

<script>

    import { alpha, alphaNum, and, between, email, maxLength, minLength, numeric, or, required, sameAs } from 'vuelidate/lib/validators'
    import { findById, update, findAbsence } from '../../../services/employee.service'
    import { updateUser } from '../../../services/user.service'

    export default {
        name: 'monthly-planning-add',
        data() {
            return {
                modalSuccess: false,

                // Inputs definitions
                planning: {
                    regularhours: null,
                    extrahours: null,
                },
                employee: null,
                absences: null,
                data:null

            }
        },
        validations: {
            planning: {
                regularhours: {
                    required,
                    numeric
                },
                extrahours: {
                    required,
                    numeric
                },
            }
        },

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

            findAbsence(this.$route.params.id)
                .then(result => {
                    if (result.data.error) {
                        this.showError('data.error')
                    } else {
                        this.absences = result.data
                        let currentdate = new Date().getMonth() + " " + new Date().getFullYear()
                        let values = Object.values(this.absences)
                        let month=0
                        for (month; month < values.length; month++) {
                            let date = Object.keys(values[month])
                            if (date == currentdate) {
                                let list = Object.values(values[month])
                                this.data=list[0]
                            }
                        }
                    }
                }).catch(error => {
                    this.showError('Error during fetching datas')
                })
        },

        methods: {

            // Submit form method
            submitForm() {

                // touch form validators
                this.$v.planning.$touch()

                // If no errors
                if (!this.$v.planning.$error) {
                    
                    // show loading button
                    this.$refs.submitButton.classList.add('cc-loading')

                    let currentdate = new Date().getMonth() + " " + new Date().getFullYear();

                    let total = {
                        regularhours: this.planning.regularhours,
                        extrahours: this.planning.extrahours,
                    };

                    let plannings = this.employee.plannings;
                    if (plannings == undefined) {
                        plannings = {}
                    }
                    let dict1 = {};
                    let dict2 = {};
                    dict1['regular hours'] = total.regularhours;
                    dict2['extra hours'] = total.extrahours;

                    plannings[currentdate] = [dict1,dict2];
                    let data= {
                        plannings: plannings,
                    }

                    update(this.$route.params.id,data )
                        .then(response => {
                            if (response.data.error) {
                                alert('data.error')
                            }
                        }).catch(error => { alert('Error during fetching datas') })



                    //save activity for timeline
                    let date = new Date().getFullYear() + "-" + new Date().getMonth() + '-' + new Date().getDate()
                    let time = new Date().getHours() + 'h' + new Date().getMinutes() + 'min'
                    let fulldate = date + " " + time
                    let activity = this.$store.state.auth.user.activity
                    if (activity == undefined) {
                        activity = {}
                    }

                    activity[fulldate] = ["Monthly planning for employee" + this.employee.lastname + " " + this.employee.firstname +
                        +" has been added", this.$store.state.auth.user.role]

                    let data2 = {
                        activity: activity
                    }

                    updateUser(this.$store.state.auth.user.id, data2).then(response2 => {
                        console.log(response2)
                    })

                    setTimeout(() => {
                        // ...remove loading button...
                        this.$refs.submitButton.classList.remove('cc-loading')

                        // ...show modal...
                        this.modalSuccess = true

                        // ...reset this.employee values...
                        this.employee = {
                            SS: null,
                            employmentstart: null,
                            position: null,
                            contracttype: null,
                        }
                    }, 2500)

                }
            }
        }
    }
</script>
