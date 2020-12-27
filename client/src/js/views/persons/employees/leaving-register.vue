<template>
    <div class="form">
        <div class="cc-loader" v-if="loading">
            <div class="spinner"></div>
        </div>

        <div v-else>

            <div class="top-page">
                <div class="cc-inside">
                    <div class="columns">
                        <h1>
                            Add register
                        </h1>
                        <div class="cc-w-auto cc-right">
                            <router-link class="btn cc-bg-green fa-angle-left" :to="{name : 'view-register',params:{name: this.currentUser.mycompany}}">Back to registers</router-link>
                        </div>
                    </div>
                </div>
            </div>

            <div class="cc-inside">
                <form @submit.prevent="submitForm" class="boxed">

                    <div class="form-item">
                        <label class="block">Exit date</label>
                        <datepicker v-model.trim="employee.exitdate" name="exit"></datepicker>
                    </div>

                    <div class="form-item">
                        <label class="block">Reason for leaving</label>
                        <select v-model="leave">
                            <option>dismissal</option>
                            <option>resignation</option>
                            <option>contractual termination</option>
                        </select>
                    </div>


                    <div class="cc-txt">
                        <button type="submit" class="fa-save" ref="submitButton">Save</button>
                    </div>
                </form>

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
                                Employee registered with success
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import { alpha, alphaNum, and, between, email, maxLength, minLength, numeric, or, required, sameAs } from 'vuelidate/lib/validators'
    import { update, findById } from "../../../services/employee.service";
    import { updateUser } from '../../../services/user.service'
    import Datepicker from 'vuejs-datepicker';

    export default {
        name: 'leaving-register',
        data() {
            return {
                modalSuccess: false,

                // Inputs definitions
                
                leave: '',

                employee: {
                    exitdate: null,
                    leavingreason : this.leave
                },
            }
        },

        components: {
            Datepicker
        },

        validations: {
            employee: {
                exitdate: required
            }
        },

        watch: {
            // When route change but same component is called, launch "fetchData" method
            //'$route' : 'fetchData'
        },


        computed: {
            currentUser() {
                return this.$store.state.auth.user;
            }
        },

        methods: {

           
            // Submit form method
            submitForm() {

                // touch form validators
                this.$v.employee.$touch()

                // If no errors
                if (!this.$v.employee.$error) {

                    // show loading button
                    this.$refs.submitButton.classList.add('cc-loading')

                  

                    findById(this.$route.params.id)
                        .then(response => {
                            if (response.data.error) {
                                alert("Error")
                            } else {
                                let data = {
                                    exitdate: this.employee.exitdate,
                                    leavingreason: this.leave
                                }
                                update(response.data.id, data)
                                    .then(response => {
                                        if (response.data.error) {
                                            alert('data.error')
                                        }
                                    }).catch(error => { alert('Error during fetching datas') })
                            }
                        })



                    //save activity for timeline
                    let date = new Date().getFullYear() + "-" + new Date().getMonth() + '-' + new Date().getDate()
                    let time = new Date().getHours() + 'h' + new Date().getMinutes() + 'min'
                    let fulldate = date + " " + time
                    let activity = this.$store.state.auth.user.activity
                    if (activity == undefined) {
                        activity = {}
                    }

                    activity[fulldate] = ["Employee " + this.employee.lastname + " " + this.employee.firstname +
                        +" left.", this.$store.state.auth.user.role]

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
                            exitdate: null,
                            leavingreason: null
                        }
                    },2500)
                }
            }
        }
    }
</script>
