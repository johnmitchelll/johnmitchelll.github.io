document.addEventListener('DOMContentLoaded', function() {
  startPerlin();

  goThroughTypingAnimation();
  calculateCollegeProgress();

  setCSSVars();

  grid.draw();

  night_sky.initNightSky();

  
  setTimeout(small2Animate, 2000);

  assignTime();

  setInterval(() => {
    updateDynamicScrollers();
    night_sky.drawNightSky();
  }, 1000/30);

  
  night_sky.createNewShootingStar();

  document.getElementsByClassName('arrow')[0].addEventListener('click', function() {
    const content = document.getElementById('projects');
    content.scrollIntoView({
      behavior: 'smooth'
    });
  });
});