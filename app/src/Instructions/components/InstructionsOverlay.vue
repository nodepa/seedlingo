<template>
  <div data-test="instructions-overlay" class="instructions-overlay" />
</template>

<style>
.instructions-overlay {
  pointer-events: none;
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 110;
  opacity: 0.3;
  background-color: var(--ion-color-medium-contrast);
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(var(--ion-background-color-rgb), 0.1),
    rgba(var(--ion-background-color-rgb), 0.1) 15px,
    transparent 15px,
    transparent 30px
  );
}
.pop-through:not(ion-button) {
  z-index: 120 !important;
  cursor: pointer;
}
ion-button.pop-through::part(native) {
  z-index: 120 !important;
}
ion-button::part(native) {
  overflow: visible;
}
</style>
