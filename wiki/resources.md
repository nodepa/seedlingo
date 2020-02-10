# Front end

### PWA
* [A Gentle and Practical Introduction to PWA](https://www.telerik.com/blogs/a-gentle-and-practical-introduction-to-progressive-web-apps)
* [Google on PWA](https://developers.google.com/web/progressive-web-apps/)

### PWA with Framework
* React.js
  * [How to build a React PWA](https://blog.bitsrc.io/how-to-build-a-react-progressive-web-application-pwa-b5b897df2f0a)
* Vue.js
  * [Building PWAs with vue.js](https://www.telerik.com/blogs/building-pwas-with-vuejs) - Basic CLI setup and Auditing
  * [PWA, Vue, Webpack, Material Design](https://www.sicara.ai/blog/2017-04-25-progressive-web-application-with-vue-js-webpack-material-design) - complete minimalistic app 
  * [Creating your first Vue.js PWA project](https://medium.com/the-web-tub/creating-your-first-vue-js-pwa-project-22f7c552fb34)

### Mobile web app
* [W3C CSS Mobile](https://www.w3schools.com/w3css/w3css_mobile.asp)
* [Viewport units on mobile](https://css-tricks.com/the-trick-to-viewport-units-on-mobile/)
* [Responsibe Web Design Basics](https://developers.google.com/web/fundamentals/design-and-ux/responsive#responsive-web-design)
* [Using :focus](https://www.youtube.com/watch?v=Mvu5OMGcdVA&feature=youtu.be&utm_source=Iterable&utm_medium=email&utm_campaign=the_overflow_newsletter&utm_content=11-27-19)

### Speech-to-text
* [Web Speech Recognition](https://code-boxx.com/add-speech-recognition-website-javascript/)
* [Web Speech-to-Text Tutorial](https://tutorialzine.com/2017/08/converting-from-speech-to-text-with-javascript)
* [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
  * [Using the Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API) ✔️🆗
  * [SpeechGrammar](https://developer.mozilla.org/en-US/docs/Web/API/SpeechGrammar)
  * [SpeechGrammarList](https://developer.mozilla.org/en-US/docs/Web/API/SpeechGrammarList)
  * [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
  * [SpeechRecognitionAlternative](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionAlternative)
  * [SpeechRecognitionError](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionError)
  * [SpeechRecognitionErrorEvent](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionErrorEvent)
  * [SpeechRecognitionEvent](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionEvent)
  * [SpeechRecognitionResult](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionResult)
  * [SpeechRecognitionResultList](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionResultList)

### Text-to-speech
* [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
  * [Using the Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API) ✔️🆗
  * [SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
  * [SpeechSynthesisErrorEvent](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisErrorEvent)
  * [SpeechSynthesisEvent](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisEvent)
  * [SpeechSynthesisUtterance](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance)
  * [SpeechSynthesisVoice](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice)

### Other APIs
* [Mozilla WebAPI doc](https://developer.mozilla.org/en-US/docs/Web/API)
* [Touch Events API](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
* [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) - for keeping client data and state in sync
  * [Using Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)
  * [Understanding Service Workers](http://blog.88mph.io/2017/07/28/understanding-service-workers/)
  * [General Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
  * [Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
* [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) - for sending notifications to the user's phone (requires Service Worker)
  * [Push API Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices)
* [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) - for direct communication between app users
* [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) - for keeping locally synced storage of practice data
* [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - for interface audio cues/promps, possibly replay from storage?
  * [OfflineAudioContext](https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext) - for generating audio to an AudioBuffer for use in app
  * [AudioBuffer](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer) - for playing buffered audio cues.
* [HTML Drag And Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) - use as alternative interaction, never as primary
* [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API) - for fullscreening the app
* [Credentials API](https://developer.mozilla.org/en-US/docs/Web/API/Credential_Management_API) - federate login from Wechat?
* [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - for drawing characters etc. if CSS isn't working well enough.
* [Screen Orientation API](https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation) - for identifying screen rotation and potentially auto-rotate back to portrait mode if not possible to force rotation lock
* [Websocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) - for sockets-to-server comms.



# Back end
Serverless?
Containers?



# Infrastructure
Babel
SASS
Typescript?
Unit testing
E2E testing
CI/CD: Jenkins in containers?



# Native or web
* [Responseive web vs native apps](http://thinkapps.com/blog/development/responsive-web-vs-native-apps/)
* [The Process of Creating an App](http://thinkapps.com/blog/development/process-creating-app-explained/)



# Business
* [Lean Startup Principles](http://theleanstartup.com/principles)
