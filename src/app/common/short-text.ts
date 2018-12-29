export function shortText(text: string, maxChar: number) {

  if(text.length > maxChar) {
    text = text.slice(maxChar-1) + '...';
  }

  return text;

}
