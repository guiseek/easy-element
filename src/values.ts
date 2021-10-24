export function concatValues(
  strings: TemplateStringsArray,
  ...values: unknown[]
) {
  console.log(strings, values);
  
  return strings.map((str, i) => str + (values[i] ?? '')).join('');
}
