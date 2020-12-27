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
                            Add a new Company
                        </h1>
                        <div class="cc-w-auto cc-right">
                            <router-link class="btn cc-bg-purple fa-angle-left" :to="{name : 'companies'}">Back to companies</router-link>
                        </div>
                    </div>
                </div>
            </div>

            <div class="cc-inside">
                <form @submit.prevent="submitForm" class="boxed">


                    <div class="form-item cc-txt-center" :class="{ 'error': $v.company.name.$error }">
                        <label class="block">Company Name</label>
                        <input type="text" name="lastname" v-model.trim="company.name" @input="$v.company.name.$touch()" />
                        <span class="warning" v-if="!$v.company.name.minLength">
                            Name must have at least {{$v.company.name.$params.minLength.min}} letters.
                        </span>
                        <span class="warning" v-if="!$v.company.name.required">
                            Field is required
                        </span>
                    </div>
                    <!-- <pre>{{$v.company.name}}</pre> -->

                    <div class="form-item cc-txt-center">
                        <label class="block">Legal Representative</label>
                        <select v-model="selectedLR">
                            <option v-for="user in users" :key="user">
                                {{user.lastname}} {{user.firstname}}
                            </option>
                        </select>
                    </div>

                    <div class="form-item cc-txt-center">
                        <label class="block">Human Resources Manager</label>
                        <select v-model="selectedHR">
                            <option v-for="user in users" :key="user">
                                {{user.lastname}} {{user.firstname}}
                            </option>
                        </select>
                    </div>
                    <div class="cc-txt-center">
                        <button type="submit" class="fa-save" ref="submitButton">Save</button>
                    </div>

                    <!-- <pre>{{$v.company}}</pre> -->
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
                                Company registered with success
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
    import { addcompany } from '../../services/company.service'
    import { findAllUsers, updateRole } from '../../services/user.service'

    export default {
        name: 'company-add',
        data() {
            return {

                users:[],
                // Is the page loading ?
                loading: true,

                // Modal when company is created with success
                modalSuccess: false,

                //Role from input
                selectedLR: '',
                selectedHR: '',
                splitedNameLR: [],
                splitedNameHR: [],

                // Inputs definitions
                company: {
                    name: null,
                    LR: this.selectedLR,
                    HR: this.selectedHR,
                }

            }
        },
        created() {
            findAllUsers()
                .then(response => {
                    if (response.data.error) {
                        this.showError('data.error')
                    } else {
                        this.loading = false
                        // Contains all datas
                        this.users = response.data
                   }
                }).catch(error => {
                    this.showError('Error during fetching datas')
                })
        },

        // Meta tags in <head> section
        head: {
            title() {
                return {
                    inner: 'Add a new Company',
                }
            },
            meta() {
                return [
                ]
            }
        },
        validations: {
           company: {
                name: {
                    required,
                    minLength: minLength(6)
                }
            }
        },
        watch: {
            // When route change but same component is called, launch "fetchData" method
            // for exemple : from "user/25" -> to -> "user/52"
            '$route': 'fetchData'
        },
        methods: {
            submitForm() {

                // touch form validators
                this.$v.company.$touch()

                // If no errors
                if (!this.$v.company.$error) {

                    // show loading button
                    this.$refs.submitButton.classList.add('cc-loading')

                    // Stringify company datas
                    let companyToSave = JSON.stringify(this.company)
                    alert(companyToSave)

                    let data = {
                        name: this.company.name,
                        LR: this.selectedLR,
                        HR: this.selectedHR
                    }
                    let dataLR = {
                        role: 'Legal Representative',
                        mycompany: this.company.name
                    }

                    let dataHR = {
                        role: 'Human Resources Manager',
                        mycompany: this.company.name
                    }

                    addcompany(data)
                        .then(data => {
                            this.$emit('addcompany', data.company);
                        })
                        .catch(err => alert(err.message));

                    this.splitedNameHR = this.selectedHR.split(" ")

                    updateRole(this.splitedNameHR[1], this.splitedNameHR[0], dataHR)
                        .then(response => {
                            if (response.data.error) {
                                this.showError('data.error')

                            } else { this.loading = false }

                        }).catch(error => { this.showError('Error during fetching datas') })


                  this.splitedNameLR = this.selectedLR.split(" ")  

                    updateRole(this.splitedNameLR[1], this.splitedNameLR[0], dataLR)
                    .then(response => {

                    if(response.data.error) {
                        this.showError('data.error')

                    } else {this.loading = false }

                }).catch(error => { this.showError('Error during fetching datas')})
                
                    //save activity for timeline
                    let date = new Date().getFullYear() + "-" + new Date().getMonth() + '-' + new Date().getDate()
                    let time = new Date().getHours() + 'h' + new Date().getMinutes() + 'min'
                    let fulldate = date + " " + time
                    let activity = this.$store.state.auth.user.activity
                    if (activity == undefined) {
                        activity = {}
                    }
                    activity[fulldate] = ["New Company has been added by Admins", this.$store.state.auth.user.role]

                    let data2 = {
                        activity: activity
                    }

                    updateUser(this.$store.state.auth.user.id, data2).then(response2 => {
                        console.log(response2)
                    })

                
                    // when registration is done...
                    setTimeout(() => {
                        // ...remove loading button...
                        this.$refs.submitButton.classList.remove('cc-loading')

                        // ...show modal...
                        this.modalSuccess = true

                        // ...reset this.user values...
                        this.company = {
                            name: null,
                            LR: null,
                            HR: null
                        }
                    },
                        2500)

                }
            }
        }
    }
</script>
