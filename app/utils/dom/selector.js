export default (selectors, all = false) => (
  all
    ? document.querySelectorAll(selectors)
    : document.querySelector(selectors)
)
