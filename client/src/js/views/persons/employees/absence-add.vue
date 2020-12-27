<template>
    <div class="form">

        <form>

            <div class="form-item">
                <label class="block">Employee</label>
                <select v-model="selected">
                    <option v-for="empl in employees" :key="empl">
                        {{empl.lastname}} {{empl.firstname}}
                    </option>
                </select>
            </div>

            <div class="form-item">
                <label class="block">Absence date</label>
                <label class="block">From</label>
                <datepicker v-model.trim="absencestart"></datepicker>
                <label class="block">To</label>
                <datepicker v-model.trim="absenceend"></datepicker>
            </div>

            <div class="form-item">
                <label class="block">Upload Justification</label>

                <input type="file" @change="uploadFile">
            </div>
            <div>
                <br />
            </div>
                <div>
                    <button type="submit" class="fa-thumbs-up" @click="submitForm" ref="submitButton">Save</button>
                </div>




                <div :class="[{'active' : modalAddSuccess}, 'modal']">
                    <!-- Close button -->
                    <button class="modal-close" @click="modalAddSuccess = false"></button>
                    <!-- Overlay -->
                    <div class="modal-overlay" @click="modalAddSuccess = false"></div>
                    <!-- Modal content -->
                    <div class="modal-content">
                        <div class="modal-header">
                            Registration success
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info fa-thumbs-up">
                                Absence added with success
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cc-inside">
                    <div class="alert alert-error">
                        {{message}}
                    </div>
                </div>
        </form>

    </div>
</template>

<script>
    import { findByCompany, findByFullname, update, findAbsence } from '../../../services/employee.service';
    import { updateUser } from '../../../services/user.service';
    import axios from 'axios';
    import Datepicker from 'vuejs-datepicker';

    export default {
        name: 'paycheck-add',
        data() {
            return {
                employee: '',
                absencestart: '',
                absenceend: '',
                selected: '',
                splitedName: [],
                employees: [],
                modalAddSuccess: null,
                files: null,
            }
        },

        components: {
            Datepicker
        },

        created() {
            this.find(this.$store.state.auth.user.mycompany)
        },

        methods: {

            find(name) {
                findByCompany(name)
                    .then(response => {
                        if (response.data.error) {
                            this.showError('data.error')
                        } else {
                            this.employees = response.data
                        }
                    }).catch(error => {
                        alert('Error during fetching datas')
                    })
            },

            uploadFile(event) {
                this.files = event.target.files
            },

            submitForm() {

                this.message = ''
                this.$refs.submitButton.classList.add('cc-loading')
                this.splitedName = this.selected.split(' ')
                let range = parseFloat(this.absenceend.getDate()) - parseFloat(this.absencestart.getDate()) + 1
                let currentdate = new Date().getMonth() + " " + new Date().getFullYear();
                let found = false

                findByFullname(this.splitedName[1], this.splitedName[0]).then(response => {
                    if (response.data.error) {
                        alert('data.error')
                    } else {
                        this.employee = response.data
                        findAbsence(this.employee.id).then(result => {
                            this.data = result.data
                            let absences = {}
                            if (Object.keys(this.data).length != 0) { 
                                let values = Object.values(this.data)
                                let month = 0;
                                for (month; month < values.length; month++) {
                                    let adate = Object.keys(values[month])
                                    if (adate == currentdate) {
                                        let oldrange = parseFloat(Object.values(values[month])[0]);
                                        absences[currentdate] = range + oldrange
                                        found = true
                                    }
                                }
                                if (found == false) {
                                    absences[currentdate] = range
                                }
                            }
                            else {
                                absences[currentdate] = range
                            }
                                
                            let data3 = {
                                absences: absences
                            }

                            update(this.employee.id, data3)
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

                            activity[fulldate] = ["Absence for employee " + this.employee.lastname + " " + this.employee.firstname +
                                +" has been registered!", this.$store.state.auth.user.role]

                            let data2 = {
                                activity: activity
                            }

                            updateUser(this.$store.state.auth.user.id, data2).then(response2 => {
                                console.log(response2)
                            })


                            const formData = new FormData();
                            for (const i of Object.keys(this.files)) {
                                formData.append('files', this.files[i])
                            }
                            formData.append('id', this.employee.id);
                            axios.post('http://localhost:8080/api/upload', formData, {
                            }).then((res) => {
                                this.$refs.submitButton.classList.remove('cc-loading')
                                this.modalAddSuccess = true
                                this.selected = ''
                            })

                        }).catch(error => { alert('Error during fetching datas') })
                           
                    }
                })
            },

        showMessage(msg) {
            this.message = msg
        },
    }
}
        
</script>
