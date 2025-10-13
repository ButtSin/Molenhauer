function psKeydownHandler(event) {
  if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
    return;
  }

  event.preventDefault();

  const step = 100;

  const isVerticalScroll = event.key === 'ArrowUp' || event.key === 'ArrowDown';

  if (isVerticalScroll) {
    event.currentTarget.scrollTop += event.key === 'ArrowDown' ? step : -step;
  }
}

export default psKeydownHandler;
