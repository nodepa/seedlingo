export default function getSpacing(itemCount: number, index: number): string {
  if (itemCount > 1) {
    if (index === 0) {
      return 'margin-right: -0.75rem';
    }
    if (index === itemCount - 1) {
      return 'margin-left: -0.75rem';
    }
    return 'margin-right: -0.75rem;margin-left: -0.75rem';
  }
  return '';
}
