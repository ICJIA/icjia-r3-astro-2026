<!-- astro/src/components/ContactForm.vue -->
<!--
  Contact form island — port of the Nuxt-era pages/contact.vue, with Vuetify
  removed (plain HTML inputs + Vue 3 reactivity, matching the Search/Dialog
  island pattern).

  On submit it POSTs to the same two endpoints the live site uses:
    1. https://r3.icjia-api.cloud/api/forms        (R3 database)
    2. https://mail.icjia.cloud/internet/r3-nofo   (email relay)
  Both are allow-listed in netlify.toml `connect-src`. Endpoint failures are
  swallowed — the live form shows success once submitted regardless, so this
  reproduces that behaviour. Inputs are DOMPurify-sanitised before sending.

  Mounted `client:load` from contact.astro.
-->
<template>
  <div class="contact-form-wrap">
    <!-- Screen-reader status announcements -->
    <div aria-live="polite" aria-atomic="true" class="sr-only">{{ statusMessage }}</div>

    <form v-if="!submitted" class="contact-form" novalidate @submit.prevent="onSubmit">
      <div class="contact-form__row">
        <div class="contact-form__field">
          <label for="contact-firstname" class="contact-form__label">
            First Name <span class="contact-form__req" aria-hidden="true">*</span>
            <span class="sr-only">(Required)</span>
          </label>
          <input
            id="contact-firstname"
            v-model="firstname"
            type="text"
            name="firstname"
            placeholder="Enter your first name"
            autocomplete="given-name"
            :disabled="submitting"
            :aria-invalid="errors.firstname ? 'true' : 'false'"
            :aria-describedby="errors.firstname ? 'contact-firstname-error' : undefined"
            @blur="validate('firstname')"
          />
          <p v-if="errors.firstname" id="contact-firstname-error" class="contact-form__error" role="alert">
            {{ errors.firstname }}
          </p>
        </div>

        <div class="contact-form__field">
          <label for="contact-lastname" class="contact-form__label">
            Last Name <span class="contact-form__req" aria-hidden="true">*</span>
            <span class="sr-only">(Required)</span>
          </label>
          <input
            id="contact-lastname"
            v-model="lastname"
            type="text"
            name="lastname"
            placeholder="Enter your last name"
            autocomplete="family-name"
            :disabled="submitting"
            :aria-invalid="errors.lastname ? 'true' : 'false'"
            :aria-describedby="errors.lastname ? 'contact-lastname-error' : undefined"
            @blur="validate('lastname')"
          />
          <p v-if="errors.lastname" id="contact-lastname-error" class="contact-form__error" role="alert">
            {{ errors.lastname }}
          </p>
        </div>
      </div>

      <div class="contact-form__row">
        <div class="contact-form__field">
          <label for="contact-email" class="contact-form__label">
            Email <span class="contact-form__req" aria-hidden="true">*</span>
            <span class="sr-only">(Required)</span>
          </label>
          <input
            id="contact-email"
            v-model="email"
            type="email"
            name="email"
            placeholder="Enter your email address"
            autocomplete="email"
            :disabled="submitting"
            :aria-invalid="errors.email ? 'true' : 'false'"
            :aria-describedby="errors.email ? 'contact-email-error' : undefined"
            @blur="validate('email')"
          />
          <p v-if="errors.email" id="contact-email-error" class="contact-form__error" role="alert">
            {{ errors.email }}
          </p>
        </div>

        <div class="contact-form__field">
          <label for="contact-phone" class="contact-form__label">
            Phone Number <span class="contact-form__req" aria-hidden="true">*</span>
            <span class="sr-only">(Required)</span>
          </label>
          <input
            id="contact-phone"
            v-model="phone"
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            autocomplete="tel"
            :disabled="submitting"
            :aria-invalid="errors.phone ? 'true' : 'false'"
            :aria-describedby="errors.phone ? 'contact-phone-error' : undefined"
            @blur="validate('phone')"
          />
          <p v-if="errors.phone" id="contact-phone-error" class="contact-form__error" role="alert">
            {{ errors.phone }}
          </p>
        </div>
      </div>

      <div class="contact-form__field">
        <label for="contact-message" class="contact-form__label">
          Message <span class="contact-form__req" aria-hidden="true">*</span>
          <span class="sr-only">(Required)</span>
        </label>
        <textarea
          id="contact-message"
          v-model="message"
          name="message"
          rows="5"
          placeholder="Enter your message"
          :disabled="submitting"
          :aria-invalid="errors.message ? 'true' : 'false'"
          :aria-describedby="errors.message ? 'contact-message-error' : undefined"
          @blur="validate('message')"
        ></textarea>
        <p v-if="errors.message" id="contact-message-error" class="contact-form__error" role="alert">
          {{ errors.message }}
        </p>
      </div>

      <div class="contact-form__actions">
        <button type="submit" class="contact-form__submit" :disabled="submitting" :aria-busy="submitting">
          {{ submitting ? 'Submitting…' : 'Submit' }}
        </button>
        <button type="button" class="contact-form__clear" :disabled="submitting" @click="clearForm">
          Clear
        </button>
      </div>
    </form>

    <div v-else class="contact-form__success" role="status">
      <p class="contact-form__success-msg">Your form was successfully submitted!</p>
      <p class="contact-form__success-home">
        <a href="/" class="contact-form__home-link">&laquo;&nbsp;Back to home</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue';
import DOMPurify from 'dompurify';

type Field = 'firstname' | 'lastname' | 'email' | 'phone' | 'message';

const firstname = ref('');
const lastname = ref('');
const email = ref('');
const phone = ref('');
const message = ref('');

const values: Record<Field, () => string> = {
  firstname: () => firstname.value,
  lastname: () => lastname.value,
  email: () => email.value,
  phone: () => phone.value,
  message: () => message.value,
};

const errors = reactive<Record<Field, string>>({
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  message: '',
});

const submitting = ref(false);
const submitted = ref(false);

// Email pattern carried over verbatim from pages/contact.vue.
const EMAIL_RE =
  /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function validate(field: Field): void {
  const v = values[field]().trim();
  switch (field) {
    case 'firstname':
    case 'lastname':
      errors[field] = !v
        ? 'Name is required'
        : v.length > 100
          ? 'Name must be less than 100 characters'
          : '';
      break;
    case 'email':
      errors.email = !v ? 'E-mail is required' : !EMAIL_RE.test(v) ? 'E-mail must be valid' : '';
      break;
    case 'phone':
      errors.phone = !v ? 'Contact phone number is required' : '';
      break;
    case 'message':
      errors.message = !v ? 'A message is required' : '';
      break;
  }
}

function validateAll(): boolean {
  (Object.keys(values) as Field[]).forEach(validate);
  return !Object.values(errors).some(Boolean);
}

const statusMessage = computed(() => {
  if (submitting.value) return 'Form is being submitted, please wait.';
  if (submitted.value) return 'Form submitted successfully!';
  const n = Object.values(errors).filter(Boolean).length;
  return n > 0 ? `Form has ${n} error${n > 1 ? 's' : ''} that need to be corrected.` : '';
});

const clean = (s: string): string =>
  DOMPurify.sanitize(s).replace(/(<([^>]+)>)/gi, '').trim();

async function onSubmit(): Promise<void> {
  submitting.value = true;

  if (!validateAll()) {
    submitting.value = false;
    await nextTick();
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return;
  }

  const form = {
    type: 'R3 Contact Form',
    subject: 'R3 Question',
    firstname: clean(firstname.value),
    lastname: clean(lastname.value),
    email: clean(email.value),
    phone: clean(phone.value),
    message: clean(message.value),
  };

  // 1. Insert into the R3 database (same endpoint + shape as the live form).
  try {
    await fetch('https://r3.icjia-api.cloud/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: { type: form.type, email: form.email, subject: form.subject, form },
      }),
    });
  } catch {
    /* swallowed — the live form proceeds to "success" regardless */
  }

  // 2. Send the notification email (same endpoint + shape as the live form).
  try {
    await fetch('https://mail.icjia.cloud/internet/r3-nofo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
  } catch {
    /* swallowed — matches the live form's behaviour */
  }

  submitted.value = true;
  submitting.value = false;
}

function clearForm(): void {
  firstname.value = '';
  lastname.value = '';
  email.value = '';
  phone.value = '';
  message.value = '';
  (Object.keys(errors) as Field[]).forEach((k) => {
    errors[k] = '';
  });
  submitting.value = false;
}
</script>

<style scoped>
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

.contact-form {
  max-width: 880px;
  margin: 0 auto;
}

.contact-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.5rem;
}
@media (max-width: 768px) {
  .contact-form__row {
    grid-template-columns: 1fr;
  }
}

.contact-form__field {
  margin-bottom: 1rem;
}

.contact-form__label {
  display: block;
  margin-bottom: 4px;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #111111;
  line-height: 1.4;
}

.contact-form__req {
  color: #9b0000;
  font-weight: 700;
  margin-left: 2px;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  box-sizing: border-box;
  min-height: 44px;
  padding: 10px 12px;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  color: #111111;
  background: #ffffff;
  border: 1px solid #555555;
  border-radius: 4px;
}
.contact-form textarea {
  resize: vertical;
  line-height: 1.5;
}

.contact-form input::placeholder,
.contact-form textarea::placeholder {
  color: #333333;
  opacity: 1;
}

.contact-form input:focus-visible,
.contact-form textarea:focus-visible {
  outline: 3px solid #0d4474;
  outline-offset: 1px;
  border-color: #0d4474;
}

.contact-form input[aria-invalid='true'],
.contact-form textarea[aria-invalid='true'] {
  border-color: #9b0000;
}

.contact-form__error {
  margin: 4px 0 0;
  color: #9b0000;
  font-size: 14px;
  font-weight: 600;
}

.contact-form__actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.contact-form__submit,
.contact-form__clear {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
  font-family: Roboto, sans-serif;
  font-weight: 700;
  font-size: 15px;
  border-radius: 4px;
  cursor: pointer;
}

.contact-form__submit {
  background: #0d4474;
  color: #ffffff;
  border: 1px solid #0d4474;
}
.contact-form__submit:hover:not(:disabled) {
  background: #062a47;
}
.contact-form__clear {
  background: #ffffff;
  color: #0d4474;
  border: 1px solid #0d4474;
}
.contact-form__clear:hover:not(:disabled) {
  background: rgba(13, 68, 116, 0.08);
}
.contact-form__submit:disabled,
.contact-form__clear:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.contact-form__submit:focus-visible,
.contact-form__clear:focus-visible {
  outline: 3px solid #0d4474;
  outline-offset: 2px;
}

.contact-form__success {
  text-align: center;
  margin: 2rem 0;
}
.contact-form__success-msg {
  color: #1a7a1a;
  font-weight: 900;
  font-size: 1.1rem;
}
.contact-form__success-home {
  margin-top: 0.5rem;
}
.contact-form__home-link {
  color: #0d4474;
  font-weight: 700;
}
</style>
