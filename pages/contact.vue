<template>
  <div>
    <TheBreadcrumbBar></TheBreadcrumbBar>
    <v-container class="mb-12">
      <v-row justify="center" align="center" class="row">
        <v-col cols="12" md="12" class="text-left">
          <h1>Contact R3</h1>
          <div class="px-16">
            <v-card
              class="px-10 pt-7 pb-10"
              elevation="10"
              style="
                background: #093356;
                margin-bottom: 105px;
                margin-top: 35px;
                color: #fff;
              "
            >
              <h2 style="color: #fff">Have R3 questions or need assistance?</h2>

              <div class="pl-3">
                <p>
                  Please fill out the form below, and we'll get back to you as
                  soon as possible.
                </p>
              </div>
              <h2 style="color: #fff">R3 Email:</h2>

              <ul>
                <!-- <li>
                  <span>General R3-related questions: </span>
                  <a href="mailto: CJA.r3mbr@illinois.gov" class="white-text"
                    >CJA.r3mbr@illinois.gov</a
                  >
                </li> -->
                <li>
                  <!-- <span>Questions about the R3 NOFO: </span> -->
                  <a
                    href="mailto: CJA.R3Questions@illinois.gov"
                    class="white-text"
                    >CJA.R3Questions@illinois.gov</a
                  >
                </li>
              </ul>
            </v-card>
          </div>

          <!-- Form Status Announcements for Screen Readers -->
          <div aria-live="polite" aria-atomic="true" class="sr-only">
            {{ formStatusMessage }}
          </div>

          <v-form ref="form" class="mx-2" v-model="valid" lazy-validation>
            <v-row>
              <v-col cols="12">
                <v-select
                  :items="subjects"
                  label="Select Type of Request (Required)"
                  dense
                  v-model="subject"
                  :rules="subjectRules"
                  class="heavy"
                  :aria-label="`Select Type of Request. Required field. ${subjectError ? 'Error: ' + subjectError : ''}`"
                  :aria-describedby="subjectError ? 'subject-error' : undefined"
                  :aria-invalid="subjectError ? 'true' : 'false'"
                  required
                  :disabled="successfullySubmitted"
                  style="font-weight: 700 !important"
                  @blur="validateField('subject')"
                ></v-select>
                <div
                  v-if="subjectError"
                  id="subject-error"
                  class="v-messages v-messages--active"
                  role="alert"
                  aria-live="polite"
                >
                  <div
                    class="v-messages__message"
                    style="color: rgb(176, 0, 32)"
                  >
                    {{ subjectError }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="firstname"
                  :rules="nameRules"
                  label="First Name (Required)"
                  :aria-label="`First Name. Required field. ${firstnameError ? 'Error: ' + firstnameError : ''}`"
                  :aria-describedby="
                    firstnameError ? 'firstname-error' : undefined
                  "
                  :aria-invalid="firstnameError ? 'true' : 'false'"
                  :disabled="successfullySubmitted"
                  required
                  @blur="validateField('firstname')"
                ></v-text-field>
                <div
                  v-if="firstnameError"
                  id="firstname-error"
                  class="v-messages v-messages--active"
                  role="alert"
                  aria-live="polite"
                >
                  <div
                    class="v-messages__message"
                    style="color: rgb(176, 0, 32)"
                  >
                    {{ firstnameError }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="lastname"
                  :rules="nameRules"
                  label="Last Name (Required)"
                  :aria-label="`Last Name. Required field. ${lastnameError ? 'Error: ' + lastnameError : ''}`"
                  :aria-describedby="
                    lastnameError ? 'lastname-error' : undefined
                  "
                  :aria-invalid="lastnameError ? 'true' : 'false'"
                  :disabled="successfullySubmitted"
                  required
                  @blur="validateField('lastname')"
                ></v-text-field>
                <div
                  v-if="lastnameError"
                  id="lastname-error"
                  class="v-messages v-messages--active"
                  role="alert"
                  aria-live="polite"
                >
                  <div
                    class="v-messages__message"
                    style="color: rgb(176, 0, 32)"
                  >
                    {{ lastnameError }}
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  :disabled="successfullySubmitted"
                  label="Email (Required)"
                  type="email"
                  autocomplete="email"
                  :aria-label="`Email address. Required field. ${emailError ? 'Error: ' + emailError : ''}`"
                  :aria-describedby="emailError ? 'email-error' : undefined"
                  :aria-invalid="emailError ? 'true' : 'false'"
                  required
                  @blur="validateField('email')"
                ></v-text-field>
                <div
                  v-if="emailError"
                  id="email-error"
                  class="v-messages v-messages--active"
                  role="alert"
                  aria-live="polite"
                >
                  <div
                    class="v-messages__message"
                    style="color: rgb(176, 0, 32)"
                  >
                    {{ emailError }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="phone"
                  label="Phone Number (Required)"
                  type="tel"
                  autocomplete="tel"
                  :disabled="successfullySubmitted"
                  :rules="phoneRules"
                  :aria-label="`Phone number. Required field. ${phoneError ? 'Error: ' + phoneError : ''}`"
                  :aria-describedby="phoneError ? 'phone-error' : undefined"
                  :aria-invalid="phoneError ? 'true' : 'false'"
                  required
                  @blur="validateField('phone')"
                ></v-text-field>
                <div
                  v-if="phoneError"
                  id="phone-error"
                  class="v-messages v-messages--active"
                  role="alert"
                  aria-live="polite"
                >
                  <div
                    class="v-messages__message"
                    style="color: rgb(176, 0, 32)"
                  >
                    {{ phoneError }}
                  </div>
                </div>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="message"
                  clearable
                  clear-icon="mdi-close-circle"
                  label="Message (Required)"
                  :disabled="successfullySubmitted"
                  :rules="messageRules"
                  auto-grow
                  :aria-label="`Message. Required field. ${messageError ? 'Error: ' + messageError : ''}`"
                  :aria-describedby="messageError ? 'message-error' : undefined"
                  :aria-invalid="messageError ? 'true' : 'false'"
                  required
                  @blur="validateField('message')"
                ></v-textarea>
                <div
                  v-if="messageError"
                  id="message-error"
                  class="v-messages v-messages--active"
                  role="alert"
                  aria-live="polite"
                >
                  <div
                    class="v-messages__message"
                    style="color: rgb(176, 0, 32)"
                  >
                    {{ messageError }}
                  </div>
                </div>
              </v-col>
            </v-row>

            <div class="text-center mt-5" v-if="!successfullySubmitted">
              <v-btn
                @click="submitForm"
                :disabled="!valid || isSubmitting"
                :aria-label="
                  isSubmitting
                    ? 'Submitting form, please wait'
                    : 'Submit contact form'
                "
              >
                {{ isSubmitting ? "Submitting..." : "Submit" }} </v-btn
              >&nbsp;&nbsp;&nbsp;

              <v-btn
                @click="clearForm"
                variant="outlined"
                :disabled="isSubmitting"
                aria-label="Clear all form fields"
              >
                Clear
              </v-btn>
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

<style scoped>
/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

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
    isSubmitting: false,
    firstname: "",
    lastname: "",
    subject: "",
    subjects: ["R3 NOFO Questions", "R3 General Questions"],
    phone: "",
    message: "",
    myForm: {},
    // Individual field error tracking for accessibility
    subjectError: "",
    firstnameError: "",
    lastnameError: "",
    emailError: "",
    phoneError: "",
    messageError: "",
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
  computed: {
    /**
     * Form status message for screen readers
     * @returns {string} Current form status for accessibility announcements
     */
    formStatusMessage() {
      if (this.isSubmitting) {
        return "Form is being submitted, please wait.";
      }
      if (this.successfullySubmitted) {
        return "Form submitted successfully!";
      }
      const errorCount = [
        this.subjectError,
        this.firstnameError,
        this.lastnameError,
        this.emailError,
        this.phoneError,
        this.messageError,
      ].filter((error) => error).length;
      if (errorCount > 0) {
        return `Form has ${errorCount} error${errorCount > 1 ? "s" : ""} that need to be corrected.`;
      }
      return "";
    },
  },
  methods: {
    /**
     * Validate individual form field and set error message
     * @param {string} fieldName - Name of the field to validate
     */
    validateField(fieldName) {
      switch (fieldName) {
        case "subject":
          this.subjectError =
            this.subjectRules.find((rule) => rule(this.subject) !== true)?.(
              this.subject
            ) || "";
          break;
        case "firstname":
          this.firstnameError =
            this.nameRules.find((rule) => rule(this.firstname) !== true)?.(
              this.firstname
            ) || "";
          break;
        case "lastname":
          this.lastnameError =
            this.nameRules.find((rule) => rule(this.lastname) !== true)?.(
              this.lastname
            ) || "";
          break;
        case "email":
          this.emailError =
            this.emailRules.find((rule) => rule(this.email) !== true)?.(
              this.email
            ) || "";
          break;
        case "phone":
          this.phoneError =
            this.phoneRules.find((rule) => rule(this.phone) !== true)?.(
              this.phone
            ) || "";
          break;
        case "message":
          this.messageError =
            this.messageRules.find((rule) => rule(this.message) !== true)?.(
              this.message
            ) || "";
          break;
      }
    },

    /**
     * Validate all form fields
     */
    validateAllFields() {
      this.validateField("subject");
      this.validateField("firstname");
      this.validateField("lastname");
      this.validateField("email");
      this.validateField("phone");
      this.validateField("message");
    },
    /**
     * Submit the form asynchronously.
     *
     * @return {Promise<void>} A promise that resolves when the form is submitted.
     */
    async submitForm() {
      this.isSubmitting = true;
      this.validateAllFields();
      this.$refs.form.validate();

      // Check if there are any validation errors
      const hasErrors = [
        this.subjectError,
        this.firstnameError,
        this.lastnameError,
        this.emailError,
        this.phoneError,
        this.messageError,
      ].some((error) => error);

      if (hasErrors) {
        this.isSubmitting = false;
        // Focus on first error field for accessibility
        this.$nextTick(() => {
          const firstErrorField = document.querySelector(
            '[aria-invalid="true"]'
          );
          if (firstErrorField) {
            firstErrorField.focus();
          }
        });
        return;
      }

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
        // let targetURL = "https://mail.icjia.cloud/test";
        let targetURL;
        if (this.subject === "R3 General Questions") {
          targetURL = "https://mail.icjia.cloud/internet/r3-nofo";
          console.log(
            'targetURL = "https://mail.icjia.cloud/internet/r3-nofo"'
          );
        } else {
          targetURL = "https://mail.icjia.cloud/internet/r3-nofo";
          console.log(
            'targetURL = "https://mail.icjia.cloud/internet/r3-nofo"'
          );
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
        this.isSubmitting = false;

        console.log("submitForm ", this.valid);
      } else {
        this.isSubmitting = false;
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
      this.isSubmitting = false;

      // Clear all error messages
      this.subjectError = "";
      this.firstnameError = "";
      this.lastnameError = "";
      this.emailError = "";
      this.phoneError = "";
      this.messageError = "";

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
