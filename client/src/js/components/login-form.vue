<template>
    <form @submit.prevent="submitForm" class="boxed form" >

        <h1>Sign In</h1>

        <div class="form-item" :class="{ 'error': $v.user.username.$error }">
            <div class="form-ps">
                <span><i class="ion-ios-contact-outline"></i> Login</span>
                <input type="text" v-model.trim="user.username" placeholder="..." @input="$v.user.username.$touch()" />
            </div>

            <span class="warning" v-if="!$v.user.username.minLength">
                Name must have at least {{$v.user.username.$params.minLength.min}} letters.
            </span>
            <span class="warning" v-if="!$v.user.username.required">
                Field is required
            </span>
        </div>

        <div class="form-item" :class="{ 'error': $v.user.password.$error }">
            <div class="form-ps">
                <span><i class="ion-ios-locked-outline"></i> Pass.</span>
                <input type="password" v-model.trim="user.password" placeholder="..." @input="$v.user.password.$touch()" />
            </div>

            <span class="warning" v-if="!$v.user.password.minLength">
                Name must have at least {{$v.user.password.$params.minLength.min}} letters.
            </span>
            <span class="warning" v-if="!$v.user.password.required">
                Field is required
            </span>
        </div>

        <button type="submit" ref="submitButton">Sign In</button>
        <div class="form-group">
            <div v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
        </div>
    </form>


</template>

<script>
    import User from '../models/user'
    import { minLength, required } from 'vuelidate/lib/validators'

    export default {
        name: 'login-form',
        data() {
            return {
                user: new User(),
                loading: false,
                message: '',
                path: '',
                role:''
            }
        },
        validations: {
            user: {
                username: {
                    required,
                    minLength: minLength(4)
                },
                password: {
                    required,
                    minLength: minLength(4)
                }
            }
        },
        computed: {
            loggedIn() {
                return this.$store.state.auth.status.loggedIn;
            },
        },
        
        methods: {
            submitForm() {
                this.loading = true;
                this.$validator.validateAll().then(isValid => {
                    if (!isValid) {
                        this.loading = false;
                        return;
                    }
                    if (this.user.username && this.user.password) {
                        this.$store.dispatch('auth/login', this.user).then(
                            () => {
                                this.role = this.$store.state.auth.user.role;
                                if (this.role == "Admin") this.path = '/admin';
                                if (this.role == "Legal Representative") this.path = '/LR';
                                if (this.role == "Human Resources Manager") this.path = '/HR';
                                this.$router.push(this.path+"/"+this.user.username);
                            },
                            error => {
                                this.loading = false;
                                this.message =
                                    (error.response && error.response.data) ||
                                    error.message ||
                                    error.toString();
                            }
                        );
                    }
                });
            }
        }
    }
</script>
