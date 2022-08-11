export default function debounce(cb, delay) {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      cb(...args);
      timer = null;
    }, delay);
  };
}