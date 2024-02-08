<template>
  <div>
    <v-container
      ><v-row
        ><v-col cols="12">
          <h2 id="project-overview">PROJECT OVERVIEW</h2>
          <p>Create a production-ready, fullstack blog application.</p>
          <p>
            The goal is to use as many tools in the ICJIA's current webstack as
            possible.
          </p>
          <h2 id="requirements">REQUIREMENTS</h2>
          <p>
            The blog will consist of at least three pages: a home page, an about
            page, and a blog display page. Additional pages are fine but not
            necessary.
          </p>
          <p>The primary tools used for this project include:</p>
          <pre><code class="hljs">- Vue 3.x
- Nuxt 3.x
- Vuetify 3.x
- Strapi 4.x
- Node 18.x 
</code></pre>
          <p>
            Your front-end Nuxt installation should include the following Nuxt
            modules:
          </p>
          <pre><code class="hljs">- @nuxt/content
- @nuxtjs/google-fonts
</code></pre>
          <p>
            A backend Strapi installation should include the following Strapi
            plugins:
          </p>
          <ul>
            <li>
              GraphQL (<a href="https://docs.strapi.io/dev-docs/plugins/graphql"
                >https://docs.strapi.io/dev-docs/plugins/graphql</a
              >)
            </li>
            <li>
              Netlify Deployments (<a
                href="https://market.strapi.io/plugins/strapi-plugin-netlify-deployments"
                >https://market.strapi.io/plugins/strapi-plugin-netlify-deployments</a
              >)
            </li>
          </ul>
          <p>
            Additional dependencies or tools may be added as required, such as
            Axios, Moment, or LoDash.
          </p>
          <h2 id="timeline">TIMELINE</h2>
          <p><strong>Week 1:</strong></p>
          <ul>
            <li>
              <p>
                Create a new project using <code>Nuxt's CLI</code> on your local
                machine.
              </p>
            </li>
            <li>
              <p>
                Install and configure <code>Vuetify 3.x</code> with
                <code>Nuxt</code>.
              </p>
            </li>
            <li>
              <p>
                Install material design icon fonts. (See
                <code>Vuetify</code> for more information and directions for
                install.)
              </p>
            </li>
            <li>
              <p>
                Create two basic routes: a <strong>Home</strong> page and an
                <strong>About</strong> page.
              </p>
            </li>
            <li>
              <p>
                Both the home and about pages should include placeholder content
                rendered and displayed by the Nuxt content module.
              </p>
              <ul>
                <li>
                  <p>
                    For this first week, the placeholder content can be
                    anything.
                  </p>
                </li>
                <li>
                  <p>
                    Feel free to use a lorum ipsum generator for sample text
                  </p>
                  <ul>
                    <li>
                      <a href="https://jaspervdj.be/lorem-markdownum/"
                        >https://jaspervdj.be/lorem-markdownum/</a
                      >
                    </li>
                    <li>
                      <a href="https://loremipsum.io/"
                        >https://loremipsum.io/</a
                      >
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <p>
                Sign up for a free account at Netlify:
                <a href="https://www.netlify.com/">https://www.netlify.com/</a>
              </p>
            </li>
            <li>
              <p>Create a Git repo.</p>
            </li>
            <li>
              <p>Push the initial project to Git.</p>
            </li>
            <li>
              <p>Connect Netlify to your GitHub account.</p>
            </li>
            <li>
              <p>Deploy the sample project (Netlify will generate URL).</p>
            </li>
          </ul>
          <p><strong>Week 2:</strong></p>
          <ul>
            <li>
              <p>Create at least five blog entries in markdown.</p>
            </li>
            <li>
              <p>Insert blog entries into /content/ folder.</p>
              <ul>
                <li>
                  Your project's <code>content</code> folder should be
                  structured as follows:
                </li>
              </ul>
            </li>
          </ul>
          <pre><code class="hljs"><span class="hljs-attribute">content</span>/
 	index<span class="hljs-selector-class">.md</span>
 	posts/
	  blog-entry-<span class="hljs-number">1</span><span class="hljs-selector-class">.md</span>
	  blog-entry-<span class="hljs-number">2</span><span class="hljs-selector-class">.md</span>
	  blog-entry-<span class="hljs-number">3</span><span class="hljs-selector-class">.md</span>
	  blog-entry-<span class="hljs-number">4</span><span class="hljs-selector-class">.md</span>
	  blog-entry-<span class="hljs-number">5</span><span class="hljs-selector-class">.md</span>
</code></pre>
        </v-col></v-row
      ></v-container
    >
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
