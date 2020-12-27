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
                            Add a new Employee
                        </h1>
                        <div class="cc-w-auto cc-right">
                            <router-link class="btn cc-bg-green fa-angle-left" :to="{name : 'employees',params:{name: this.currentUser.mycompany}}">Back to employees</router-link>
                        </div>
                    </div>
                </div>
            </div>

            <div class="cc-inside">
                <form @submit.prevent="submitForm" class="boxed">


                    <div class="form-item cc-txt-center" :class="{ 'error': $v.employee.lastname.$error }">
                        <label class="block">Last Name</label>
                        <input type="text" name="lastname" v-model.trim="employee.lastname" @input="$v.employee.lastname.$touch()" />
                        <span class="warning" v-if="!$v.employee.lastname.required">
                            Field is required
                        </span>
                    </div>
                    <!-- <pre>{{$v.employee.lastname}}</pre> -->

                    <div class="form-item cc-txt-center" :class="{ 'error': $v.employee.firstname.$error }">
                        <label class="block">First Name</label>
                        <input type="text" name="firstname" v-model.trim="employee.firstname" @input="$v.employee.firstname.$touch()" />
                        <span class="warning" v-if="!$v.employee.firstname.required">
                            Field is required
                        </span>
                    </div>
                    <!-- <pre>{{$v.employee.firstname}}</pre> -->

                    
                    <div class="cc-txt-center">
                        <button type="submit" class="fa-save" ref="submitButton">Save</button>
                    </div>

                    <!-- <pre>{{$v.employee}}</pre> -->
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
    import { create } from "../../../services/employee.service";
    import { updateUser, findUser } from '../../../services/user.service'

    export default {
        name: 'employee-add',
        data() {
            return {
                loading: true,
                modalSuccess: false,
                // Inputs definitions
                employee: {
                    id: null,
                    firstname: null,
                    lastname: null,
                    company: null
                },
            }
        },
        validations: {
            employee: {
                lastname: {
                    required,
                },

                firstname: {
                    required,
                },
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

        created() {
            this.loading = false
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
                   

                    let data = {
                        firstname: this.employee.firstname,
                        lastname: this.employee.lastname,
                        company: this.currentUser.mycompany,
                    }

                    create(data)
                        .then(response => {
                            this.employee.id = response.data.id;

                            console.log(response.data);
                        })
                        .catch(e => {
                            console.log(e);
                        });

                    //save activity for timeline
                    let date = new Date().getFullYear() + "-" + new Date().getMonth() + '-' + new Date().getDate()
                    let time = new Date().getHours() + 'h' + new Date().getMinutes() + 'min' + new Date().getSeconds()+'s'
                    let fulldate = date + " " + time
                    
                    let activity = this.currentUser.activity
                    if (activity == undefined) {
                        activity = {}
                    }

                    activity[fulldate] = ["New Employee has been added!", this.currentUser.role]

                    let data2 = {
                        activity:activity
                    }

                    updateUser(this.currentUser.id, data2).then(response2 => {
                        console.log (response2)
                    })
                
                    setTimeout(() => {
                        // ...remove loading button...
                        this.$refs.submitButton.classList.remove('cc-loading')

                        // ...show modal...
                        this.modalSuccess = true

                        // ...reset this.employee values...
                        this.employee = {
                            lastname: null,
                            firstname: null,
                            company: null
                        }
                    },2500)
                }
            }
        }
    }
</script>
