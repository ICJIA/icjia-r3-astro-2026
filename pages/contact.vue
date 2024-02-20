<template>
  <div>
    <v-container class="mb-12">
      <v-row justify="center" align="center" class="row">
        <v-col cols="12" md="12" class="text-left">
          <h1>Contact R3</h1>
          <div class="px-16">
            <v-card
              class="px-10 py-10"
              elevation=""
              style="
                background: #093356;
                margin-bottom: 105px;
                margin-top: 35px;
                color: #fff;
              "
            >
              <h2 style="color: #fff">
                Have an R3 question or need assistance?
              </h2>

              <div class="pl-3">
                <p>
                  Please fill out the form below, and we'll get back to you as
                  soon as possible.
                </p>
                <p>Or, contact us via email:</p>
                <ul>
                  <li>
                    <span>General R3-related questions: </span>
                    <a href="mailto: CJA.r3mbr@illinois.gov" class="white-text"
                      >CJA.r3mbr@illinois.gov</a
                    >
                  </li>
                  <li>
                    <span>Questions about the R3 NOFO: </span>
                    <a
                      href="mailto: CJA.R3Questions@illinois.gov"
                      class="white-text"
                      >CJA.R3Questions@illinois.gov</a
                    >
                  </li>
                </ul>
              </div>
            </v-card>
          </div>

          <v-form ref="form" class="mx-2" v-model="valid" lazy-validation>
            <v-row>
              <v-col cols="12">
                <!-- <v-text-field
                  v-model="subject"
                  :rules="subjectRules"
                  label="Subject"
                  required
                  :disabled="successfullySubmitted"
                  style="font-weight: 700 !important"
                ></v-text-field> -->
                <v-select
                  :items="subjects"
                  label="Select Type of Request"
                  dense
                  v-model="subject"
                  :rules="subjectRules"
                  class="heavy"
                  aria-label="Select Type of Request"
                  required
                  :disabled="successfullySubmitted"
                  style="font-weight: 700 !important"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="firstname"
                  :rules="nameRules"
                  label="First Name"
                  :disabled="successfullySubmitted"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="lastname"
                  :rules="nameRules"
                  label="Last Name"
                  :disabled="successfullySubmitted"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  :disabled="successfullySubmitted"
                  label="Email"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="phone"
                  label="Phone Number"
                  :disabled="successfullySubmitted"
                  :rules="phoneRules"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="message"
                  clearable
                  clear-icon="mdi-close-circle"
                  label="Message"
                  :disabled="successfullySubmitted"
                  :rules="messageRules"
                  auto-grow
                  required
                ></v-textarea>
              </v-col>
            </v-row>

            <div class="text-center mt-5" v-if="!successfullySubmitted">
              <v-btn @click="submitForm"> Submit </v-btn>&nbsp;&nbsp;&nbsp;

              <v-btn @click="clearForm" variant="outlined"> Clear </v-btn>
            </div>
            <div
              class="text-center mt-5"
              style="color: green; font-weight: 900"
              v-else
            >
              Your form was successfully submitted!
              <div style="color: #111; font-weight: 400" class="mt-2">
                &laquo;&nbsp;<nuxt-link
                  to="/"
                  style="color: #111; font-weight: 400"
                  >Back to home</nuxt-link
                >
              </div>
            </div>
          </v-form>
        </v-col>
      </v-row>
      <v-row>
        <!-- <v-col
          ><div class="text-center mt-5">
            <a href="mailto:r3@illinois.gov">cja.r3@illinois.gov</a>
          </div></v-col
        > -->
      </v-row>
    </v-container>
    <div style="height: 75px" class="hidden-md-and-up"></div>
  </div>
</template>

<script>
import DOMPurify from "dompurify";
import axios from "axios";
const api = axios.create({
  timeout: 15000,
});
/**
 * Sanitizes a string by removing any characters that are not alphanumeric, space, period,
 * comma, underscore, or hyphen. Also trims any leading or trailing whitespace.
 *
 * @param {string} str - The string to be sanitized.
 * @return {string} - The sanitized string.
 */
// function sanitizeString(str) {
//   str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
//   return str.trim();
// }

/**
 * Inserts data into the database.
 *
 * @param {Object} param - An object containing the data to be inserted.
 * @param {string} param.type - The type of the data.
 * @param {string} param.email - The email of the user.
 * @param {Object} param.form - The form data.
 * @return {Promise} A Promise that resolves with the result of the insert operation or rejects with an error.
 */

// const dbInsert = async function ({ type, email, ...form }) {
//   let axiosHeaders = {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };
//   let axiosDBSubmitData = {
//     type,
//     email,
//     form,
//   };
//   try {
//     return await api.post(
//       `https://r3.icjia-api.cloud/api/forms`,
//       JSON.stringify(axiosDBSubmitData),
//       axiosHeaders
//     );
//   } catch (e) {
//     console.log(e);

//     return `${e}`;
//   }
// };

export default {
  name: "ContactForm",

  data: () => ({
    valid: false,
    successfullySubmitted: false,
    firstname: "",
    lastname: "",
    subject: "",
    subjects: ["R3 General Questions", "R3 NOFO Questions"],
    phone: "",
    message: "",
    myForm: {},
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 100) || "Name must be less than 100 characters",
    ],
    subjectRules: [
      (v) => !!v || "Subject is required",
      (v) =>
        (v && v.length <= 100) || "Subject must be less than 100 characters",
    ],

    phoneRules: [(v) => !!v || "Contact phone number is required"],
    messageRules: [(v) => !!v || "A message is required"],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) =>
        /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        ) || "E-mail must be valid",
    ],
  }),
  methods: {
    /**
     * Submit the form asynchronously.
     *
     * @return {Promise<void>} A promise that resolves when the form is submitted.
     */
    async submitForm() {
      this.$refs.form.validate();
      // this.subject = sanitizeString(this.subject);
      let myForm;
      if (this.valid) {
        myForm = {
          type: "R3 Contact Form",
          subject: DOMPurify.sanitize(this.subject).replace(
            /(<([^>]+)>)/gi,
            ""
          ),
          firstname: DOMPurify.sanitize(this.firstname).replace(
            /(<([^>]+)>)/gi,
            ""
          ),
          lastname: DOMPurify.sanitize(this.lastname).replace(
            /(<([^>]+)>)/gi,
            ""
          ),
          email: DOMPurify.sanitize(this.email).replace(/(<([^>]+)>)/gi, ""),
          phone: DOMPurify.sanitize(this.phone).replace(/(<([^>]+)>)/gi, ""),
          message: DOMPurify.sanitize(this.message).replace(
            /(<([^>]+)>)/gi,
            ""
          ),
        };

        let axiosHeaders = {
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        };

        let axiosDBSubmitData = {
          type: myForm.type,
          email: myForm.email,
          subject: myForm.subject,
          form: myForm,
        };

        // First, insert form data into r3 database

        try {
          await api.post(
            `https://r3.icjia-api.cloud/api/forms`,
            { data: axiosDBSubmitData },
            axiosHeaders
          );
          console.log("db insert success");
        } catch (e) {
          console.log(e);
          console.log("db insert failure");
        }

        let emailData = {
          form: myForm,
        };
        // TODO: For different URLs based on subject
        let targetURL = "https://mail.icjia.cloud/test";
        if (this.subject === "R3 General Questions") {
          // targetURL = "https://mail.icjia.cloud/r3-general";
          console.log('targetURL = "https://mail.icjia.cloud/r3-general"');
        } else {
          // targetURL = "https://mail.icjia.cloud/r3-nofo";
          console.log('targetURL = "https://mail.icjia.cloud/r3-nofo"');
        }

        let options = {
          method: "POST",
          data: emailData.form,
          headers: {
            "Content-Type": "application/json",
          },
          url: targetURL,
        };

        console.log("form email: ", axiosDBSubmitData);
        console.log("form options: ", options);

        try {
          console.log("Sending...");
          let res = await axios(options);
          //this.success(res);
          console.log("Email sent: ", res);
        } catch (err) {
          console.log(err.message);
          console.log("nodemailer failure");
        }

        this.successfullySubmitted = true;

        console.log("submitForm ", this.valid);
      }
    },
    /**
     * Clears the form by resetting the form fields, setting the 'valid' property to false,
     * and setting the 'successfullySubmitted' property to false.
     *
     * @return {void} No return value.
     */

    clearForm() {
      this.$refs.form.reset();
      this.valid = false;
      this.successfullySubmitted = false;

      console.log("form cleared");
    },
  },

  /**
   * Lifecycle hook that initializes app state on mount.
   *
   * @return {void}
   */
  mounted() {
    //this.$refs.form.reset();
    this.valid = false;
    this.successfullySubmitted = false;
    //console.log("Route query: ", this.$route.query);
    // if (this.$route.query && this.$route.query.subject) {
    //   this.subject = sanitizeString(this.$route.query.subject);
    // }
  },
};
</script>
<style scoped>
.fluid {
  margin: 0;
  padding: 0;
}

.white-text {
  color: #fff;
}
</style>
