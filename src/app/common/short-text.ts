export function shortText(text: string, maxChar: number) {

  if(text.length > maxChar) {
    text = text.slice(0,maxChar) + '...';
  }

  return text;

}
