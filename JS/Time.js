

function assignTime(){
  const timeHandle = document.querySelector("#time > h1");

  let start = new Date("February 2, 2018 07:18:00").getTime();
  let current = Date.now();

  let timeLeft = current - start;

  let years = Math.floor(timeLeft / (3.1536*10**10)).toString().padStart(2, '0');
  timeLeft = timeLeft % (3.1536*10**10);

  let months = Math.floor(timeLeft / (2.592*10**9)).toString().padStart(2, '0');
  timeLeft = timeLeft % (2.592*10**9);

  let days = Math.floor(timeLeft / 86400000).toString().padStart(2, '0');
  timeLeft = timeLeft % 86400000

  let hours = Math.floor(timeLeft / 3600000).toString().padStart(2, '0');
  timeLeft = timeLeft % 3600000;

  let mins = Math.floor(timeLeft / 60000).toString().padStart(2, '0');
  timeLeft = timeLeft % 60000;

  let seconds = Math.floor(timeLeft / 1000).toString().padStart(2, '0');

  let timeOutput = years + ":" + months + ":" + days + ":" + hours + ":" + mins + ":" + seconds;

  timeHandle.innerHTML = timeOutput;

  setTimeout(assignTime, 1000);
}