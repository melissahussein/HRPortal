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
                        <label class="block">Employee</label>
                        <select v-model="selected">
                            <option v-for="empl in employees" :key="empl">
                                {{empl.lastname}} {{empl.firstname}}
                            </option>
                        </select>
                    </div>
                    <div class="form-item">
                        <label class="block">SS Number</label>
                        <input type="text" name="SS" v-model.trim="employee.SS" />
                    </div>
                    <div class="form-item">
                        <label class="block">Starting day of Employment</label>
                        <datepicker v-model.trim="employee.employmentstart" name="start"></datepicker>
                    </div>
                    <div class="form-item">
                        <label class="block">Poisition held</label>
                        <input type="text" name="position" v-model.trim="employee.position" />
                    </div>
                    <div class="form-item">
                        <label class="block">Contract type</label>
                        <input type="text" name="contract" v-model.trim="employee.contracttype" />
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
    import { update, findByCompany, findByFullname } from "../../../services/employee.service";
    import Datepicker from 'vuejs-datepicker';

    export default {
        name: 'employee-register',
        data() {
            return {
                modalSuccess: false,
                
                // Inputs definitions

                selected: '',
                
                employee: {
                    SS : null,
                    employmentstart: null,
                    position: null,
                    contracttype: null
                },
                splitedName: [],
                employees:[],
            }
        },

        components: {
            Datepicker
        },

        validations: {
            employee: {
                SS: required,
                employmentstart: required,
                position: required,
                contracttype: required
            }
        },

        watch: {
            // When route change but same component is called, launch "fetchData" method
            //'$route' : 'fetchData'
        },
        

        computed: {
            currentUser() {
                this.findCompany(this.$store.state.auth.user.mycompany)
                return this.$store.state.auth.user;
            }
        },

        methods: {

            find(first,last) {
                findByFullname(first,last)
                    .then(response => {
                        if (response.data.error) {
                            alert("Error")
                        } else {
                            return response.data
                        }
                    })
            },

            findCompany(name) {
                findByCompany(name)
                    .then(response => {
                        if (response.data.error) {
                            this.showError('data.error')
                        } else {
                            this.employees = response.data
                        }
                    })
            },
            

            // Submit form method
            submitForm() {

                // touch form validators
                this.$v.employee.$touch()

                // If no errors
                if (!this.$v.employee.$error) {

                    // show loading button
                    this.$refs.submitButton.classList.add('cc-loading')


                    this.splitedName = this.selected.split(" ")

                    findByFullname(this.splitedName[1], this.splitedName[0])
                        .then(response => {
                            if (response.data.error) {
                                alert("Error")
                            } else {
                                let data = {
                                    SS: this.employee.SS,
                                    employmentstart: this.employee.employmentstart,
                                    position: this.employee.position,
                                    contracttype: this.employee.contracttype,
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

                    activity[fulldate] = ["Register for employee" + this.employee.lastname + " " + this.employee.firstname +
                        +" has been added.",this.$store.state.auth.user.role]

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
                    },2500)
                }
            }
        }
    }
</script>
