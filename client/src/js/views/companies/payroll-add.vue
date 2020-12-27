<template>
    <div class="form">

        <form @submit.prevent="submitForm">


            <div class="form-item cc-txt-center">
                <div class="form-item cc-txt-center">
                    <label class="block">Company</label>
                    <select v-model="payroll.company">
                        <option v-for="c in companies" :key="c">
                            {{c.name}}
                        </option>
                    </select>
                </div>
            </div>

            <div class="form-item cc-txt-center" :class="{ 'error': $v.payroll.position.$error }">
                <label class="block">Position</label>
                <input type="text" name="position" v-model.trim="payroll.position" @input="$v.payroll.position.$touch()" />
                <span class="warning" v-if="!$v.payroll.position.required">
                    Field is required
                </span>
            </div>

            <div class="form-item cc-txt-center" :class="{ 'error': $v.payroll.hourrate.$error }">
                <label class="block">Hour rate</label>
                <input type="text" name="rate" v-model.trim="payroll.hourrate" @input="$v.payroll.hourrate.$touch()" />
                <span class="warning" v-if="!$v.payroll.hourrate.numeric">
                    Hour rate must be numeric.
                </span>
                <span class="warning" v-if="!$v.payroll.hourrate.required">
                    Field is required
                </span>
            </div>

            <div class="form-item cc-txt-center" :class="{ 'error': $v.payroll.extrahourrate.$error }">
                <label class="block">Extra Hour rate</label>
                <input type="text" name="extrarate" v-model.trim="payroll.extrahourrate" @input="$v.payroll.extrahourrate.$touch()" />
                <span class="warning" v-if="!$v.payroll.extrahourrate.numeric">
                    Hour rate must be numeric.
                </span>
                <span class="warning" v-if="!$v.payroll.extrahourrate.required">
                    Field is required
                </span>
            </div>

            <div class="cc-txt-center">
                <button type="submit" class="fa-save" ref="submitButton">Save</button>
            </div>

            <!-- <pre>{{$v.payroll}}</pre> -->
        </form>

    </div>
</template>

<script>

    import { alpha, alphaNum, and, between, email, maxLength, minLength, numeric, or, required, sameAs } from 'vuelidate/lib/validators'
    import { createPayroll } from '../../services/payroll.service';
    import { findAllCompanies } from '../../services/company.service'

    export default {
        name: 'payroll-add',
        data() {
            return {
                // Inputs definitions
                payroll: {
                    position: null,
                    company: null,
                    hourrate: null,
                    extrahourrate: null,
                },
                companies: [],
            }
        },
        validations: {
            payroll: {
                position: {
                    required,
                },

                hourrate: {
                    required,
                    numeric
                },
                extrahourrate: {
                    required,
                    numeric
                },
            }
        },

        created() {
            findAllCompanies()
                .then(response => {
                    if (response.data.error) {

                        this.showError('data.error')

                    } else {
                        this.companies = response.data
                    }

                }).catch(error => {
                    // Set the error msg
                    this.showError('Error during fetching datas')

                })
        },

        methods: {

            // Submit form method
            submitForm() {

                // touch form validators
                this.$v.payroll.$touch()

                // If no errors
                if (!this.$v.payroll.$error) {

                    // show loading button
                    this.$refs.submitButton.classList.add('cc-loading')
                    
                    let data = {
                        company: this.payroll.company,
                        position: this.payroll.position,
                        hourrate: this.payroll.hourrate,
                        extrahourrate: this.payroll.extrahourrate,
                    }

                    createPayroll(data)
                        .then(response => {
                            console.log(response.data);
                        })
                        .catch(e => {
                            console.log(e);
                        });

                    this.$emit('addSuccess', true)

                }
            }
        }
    }
</script>
