<template>
    <div class="form">

        <form @submit.prevent="submitForm">

            <div class="form-item cc-txt-center">
                <label class="block">Employee</label>
                <select v-model="selected">
                    <option v-for="empl in employees" :key="empl">
                        {{empl.lastname}} {{empl.firstname}}
                    </option>
                </select>
            </div>

            <div class="cc-txt-center">
                <button type="submit" class="fa-save" ref="submitButton">Save</button>
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
                            Paycheck created with success
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
    import { findByCompany, findByFullname, findPlanning } from '../../../services/employee.service';
    import { findByCompanyAndPosition } from '../../../services/payroll.service'
    import { updateUser } from '../../../services/user.service'
    import { jsPDF } from "jspdf";

    export default {
        name: 'paycheck-add',
        data() {
            return {
                employee: '',
                selected: '',
                splitedName: [],
                employees: [],
                data: null,
                message: '',
                result: null,
                regularhours: null,
                extrahours: null,
                title: '',
                currentdate: ''
            }
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

            submitForm() {

                this.message = ''
                this.$refs.submitButton.classList.add('cc-loading')
                this.splitedName = this.selected.split(' ')

                findByFullname(this.splitedName[1], this.splitedName[0]).then(response => {
                    if (response.data.error) {
                        this.showError('data.error')
                    } else {
                        this.employee = response.data;
                        findPlanning(this.employee.id).then(response => {
                            if (response.data.error) {
                                alert('data.error')
                            } else {
                                this.data = response.data
                                let values = Object.values(this.data)
                                let month = 0;
                                for (month; month < values.length; month++) {
                                    let date = Object.keys(values[month])
                                    this.currentdate = new Date().getMonth() + " " + new Date().getFullYear();
                                    if (date == this.currentdate) {
                                        this.regularhours = parseFloat(Object.values(values[month])[0][0]['regular hours']);
                                        this.extrahours = parseFloat(Object.values(values[month])[0][1]['extra hours']);
                                        findByCompanyAndPosition(this.employee.position, this.employee.company).then(response2 => {
                                            this.result = response2.data
                                            this.title = 'paycheck_' + this.selected + "_" + this.currentdate+'.pdf'
                                        }).catch(error => { alert("fetch error") })
                                    }
                                }
                                setTimeout(() => {

                                    //save activity for timeline
                                    let date = new Date().getFullYear() + "-" + new Date().getMonth() + '-' + new Date().getDate()
                                    let time = new Date().getHours() + 'h' + new Date().getMinutes() + 'min'
                                    let fulldate = date + " " + time
                                    let activity = this.$store.state.auth.user.activity
                                    if (activity == undefined) {
                                        activity = {}
                                    }

                                    activity[fulldate] = ["Paycheck for employee" + this.employee.lastname + " " + this.employee.firstname +
                                        +" has been saved!", this.$store.state.auth.user.role]

                                    let data2 = {
                                        activity: activity
                                    }

                                    updateUser(this.$store.state.auth.user.id, data2).then(response2 => {
                                        console.log(response2)
                                    })

                                    this.calculateSalary(this.result)
                                    //this.showMessage('Paycheck saved')
                                },
                                    2500)
                            }
                        }).catch(error => {
                            this.showMessage('no plannings have been submitted for this month')
                            this.$refs.submitButton.classList.remove('cc-loading')
                            this.selected =''
                        })

                    }
                }).catch(error => { this.alert('Error during fetching datas') })
            },

            showMessage(msg) {
                this.message = msg
                this.datas = []
            },

            calculateSalary(payroll) {
                let regularsalary = parseFloat(payroll.hourrate) * parseFloat(this.regularhours);
                let extrasalary = parseFloat(payroll.extrahourrate) * parseFloat(this.extrahours);
                let total = regularsalary + extrasalary;

                var pageWidth = 8.5,
                    lineHeight = 1.2,
                    margin = 0.5,
                    maxLineWidth = pageWidth - margin * 2,
                    fontSize = 12,
                    ptsPerInch = 72,
                    oneLineHeight = (fontSize * lineHeight) / ptsPerInch,
                    line1 = "Paycheck for " + this.selected + '\n',
                    line2 = "Date: " + this.currentdate + '\n' + '\n',
                    line3 = "Regular hours worked during the month: " + this.regularhours + '\n',
                    line4 = "Extra hours worked during the month: " + this.extrahours + '\n' + '\n',
                    line5 = "Total Amount: " + total + '$'+'\n' + '\n'+'\n',
                    line6= "Signatures: ",

                    text = line1+line2+line3+line4+line5+line6,

                    doc = new jsPDF({
                        unit: "in",
                        lineHeight: lineHeight
                    }).setProperties({ title: this.title });


                var textLines = doc
                    .setFont("helvetica")
                    .setFontSize(fontSize)
                    .splitTextToSize(text, maxLineWidth);

               
                doc.text(textLines, margin, margin + 2 * oneLineHeight);
                doc.save(this.title)

                this.selected = '';
                this.employee = null;

                setTimeout(() => {
                    this.$refs.submitButton.classList.remove('cc-loading')
                    this.$emit('addSuccess', true)
                }, 2500)
            }

        }
    }
</script>
