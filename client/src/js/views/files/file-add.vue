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
                            Add a new document
                        </h1>
                        <div class="cc-w-auto cc-right">
                            <router-link class="btn cc-bg-green fa-angle-left" :to="{name : 'file'}">Back to documents</router-link>
                        </div>
                    </div>
                </div>
            </div>

            <div class="cc-inside">
                <form @submit.prevent="submitForm" class="boxed">


                    <div class="container">
                        <input type="file" @change="uploadFile" multiple>
                        <button type="submit" class="fa-save" ref="submitButton" @click="upload">
                            Upload
                        </button>
                    </div>


                    <!-- <pre>{{$v.employee}}</pre> -->
                </form>

                <!-- MODAL SHOWN WHEN FILE IS CREATED -->
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
                                File registered with success
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                files: null,
                id: '',
                message: '',
                modalSuccess: false,
            };
        },


        methods: {
            
            
            uploadFile(event) {
                this.files = event.target.files,
                    this.id = this.$route.params.id
            },

            upload() {
                const formData = new FormData();
                for (const i of Object.keys(this.files)) {
                    formData.append('files', this.files[i])
                }
                formData.append('id', this.id);
                axios.post('http://localhost:8080/api/upload', formData, {
                }).then((res) => {
                    //save activity for timeline
                    let date = new Date().getFullYear() + "-" + new Date().getMonth() + '-' + new Date().getDate()
                    let time = new Date().getHours() + 'h' + new Date().getMinutes() + 'min'
                    let fulldate = date + " " + time
                    let activity = this.$store.state.auth.user.activity
                    if (activity == undefined) {
                        activity = {}
                    }
                    activity[fulldate] = ["New Document has been added for employee with id "+ this.id, this.$store.state.auth.user.role]

                    let data2 = {
                        activity: activity
                    }

                    updateUser(this.$store.state.auth.user.id, data2).then(response2 => {
                        console.log(response2)
                    })
                    this.modalSuccess = true
                    console.log(res);
                });

            }
        },

        mounted() {
            this.message = '';
        }

    };
</script>
