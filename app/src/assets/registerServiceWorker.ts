import { isPlatform } from '@ionic/vue';
import { registerSW } from 'virtual:pwa-register';
if (isPlatform('capacitor')) {
  console.log('Capacitor - native wrapped webview');
} else {
  console.log('Webapp/PWA - standalone browser');
  if (
    'serviceWorker' in navigator &&
    import.meta.env.PROD &&
    !('Cypress' in window)
  ) {
    (window as Window).addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(() => {
        console.log('Service Worker registered');
      });
    });

    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        console.log('SW - Need refresh');
      },
      onOfflineReady() {
        console.log('SW - Offline ready -> reload');
        window.location.reload();
      },
      onRegisteredSW(swScriptUrl, registration) {
        console.log('SW - registered');
        registration
          ?.update()
          .then((val) => console.log('updated: ', val))
          .catch((error) => console.log('update error: ', error));
      },
      onRegisterError(error) {
        console.log('Service Worker registration failed');
        console.log(error);
      },
    });
    updateSW(true)
      .then((val) => console.log('updateSW: ', val))
      .catch((error) => console.log('updateSW error: ', error));
  }
}
