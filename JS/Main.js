document.addEventListener('DOMContentLoaded', function() {
  startPerlin();

  goThroughTypingAnimation();
  calculateCollegeProgress();

  setCSSVars();

  night_sky.initNightSky();
  
  setTimeout(small2Animate, 2000);

  assignTime();

  faded_lights.init();

  setInterval(() => {
    updateDynamicScrollers();
    night_sky.drawNightSky();
    three_dimentional.draw();
    faded_lights.draw();
  }, 1000/30);

  
  night_sky.createNewShootingStar();

  document.getElementsByClassName('arrow')[0].addEventListener('click', function() {
    const content = document.getElementById('projects');
    content.scrollIntoView({ behavior: 'smooth' });
  });
});