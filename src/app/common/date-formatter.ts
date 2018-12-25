export function dateFormat(date : Date, options: any = {}) {

  const now = new Date();

  const month = date.toLocaleString('en-us', { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();

  const nowMonth = now.toLocaleString('en-us', { month: "short" });
  const nowDay = now.getDate();
  const nowYear = now.getFullYear();

  let hours = date.getHours().toString();
  let minutes = date.getMinutes().toString();

  // Zero padding
  hours = ('0' + hours).slice(-2);
  minutes = ('0' + minutes).slice(-2);

  let mdy;
  let hm;

  // mdy = (year === nowYear && day === nowDay && month === nowMonth) ? 'Today' : `${month} ${day}, ${year}`;
  mdy = `${month} ${day}, ${year}`;
  hm = `${hours}:${minutes}`;

  let formatted;

  if (options.dateOnly) {
    formatted = `${mdy}`
  } else {
    formatted = `${mdy} at ${hm}`

  }


  return formatted;

}
