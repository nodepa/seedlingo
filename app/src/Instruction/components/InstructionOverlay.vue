<template>
  <div data-test="instruction-overlay" class="instruction-overlay" />
</template>

<style>
.instruction-overlay {
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 110;
  opacity: 0.5;
  background-color: var(--ion-text-color);
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(var(--ion-color-medium-rgb), 0.2),
    rgba(var(--ion-color-medium-rgb), 0.2) 15px,
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
</style>
