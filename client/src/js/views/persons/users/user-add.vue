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
                            Add a new User
                        </h1>
                        <div class="cc-w-auto cc-right">
                            <router-link class="btn cc-bg-blue fa-angle-left" :to="{name : 'users'}">Back to users</router-link>
                        </div>
                    </div>
                </div>
            </div>

            <div class="cc-inside">
                <form @submit.prevent="submitForm" class="boxed">


                    <div class="form-item cc-txt-center" :class="{ 'error': $v.user.lastname.$error }">
                        <label class="block">Last Name</label>
                        <input type="text" name="lastname" v-model.trim="user.lastname" @input="$v.user.lastname.$touch()" />
                        <span class="warning" v-if="!$v.user.lastname.minLength">
                            Name must have at least {{$v.user.lastname.$params.minLength.min}} letters.
                        </span>
                        <span class="warning" v-if="!$v.user.lastname.required">
                            Field is required
                        </span>
                    </div>
                    <!-- <pre>{{$v.user.lastname}}</pre> -->

                    <div class="form-item cc-txt-center" :class="{ 'error': $v.user.firstname.$error }">
                        <label class="block">First Name</label>
                        <input type="text" name="firstname" v-model.trim="user.firstname" @input="$v.user.firstname.$touch()" />
                        <span class="warning" v-if="!$v.user.firstname.minLength">
                            Name must have at least {{$v.user.firstname.$params.minLength.min}} letters.
                        </span>
                        <span class="warning" v-if="!$v.user.firstname.required">
                            Field is required
                        </span>
                    </div>
                    <!-- <pre>{{$v.user.firstname}}</pre> -->


                    <div class="form-item cc-txt-center" :class="{ 'error': $v.user.username.$error }">
                        <label class="block">Username</label>
                        <input type="text" name="username" v-model.trim="user.username" @input="$v.user.username.$touch()" />
                        <span class="warning" v-if="!$v.user.username.minLength">
                            Name must have at least {{$v.user.username.$params.minLength.min}} letters.
                        </span>
                        <span class="warning" v-if="!$v.user.username.required">
                            Field is required
                        </span>
                    </div>
                    <!-- <pre>{{$v.user.username}}</pre> -->

                    <div class="form-item cc-txt-center" :class="{ 'error': $v.user.email.$error }">
                        <label class="block">Email</label>
                        <input type="email" name="email" v-model.trim="user.email" @input="$v.user.email.$touch()" />
                        <span class="warning" v-if="!$v.user.email.email">
                            Must be an email format "@"
                        </span>
                        <span class="warning" v-if="!$v.user.email.required">
                            Field is required
                        </span>
                    </div>
                    <!-- <pre>{{$v.user.email}}</pre> -->
                    <div class="form-item cc-txt-center" :class="{ 'error': $v.user.password.$error }">
                        <label class="block">Password</label>
                        <input type="password" name="password" v-model.trim="user.password" @input="$v.user.password.$touch()" />
                        <span class="warning" v-if="!$v.user.password.required">
                            This field is required
                        </span>
                        <span class="warning" v-if="!$v.user.password.minLength">
                            Name must have at least {{$v.user.password.$params.minLength.min}} letters.
                        </span>
                    </div>
                    <!-- <pre>{{$v.user.password}}</pre> -->
                    <div class="form-item cc-txt-center" :class="{ 'error': $v.user.confirmPassword.$error }">
                        <label class="block">Confirm password</label>
                        <input type="password" name="confirmPassword" v-model.trim="user.confirmPassword" @input="$v.user.confirmPassword.$touch()" />
                        <span class="warning" v-if="!$v.user.confirmPassword.required">
                            This field is required
                        </span>
                        <span class="warning" v-if="!$v.user.confirmPassword.sameAsPassword">
                            Must be identical to Password field
                        </span>
                        <span class="warning" v-if="!$v.user.confirmPassword.minLength">
                            Name must have at least {{$v.user.confirmPassword.$params.minLength.min}} letters.
                        </span>
                    </div>
                    <!-- <pre>{{$v.user.confirmPassword}}</pre> -->

                    <div class="cc-txt-center">
                        <button type="submit" class="fa-save" ref="submitButton">Save</button>
                    </div>

                    <!-- <pre>{{$v.user}}</pre> -->
                </form>

                <!-- MODAL SHOWN WHEN USER IS CREATED -->
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
                                User registered with success
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
    import { adduser } from '../../../services/auth.service';
    import { updateUser } from '../../../services/user.service';

    export default {
        name: 'user-add',
        data () {
            return {
                // Is the page loading ?
                loading:true,

                // Modal when user is created with success
                modalSuccess: false,
                
                // Inputs definitions
                user: {
                    lastname: null,
                    firstname: null,
                    email: null,
                    username: null,
                    password: null,
                    mycompany: null,
                    role:null,
                    confirmPassword: null,
                }

            }
        },
        created () {
            this.loading = false
        },
        // Meta tags in <head> section
        head: {
            title() {
                return {
                    inner: 'Add a new User',
                }
            },
            meta() {
                return [
                ]
            }
        },
        validations: {
            user: {
                lastname: {
                    required,
                    minLength: minLength(4)
                },
                firstname: {
                    required,
                    minLength: minLength(4)
                },
                username: {
                    required,
                    minLength: minLength(4)
                },
                email: {
                    required,
                    email
                },
                password: {
                    required,
                    minLength: minLength(6)
                },
                confirmPassword: {
                    required,
                    minLength: minLength(6),
                    sameAsPassword: sameAs('password')
                }
            }
        },
        watch: {
            // When route change but same component is called, launch "fetchData" method
            // for exemple : from "user/25" -> to -> "user/52"
            '$route' : 'fetchData'
        },
        methods: {
            submitForm(){

                // touch form validators
                this.$v.user.$touch()

                // If no errors
                if(!this.$v.user.$error) {

                    // show loading button
                    this.$refs.submitButton.classList.add('cc-loading')

                    // Stringify user datas
                    let userToSave = JSON.stringify(this.user)
                    alert(userToSave)

                    let data = {
                        firstname: this.user.firstname,
                        lastname: this.user.lastname,
                        username: this.user.username,
                        email: this.user.email,
                        password: this.user.password,
                    }
                     adduser(data)
                         .then(data => {
                              this.$emit('adduser', data.user);
                         })
                         .catch(err => alert(err.message));


                    //save activity for timeline
                    let date = new Date().getFullYear() + "-" + new Date().getMonth() + '-' + new Date().getDate()
                    let time = new Date().getHours() + 'h' + new Date().getMinutes() + 'min'
                    let fulldate = date + " " + time
                    let activity = this.$store.state.auth.user.activity
                    if (activity == undefined) {
                        activity = {}
                    }

                    activity[fulldate] = ["New User has been added", this.$store.state.auth.user.role]

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
                        this.user = {
                            lastname: null,
                            firstname: null,
                            email: null,
                            username: null,
                            password: null,
                            confirmPassword: null,
                        }
                    },
                    2500)

                }
            }
        }
    }
</script>
