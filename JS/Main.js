

document.addEventListener('DOMContentLoaded', function() {
    goThroughTypingAnimation();
    calculateCollegeProgress();

    setCSSVars();

    // art1.draw();
});

function hi(){
    console.log("HI")
}

document.getElementsByClassName('arrow')[0].addEventListener('click', function() {
  const content = document.getElementById('projects');
  content.scrollIntoView({
    behavior: 'smooth'
  });
});

function calculateCollegeProgress(){
  let start = new Date('2021-08-19T12:00:00').getTime();
  let end = new Date('2025-05-10T12:00:00').getTime();
  let now = Date.now();

  let dist = end - start;
  let progress = now - start;

  let percent = Math.floor(progress / dist * 100);

  document.getElementById("college_progress").innerHTML = Math.min(percent, 100)  + "%";
  document.getElementById("loading_bar_progress").style.width = Math.min(percent, 100)  + "%";
}

function setCSSVars(){
  document.documentElement.style.setProperty('--small4-width', document.getElementById("small_4").offsetWidth + "px");

  let small4_divs = document.querySelectorAll("#small_4 div");

  for (let i = 0; i < small4_divs.length; i++) {
      small4_divs[i].style.width = small4_divs[i].children[0].offsetWidth + "px";
  }
}