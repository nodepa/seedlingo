import{_ as i,c,a as s,b as o,d as t,e as r,f as a,r as d,o as p}from"./app-C4nCE3Qw.js";const l={};function u(h,e){const n=d("RouteLink");return p(),c("div",null,[e[5]||(e[5]=s('<h1 id="architecture" tabindex="-1"><a class="header-anchor" href="#architecture"><span>Architecture</span></a></h1><p>Seedlingo is built using the <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer">VueJS</a> web framework to build a client-side single page application (SPA) with progressive web app (PWA) functionality. The web app is then wrapped using <a href="https://ionicframework.com" target="_blank" rel="noopener noreferrer">Ionic Framework</a> and <a href="https://capacitorjs.com" target="_blank" rel="noopener noreferrer">Capacitor</a> to create a native Android app presenting Seedlingo fully offline in a WebView.</p><p>The main code entrypoint for Seedlingo is src/main.ts.</p><h2 id="src-main-ts" tabindex="-1"><a class="header-anchor" href="#src-main-ts"><span>src/main.ts</span></a></h2><p>Standard VueJS setup- and entrypoint.</p><p>Mounts App.vue inside the public/index.html&#39;s <code>&lt;div id=&quot;app&quot; /&gt;</code> with <code>app.mount(&#39;#app&#39;)</code>.</p><h2 id="src-app-vue" tabindex="-1"><a class="header-anchor" href="#src-app-vue"><span>src/App.vue</span></a></h2><p>Lays out the <code>AppHeader</code> section with logo and title, <code>BottomNavigationBar</code> in the footer containing <code>HomeButton</code>, <code>ContinueButton</code> and <code>ToggleInstructionsButton</code>, and an <code>ion-content</code> section that is handled by the router (<code>ion-router-outlet</code>). src/common/router/index.ts lists all routes and defines src/views/HomeView.vue as the base route.</p><h2 id="src-views-homeview-vue" tabindex="-1"><a class="header-anchor" href="#src-views-homeview-vue"><span>src/views/HomeView.vue</span></a></h2><p>Displays src/UnitsMenu/components/UnitsMenu.vue and src/FooterLinks/components/FooterLinks.vue</p><h2 id="src-unitsmenu-components-unitsmenu-vue" tabindex="-1"><a class="header-anchor" href="#src-unitsmenu-components-unitsmenu-vue"><span>src/UnitsMenu/components/UnitsMenu.vue</span></a></h2><p>Lists all the units as specified in the content folder using <code>Content.UnitsMeta</code>, which returns an array of objects with name, icon and audio for each unit. Each unit is wired with a <code>router-link</code> of the pattern <code>/unit/:id</code>, e.g. /unit/4 directs links of that pattern to src/views/ExerciseSession.vue</p><h2 id="src-views-exercisesession-vue" tabindex="-1"><a class="header-anchor" href="#src-views-exercisesession-vue"><span>src/views/ExerciseSession.vue</span></a></h2><p><code>ExerciseSession</code> presents one of the exercise components MatchingExercise.vue, MultipleChoiceExercise.vue, ClozeExercise.vue or ComprehensionExercise.vue based on the <code>exercise</code>/<code>exerciseItems</code> generated by src/Units/ExerciseProvider.ts. When <code>ExerciseSession</code> is made available in the page/mounted, <code>getExercise()</code> is used to identify the correct unit specified by the <code>/unit/:id</code> route param in the browser&#39;s address bar. The number from the path is taken to represent the current unit number, and <code>ExerciseProvider.getExerciseFromUnit(index)</code> is asked to generate an exercise from that unit.</p><h2 id="src-content-exerciseprovider-ts" tabindex="-1"><a class="header-anchor" href="#src-content-exerciseprovider-ts"><span>src/Content/ExerciseProvider.ts</span></a></h2><p><code>getExerciseFromUnit(index)</code> uses <code>Content.UnitSpec</code> to get all units and verify that the requested unit exists, then generates an exercise of random type from the unit using <code>GenerateExerciseOfType[ExerciseType].bind(this)(unit)</code> (where ExerciseType is randomly picked from types available in the unit), which executes the relevant <code>generate[Matching|MultipleChoice|ExplanationMatching|ExplanationMultipleChoice|SingleCloze|MultiCloze|Comprehension]Exercise(unit)</code>. I.e. for <code>generateMultipleChoiceExercise</code>, a random exercise specification from the unit is selected, then 4 random word references from that exercise are selected, then the actual word specifications referenced are fetched, before <code>createMultipleChoiceExerciseFromWords(selectedWords)</code> is called, generating four presentable word-objects from the four words. Then one of the four words are selected randomly to be the correct option and the exercise object is expanded to account for that. The correct option&#39;s symbol(i.e. icon) is fetched from the passed in unit data and stored for display as <code>iconToMatch</code>. The <code>exercise</code> object is returned to <code>ExerciseSession</code>, and <code>ExerciseSession</code> sets its dynamic component according to the exercise type from <code>ExerciseProvider</code>, and passes the exercise object along to e.g. <code>MultipleChoiceExercise.vue</code> as a prop (<code>exercise-prop</code>).</p><h2 id="src-multiplechoice-components-multiplechoiceexercise-vue" tabindex="-1"><a class="header-anchor" href="#src-multiplechoice-components-multiplechoiceexercise-vue"><span>src/MultipleChoice/components/MultipleChoiceExercise.vue</span></a></h2><p><code>MultipleChoiceSession</code> takes the <code>exerciseProp</code> and wires up the correct option&#39;s audio to auto-play on page-load (<code>onMounted)</code> or re-load (through <code>watch()</code>). In the <code>&lt;template&gt;</code>, the first <code>&lt;ion-row&gt;</code> contains an <code>ExerciseButton</code> (custom <code>ion-button</code>) that displays the correct option&#39;s icon using an <code>&lt;ion-icon&gt;</code> element. The second <code>&lt;ion-row&gt;</code> displays (by text) the 4 words that may match the icon and pronunciation of the audio.</p><h2 id="src-content-content-ts" tabindex="-1"><a class="header-anchor" href="#src-content-content-ts"><span>src/Content/Content.ts</span></a></h2><p>Content starts off by importing some content related data types, icons wrapped in javascript, then all the .mp3.audio files in the content folder, then all the .json files in the content folder.</p><p><code>Content.ContentSpec</code> holds ContentSpec.json extracted from the collection of imported .json-files.</p><p><code>Content.WordListSpec</code> holds the <code>wordSpecFile</code> specified in ContentSpec.json.</p><p><code>Content.getWord()</code> fetches one specified word object from the <code>wordListSpec</code>.</p><p><code>Content.UnitsMeta</code> holds a generated collection of objects necessary to populate the home page menu of units, and also used for basic review of all new words in a unit.</p><p><code>Content.UnitSpecs</code> extracts all the .json-files specified as <code>unitSpecFile</code> in ContentSpec.json.</p><p><code>Content.getAudioPath()</code> returns an audio object that can be inlined in the html as an audio element&#39;s src. A specific audio file&#39;s data is extracted from the collection of &#39;.mp3.audio&#39; files imported earlier.</p><h2 id="content-contentspec-json" tabindex="-1"><a class="header-anchor" href="#content-contentspec-json"><span>content/ContentSpec.json</span></a></h2>',27)),o("p",null,[e[1]||(e[1]=t("The content is configured through the content-folder's ContentSpec.json. A full specification is found in the ")),r(n,{to:"/content/content-spec.html"},{default:a(()=>e[0]||(e[0]=[t("content specification")])),_:1}),e[2]||(e[2]=t(". Basically, ContentSpec.json specifies where to find the top-level instructions audio files, all the unit specification files, and the word specification file. The content/Unit??.json files contain specifications of units as collections of exercises. Data file sources (audio, pictures) are generally specified in the ")),e[3]||(e[3]=o("code",null,"wordSpecFile",-1)),e[4]||(e[4]=t(", but explanation exercises also specify audio/picture/video/symbol for the explanation itself."))])])}const f=i(l,[["render",u],["__file","architecture.html.vue"]]),v=JSON.parse('{"path":"/architecture/architecture.html","title":"Architecture","lang":"en-US","frontmatter":{"description":"Architecture Seedlingo is built using the VueJS web framework to build a client-side single page application (SPA) with progressive web app (PWA) functionality. The web app is t...","head":[["meta",{"property":"og:url","content":"https://seedlingo.com/architecture/architecture.html"}],["meta",{"property":"og:site_name","content":"Seedlingo"}],["meta",{"property":"og:title","content":"Architecture"}],["meta",{"property":"og:description","content":"Architecture Seedlingo is built using the VueJS web framework to build a client-side single page application (SPA) with progressive web app (PWA) functionality. The web app is t..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-04-15T12:36:07.000Z"}],["meta",{"property":"article:modified_time","content":"2024-04-15T12:36:07.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Architecture\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-04-15T12:36:07.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":2,"title":"src/main.ts","slug":"src-main-ts","link":"#src-main-ts","children":[]},{"level":2,"title":"src/App.vue","slug":"src-app-vue","link":"#src-app-vue","children":[]},{"level":2,"title":"src/views/HomeView.vue","slug":"src-views-homeview-vue","link":"#src-views-homeview-vue","children":[]},{"level":2,"title":"src/UnitsMenu/components/UnitsMenu.vue","slug":"src-unitsmenu-components-unitsmenu-vue","link":"#src-unitsmenu-components-unitsmenu-vue","children":[]},{"level":2,"title":"src/views/ExerciseSession.vue","slug":"src-views-exercisesession-vue","link":"#src-views-exercisesession-vue","children":[]},{"level":2,"title":"src/Content/ExerciseProvider.ts","slug":"src-content-exerciseprovider-ts","link":"#src-content-exerciseprovider-ts","children":[]},{"level":2,"title":"src/MultipleChoice/components/MultipleChoiceExercise.vue","slug":"src-multiplechoice-components-multiplechoiceexercise-vue","link":"#src-multiplechoice-components-multiplechoiceexercise-vue","children":[]},{"level":2,"title":"src/Content/Content.ts","slug":"src-content-content-ts","link":"#src-content-content-ts","children":[]},{"level":2,"title":"content/ContentSpec.json","slug":"content-contentspec-json","link":"#content-contentspec-json","children":[]}],"git":{"updatedTime":1713184567000,"contributors":[{"name":"toshify","email":"4579559+toshify@users.noreply.github.com","commits":8}]},"filePathRelative":"architecture/architecture.md","autoDesc":true}');export{f as comp,v as data};
