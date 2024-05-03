

document.addEventListener('DOMContentLoaded', function() {
    goThroughTypingAnimation();
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