export function concatValues(
  strings: TemplateStringsArray,
  ...values: unknown[]
) {
  return strings.map((str, i) => str + (values[i] ?? '')).join('');
}
