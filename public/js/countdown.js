const secondsInAMinute = 60;
const secondsInAnHour = secondsInAMinute * 60;

/**
 * Get the date in terms of seconds.
 *
 * @param {Date} date 
 * @returns int
 */
const dateToSeconds = date => {
  return Number.parseInt((date.getTime() / 1000).toString());
}

const isAfter = (dateFrom, dateTo) => {
  return dateToSeconds(dateFrom) > dateToSeconds(dateTo);
}

const hoursUntil = (dateFrom, dateTo) => {
  if (isAfter(dateFrom, dateTo)) {
    return 0;
  }

  return Number.parseInt((dateToSeconds(dateTo) - dateToSeconds(dateFrom)) / secondsInAnHour);
};

const minutesUntil = (dateFrom, dateTo) => {
  if (isAfter(dateFrom, dateTo)) {
    return 0;
  }

  const diffInSeconds = dateToSeconds(dateTo) - dateToSeconds(dateFrom);
  return Number.parseInt((diffInSeconds % secondsInAnHour) / secondsInAMinute);
};

const secondsUntil = (dateFrom, dateTo) => {
  if (isAfter(dateFrom, dateTo)) {
    return 0;
  }

  return (dateToSeconds(dateTo) - dateToSeconds(dateFrom)) % secondsInAMinute;
};

const addHours = (date, hours) => {
  const newSeconds = dateToSeconds(date) + (secondsInAnHour * hours);
  return new Date(newSeconds * 1000);
};

const addMinutes = (date, minutes) => {
  const newSeconds = dateToSeconds(date) + (secondsInAMinute * minutes);
  return new Date(newSeconds * 1000);
};

const addSeconds = (date, seconds) => {
  const newSeconds = dateToSeconds(date) + seconds;
  return new Date(newSeconds * 1000);
};

const toInteger = number => {
  return Number.parseInt(number || 0).toFixed(0);
};

// Application logic starts here.
// Ideally, the above would be extracted to a helper file.

const renderCountdown = (dateFrom, dateTo, readyText) => {
  if (isAfter(dateFrom, dateTo) && !!readyText) {
    return readyText;
  }

  const hoursString = hoursUntil(dateFrom, dateTo).toString().padStart(2, '0');
  const minutesString = minutesUntil(dateFrom, dateTo).toString().padStart(2, '0');
  const secondsString = secondsUntil(dateFrom, dateTo).toString().padStart(2, '0');

  return `${ hoursString }:${ minutesString }:${ secondsString }`;
};

const handleCountdownSubmit = () => {
  stopCountdown();

  const form = document.querySelector('#the-controls>form');
    
  const hours = Math.max(toInteger(form.querySelector('[name="hours"]').value), 0);
  const minutes = Math.max(toInteger(form.querySelector('[name="minutes"]').value), 0);
  const seconds = Math.max(toInteger(form.querySelector('[name="seconds"]').value), 0);

  const readyText = form.querySelector('[name="ready-text"]').value;

  const params = new URLSearchParams({
    hours: Math.max(toInteger(form.querySelector('[name="hours"]').value), 0),
    minutes: Math.max(toInteger(form.querySelector('[name="minutes"]').value), 0),
    seconds: Math.max(toInteger(form.querySelector('[name="seconds"]').value), 0),
    "ready-text": form.querySelector('[name="ready-text"]').value,
  });

  // Set the URL params so that these persist on reloads.
  window.history.replaceState(
    {},
    '',
    window.location.origin +
      window.location.pathname +
      '?' +
      params.toString()
  );

  const dateTo = addSeconds(addMinutes(addHours(new Date(), hours), minutes), seconds);

  countdownInterval = setInterval(() => {
    const timeString = renderCountdown(
      new Date(),
      dateTo,
      readyText
    );

    document.querySelector('#the-timer>span').textContent = timeString;
  }, 100);
};

const initializeForm = () => {
  const params = new URLSearchParams(document.location.search);

  const form = document.querySelector('#the-controls>form');

  const hours = Math.max(toInteger(params.get('hours')), 0);
  const minutes = Math.max(toInteger(params.get('minutes')), 0);
  const seconds = Math.max(toInteger(params.get('seconds')), 0);

  const readyText = params.get('ready-text') || '';

  form.querySelector('[name="hours"]').value = hours;
  form.querySelector('[name="minutes"]').value = minutes;
  form.querySelector('[name="seconds"]').value = seconds;
  form.querySelector('[name="ready-text"]').value = readyText;
};

let countdownInterval;
const stopCountdown = () => {
  if (countdownInterval) {
    clearTimeout(countdownInterval);
  }
}

const bindFormHandlers = () => {
  const form = document.querySelector('#the-controls>form');
    
  // Begin the countdown listener.
  form.addEventListener('submit', event => {
    event.preventDefault();
    
    handleCountdownSubmit();
  });

  document.querySelector('#the-controls .visibility-toggle').addEventListener('click', () => {
    const controlContainer = document.querySelector('#the-controls');

    const visibilityClass = 'hide-until-hover';
    const formIsHidden = controlContainer.classList.contains(visibilityClass);
    if (formIsHidden) {
      controlContainer.classList.remove(visibilityClass);
      controlContainer.querySelector('.visibility-toggle').textContent = 'Show Always';
    } else {
      controlContainer.classList.add(visibilityClass);
      controlContainer.querySelector('.visibility-toggle').textContent = 'Hide Until Hover';
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  // Define the destination time.
  bindFormHandlers();

  initializeForm();
});

document