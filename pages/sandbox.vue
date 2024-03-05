<template>
  <div>
    <the-faq-bar
      @prev="updateCountIndex('prev')"
      @next="updateCountIndex('next')"
      @query="performMark"
      @clear="clear"
      :currentIndex="currentIndex"
      :results="results"
    ></the-faq-bar>

    <div class="context mt-12">
      Lorem markdownum dabitur bis in Iuppiter iamque sanguine non crura Themis.
      Cutem avidissima et aurea, multi sic Caencu volucris naturae retinacula
      pectus: ambit visa. Exitus in fatum nullaque; oris sacrum; est bracchia
      breve. Ore dividite forma. Quod induruit postes et aestuat fossa ore
      nostri agat: quae. Nec esse; polo sit, se et exanimi nutricisque parva
      excusantia erant memorare. Caelum velocius paterna. Haec saucius
      Inmunitamque aures quod casias illuc ille quid, tum ad easdem spumeus?
      Tristis spreta herbae: seniles donec. Caeli in amore suae pressos, quoque
      viro, non interque gurgite sacroque triceps ignifero Nepheleque clipeum
      moveri. Et hanc lucida. Attollens dependebat Acmona malis victricemque
      ponit defunctum require adspexit si trabes est torum dubiis hinc. Ulvae
      numina ultoris: et Caenis cornua omnis animosus me ille et cum petunt
      raptam. Haec quas ordine simul citharae falsam. Femina fronde Fecit
      traduxit ulterius ululavit umeris occupat, gratantibus proximus infelix
      devovitque deus. Videntur quo, magnum alios. Tenenti volvitur est abit
      rostrum stridore. Leto plura. Quod duram; ut dixit feretrumque exhibuit,
      manus rapto, Cererem. Peremptam porrexerat desint sepulcro Nioben ad
      accedere quamque, corporis dextris fervebat metu, pervenit, luce. Pars
      Titan ante suam; arator et in urbem: ossa ex tauri. Deos illa summa
      conplexaque requie tamen. Verbere dum his latrantis comites moenia mea
      nutricibus mihi Troiae. Donis Itys ubi adorat luna, proles, patuere;
      plangoris orbe latius. Dixit mortis; nivea dei odere sorores caput
      praerupit factum. Lustrabere opemque acuti Cepheaque; arserunt tum
      voluntas timido mersisque mihi.
    </div>
  </div>
</template>

<script setup>
import md from "markdown-it";
import attrs from "markdown-it-attrs";
const renderer = new md({
  html: true,
  xhtmlOut: false,
  breaks: false,
  langPrefix: "language-",
  linkify: true,
  typographer: true,
  quotes: "“”‘’",
}).use(attrs);
import _ from "lodash";

const query = ref("");
const results = ref([]);
const currentIndex = ref(0);
const isMounted = ref(false);

const options = {
  accuracy: "partially",
  separateWordSearch: false,
  acrossElements: true,
};

useHead({
  title: "Frequently Asked Questions",
  meta: [
    {
      hid: "description",
      name: "description",
      content: "R3 Frequently Asked Questions",
    },
  ],
});

const clear = () => {
  console.log("clear");
};
const prev = () => {
  console.log("prev");
};
const next = () => {
  console.log("next");
};
const performMark = (_query) => {
  query.value = _query;
  let markInstance = new Mark(document.querySelector(".context"));
  markInstance.unmark({
    done: function () {
      markInstance.mark(query.value, options);
      results.value = Array.from(document.querySelectorAll("[data-markjs]"));
      currentIndex.value = 0;
    },
  });
};

const updateCountIndex = (strBtn) => {
  console.log("button click: ", strBtn);
};
onMounted(async () => {
  await nextTick();
  await nextTick();
  isMounted.value = true;

  const el = document.getElementById("textfield");
  console.log("searchbar el: ", el);
  if (el) {
    el.focus();
  }
});
</script>

<style lang="scss">
.title-link:hover {
  color: #888 !important;
  text-decoration: none !important;
}

mark.current {
  background: orange !important;
}
.header {
  padding: 10px;
  width: 100%;
  background: #ddd;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
}

.fade-in-text {
  animation: fadeIn 2s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
