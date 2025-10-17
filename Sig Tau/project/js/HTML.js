
async function InitHTML(){
	await InitImages();
	InitBody();
	InitLogo();
	InitVideo();
	InitBottom();
}

function InitBody(){
	let body = document.getElementById("body");

	body.style.position = "absolute";
	body.style.display = "flex";
	body.style.flexDirection = "column";
	body.style.margin = "0px auto";

	body.style.top = "20px";
	body.style.left = "20px";

	document.querySelector("*").style.backgroundColor = background;

	if(document.querySelector("html").offsetWidth > MAX_SCREEN_WIDTH){
		body.style.left = (document.querySelector("html").offsetWidth/2 - MAX_SCREEN_WIDTH/2) + "px";
	}
}

async function InitImages(){
	primaryColor = "#e62a23";
	secondaryColor = "#7d7d7d";
	background = "#121212";
}

function InitLogo(){
	let top = document.getElementById("logo");
	let logo = document.getElementById("SigTauRedLogo");
	let jordan = document.getElementById("Jordan");
	let signUpBelow = document.getElementById("SignUp");
	let rushShirt = document.getElementById("rushShirt");

	let topHeight = ACTIVE_WIDTH/4;

	top.style.width = ACTIVE_WIDTH + "px";
	top.style.alignSelf = "center";
	top.style.display = "flex";
	top.style.justifyContent = "center";
	top.style.border = "3px solid " + secondaryColor;
	top.style.borderRadius = "20px";
	top.style.height = topHeight + "px";

	logo.style.width = (ACTIVE_WIDTH/3) + "px";
	logo.style.height = (topHeight/1.5) + "px";
	logo.style.position = "absolute";
	logo.style.top = (topHeight/8) + "px";
	logo.style.left = (ACTIVE_WIDTH/2 - ACTIVE_WIDTH/6) + "px";

	jordan.style.position = "absolute";
	jordan.style.width = (ACTIVE_WIDTH/5) + "px";
	jordan.style.height = (topHeight) + "px";
	jordan.style.transform = "rotate(-20deg)";
	jordan.style.left = (ACTIVE_WIDTH-ACTIVE_WIDTH/4.2) + "px";
	jordan.style.top = (topHeight-topHeight/2) + "px";

	signUpBelow.style.width = "auto"
	signUpBelow.style.backgroundColor = "rgba(0,0,0,0)"
	signUpBelow.style.position = "absolute";
	signUpBelow.style.top = (topHeight-topHeight/4) + "px";
	signUpBelow.style.left = (ACTIVE_WIDTH/2 - signUpBelow.offsetWidth) + "px";
	signUpBelow.style.fontSize = H1_FONTSIZE;
	signUpBelow.style.color = primaryColor;

	rushShirt.style.position = "absolute";
	rushShirt.style.width = (ACTIVE_WIDTH/5) + "px";
	rushShirt.style.height = topHeight-20 + "px";
	rushShirt.style.top = "13px";
	rushShirt.style.left = "15px";
	rushShirt.style.borderRadius = "20px";
}

function InitVideo(){
	let video = document.getElementById("RushVid");
	let checkoutour = document.getElementById("CheckOut");
	let signUpBelow = document.getElementById("SignUp");
	let rushInfo = document.getElementById("rushInfo");
	let schedule = document.getElementById("schedule");

	let topHeight = ACTIVE_WIDTH/4;

	video.style.marginTop = "4%";
	video.style.marginBottom = "25%";
	video.style.width = Math.max(ACTIVE_WIDTH*0.50, MAX_SCREEN_WIDTH*0.50) + "px";
	video.style.height = topHeight + "px";
	video.style.alignSelf = "left";

	let widthOfText = (ACTIVE_WIDTH/2);

	checkoutour.style.backgroundColor = "rgba(0,0,0,0)"
	checkoutour.style.position = "absolute";
	checkoutour.style.left = (ACTIVE_WIDTH/1.95) + "px"
	checkoutour.style.top = (topHeight*1.5) + "px"
	checkoutour.style.fontSize = H2_FONTSIZE;
	checkoutour.style.color = primaryColor;

	checkoutour.style.width = widthOfText + "px"

	rushInfo.style.width = (ACTIVE_WIDTH/3.5) + "px"
	rushInfo.style.height = (ACTIVE_WIDTH/3.5) + "px"
	rushInfo.style.position = "absolute";
	rushInfo.style.left = (ACTIVE_WIDTH - ACTIVE_WIDTH/2.75) + "px";
	rushInfo.style.top = (topHeight*1.85) + "px";
	rushInfo.style.border = "2px solid rgb(100,100,100)";

	schedule.style.width = "40%"
	schedule.style.color = primaryColor;
	schedule.style.position = "absolute";
	schedule.style.left = (ACTIVE_WIDTH - ACTIVE_WIDTH*0.75) + "px";
	schedule.style.top = (topHeight*2.5) + "px";
	schedule.style.fontSize = H2_FONTSIZE;
	schedule.style.backgroundColor = "rgba(0,0,0,0)";
}

function InitBottom(){
	let triGraphic = document.getElementById("triGraphic");
	let submit = document.getElementById("submit");
	let infoLabels = document.getElementsByClassName("infoLabel");
	let submitResult = document.getElementById("sumbitResult");
	let info = document.getElementsByClassName("info");

	for(var i = 0; i < info.length; i++){
	    info[i].style.border = "2px solid " + secondaryColor;
	    info[i].style.backgroundColor = background;
	}	

	triGraphic.width = ACTIVE_WIDTH;
	triGraphic.height = ACTIVE_WIDTH/3;
	triGraphic.style.marginTop = "4%";

	submit.style.width = "30%";
	submit.style.height = "40px";
	submit.style.alignSelf = "center";
	submit.style.marginTop = "4%";
	submit.style.border = "2px solid grey";
	submit.style.borderRadius = "5px";
	submit.style.color = primaryColor;
	submit.style.fontSize = H3_FONTSIZE;
	submit.style.backgroundColor = background;

	submitResult.style.marginTop = "2%";

	for(var i = 0; i < infoLabels.length; i++){
	    infoLabels[i].style.fontSize = H3_FONTSIZE;
	    infoLabels[i].style.color = primaryColor;
	}
}

function sendUserData(){
	document.getElementById("sumbitResult").style.display = "inline";
	setTimeout("hideLabel()", 3000);
	document.getElementById("sumbitResult").textContent = "Your Submission has Been Recived By Sig Tau";
}

function hideLabel(){
	document.getElementById("sumbitResult").style.display = "none";
}


async function downloadImage(imageSrc) {
  const image = await fetch(imageSrc)
  const imageBlog = await image.blob()
  const imageURL = URL.createObjectURL(imageBlog)

  return imageURL;
 }
