document.addEventListener('DOMContentLoaded', () => {
  console.log("loaded");
 const sessionId = localStorage.getItem('sessionId');
 console.log(sessionId)
 if (sessionId) {
   const storedUserData = JSON.parse(localStorage.getItem("userData"));
   if (storedUserData) {
     nextStep("success-step");
   } else {
     localStorage.removeItem('sessionId');
   }
 }
});

/*============= State Management =============*/
let currentStep = "welcome-step";
let userData = {
 name: "",
 email: "",
 password: "",
};
let countdownInterval;

/*============= DOM Elements =============*/
const backButton = document.querySelector(".back-button");
const getStartedBtn = document.getElementById("primaryBtn");
const loginBtn = document.getElementById("secondaryBtn");

const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const nameNextButton = document.getElementById("nameNextButton");
const emailNextButton = document.getElementById("emailNextButton");
const passwordNextButton = document.getElementById("passwordNextButton");
const passwordToggleIcon = document.getElementById("passwordToggleIcon");

const loginEmailInput = document.getElementById("loginEmailInput");
const loginPasswordInput = document.getElementById("loginPasswordInput");
const loginSubmitButton = document.getElementById("loginSubmitButton");
const loginPasswordToggleIcon = document.getElementById(
 "loginPasswordToggleIcon"
);

const forgotPasswordButton = document.getElementById("forgotPasswordButton");
const resetEmailInput = document.getElementById("resetEmailInput");
const sendResetLinkButton = document.getElementById("sendResetLinkButton");
const backToLoginButton = document.getElementById("backToLoginButton");
const otpInput = document.getElementById("otpInput");
const verifyOtpButton = document.getElementById("verifyOtpButton");
const otpError = document.getElementById("otpError");
const resendOtpButton = document.getElementById("resendOtpButton");
const countdownTimer = document.getElementById("countdownTimer");
const countdownTime = document.getElementById("countdownTime");
const userEmailDisplay = document.getElementById("userEmailDisplay");
const successSectionBtn = document.getElementById('success-details')
const loginSignupModal = document.querySelector('.login-signup-modal')

/*============= Utility Functions =============*/
function validateEmail(email) {
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 return emailRegex.test(email);
}
function validateOtp(otp) {
 return otp === "0000"; // Hardcoded OTP for testing
}
const createSessionToken = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2)}`;
};
function startOtpTimer() {
 let timeLeft = 30;
 resendOtpButton.disabled = true;
 countdownTimer.classList.remove("hidden");

 countdownInterval = setInterval(() => {
   timeLeft--;
   countdownTime.textContent = timeLeft;

   if (timeLeft <= 0) {
     clearInterval(countdownInterval);
     resendOtpButton.disabled = false;
     countdownTimer.classList.add("hidden");
   }
 }, 1000);
}

function validateLoginForm() {
 const isValid =
   validateEmail(loginEmailInput.value.trim()) &&
   loginPasswordInput.value.trim().length > 0;
 loginSubmitButton.disabled = !isValid;
}

function togglePassword(inputElement, iconElement) {
 const type = inputElement.type === "password" ? "text" : "password";
 inputElement.type = type;
 iconElement.classList.toggle("fa-eye");
 iconElement.classList.toggle("fa-eye-slash");
}

function nextStep(step) {
 document.getElementById(currentStep).classList.remove("active");
 document.getElementById(step).classList.add("active");
 currentStep = step;
 backButton.classList.toggle("hidden", step === "welcome-step" || step === "success-step");
 if (step === "success-step") {
   document.getElementById("chefName").textContent = userData.name;
 }
}

/*============= Form Input Handlers =============*/
nameInput.addEventListener("input", () => {
 userData.name = nameInput.value.trim();
 nameNextButton.disabled = userData.name.length === 0;
});

emailInput.addEventListener("input", () => {
 const email = emailInput.value.trim();
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 userData.email = email;
 emailNextButton.disabled = !emailRegex.test(email);
});
otpInput.addEventListener("input", (e) => {
 const otp = e.target.value.trim();
 verifyOtpButton.disabled = otp.length !== 4;

 if (otpInput.classList.contains("error")) {
   otpInput.classList.remove("error");
   otpError.classList.remove("visible");
 }
});

passwordInput.addEventListener("input", () => {
 userData.password = passwordInput.value.trim();
 passwordNextButton.disabled = userData.password.length < 8;
});

loginEmailInput.addEventListener("input", validateLoginForm);
loginPasswordInput.addEventListener("input", validateLoginForm);

resetEmailInput?.addEventListener("input", () => {
 const isValidEmail = validateEmail(resetEmailInput.value.trim());
 sendResetLinkButton.disabled = !isValidEmail;
});

/*============= Password Toggle Handlers =============*/
passwordToggleIcon.addEventListener("click", () =>
 togglePassword(passwordInput, passwordToggleIcon)
);

loginPasswordToggleIcon.addEventListener("click", () =>
 togglePassword(loginPasswordInput, loginPasswordToggleIcon)
);

/*============= Navigation Handlers =============*/
getStartedBtn.addEventListener("click", () => {
 nextStep("name-step");
});

loginBtn.addEventListener("click", () => {
 nextStep("login-step");
});

nameNextButton.addEventListener("click", (e) => {
 e.preventDefault();
 nextStep("email-step");
});

emailNextButton.addEventListener("click", (e) => {
 e.preventDefault();
 nextStep("otp-step");
 userEmailDisplay.textContent = userData.email;
});
verifyOtpButton.addEventListener("click", (e) => {
 e.preventDefault();
 const otp = otpInput.value.trim();

 if (validateOtp(otp)) {
   nextStep("password-step");
   otpInput.value = "";
 } else {
   otpInput.classList.add("error");
   otpError.classList.add("visible");
 }
});

passwordNextButton.addEventListener("click", async (e) => {
 e.preventDefault();
 passwordNextButton.textContent = "";
 passwordNextButton.classList.add("loading");

 const simulateServerRequest = () => {
   return new Promise((resolve) => {
     setTimeout(() => {
       const success = Math.random() > 0.2;
       if (success) {
         localStorage.setItem("userData", JSON.stringify(userData));
       }
       resolve(success);
     }, 1000);
   });
 };

 const success = await simulateServerRequest();

 if (success) {
   nextStep("success-step");
 } else {
   passwordNextButton.textContent = "Finish";
   passwordNextButton.classList.remove("loading");
   alert("An error occurred. Please try again.");
 }
});


resendOtpButton.addEventListener("click", () => {
 startOtpTimer();
});

/*============= Login and Password Reset Handlers =============*/
loginSubmitButton.addEventListener("click", async (e) => {
 e.preventDefault();
 loginSubmitButton.textContent = "";
 loginSubmitButton.classList.add("loading");

 userData.email = loginEmailInput.value.trim();
 const password = loginPasswordInput.value.trim();

 const simulateServerRequest = () => {
   return new Promise((resolve) => {
     setTimeout(() => {
       const storedUserData = JSON.parse(localStorage.getItem("userData"));
       const success = storedUserData && storedUserData.email === userData.email && storedUserData.password === password;
       resolve(success);
     }, 1000);
   });
 };

 const success = await simulateServerRequest();

 if (success) {
   const sessionId = createSessionToken();
   localStorage.setItem('sessionId', sessionId);
   nextStep("success-step");
 } else {
   loginSubmitButton.textContent = "Submit";
   loginSubmitButton.classList.remove("loading");
   alert("Invalid email or password. Please try again.");
 }
});


forgotPasswordButton.addEventListener("click", () => {
 nextStep("forgot-password-step");
});

backToLoginButton?.addEventListener("click", () => {
 nextStep("login-step");
});

sendResetLinkButton.addEventListener("click", (e) => {
 e.preventDefault();
 nextStep("reset-success-step");
});

document.getElementById("backToWelcomeButton").addEventListener("click", () => {
 nextStep("welcome-step");
});

/*============= Back Navigation Handler =============*/
backButton.addEventListener("click", () => {
 let previousStep;

 if (
   currentStep === "login-step" ||
   currentStep === "forgot-password-step" ||
   currentStep === "name-step"
 ) {
   previousStep = "welcome-step";
 } else if (currentStep === "email-step") {
   previousStep = "name-step";
 } else if (currentStep === "password-step") {
   previousStep = "email-step";
 }  else if (currentStep === "reset-success-step") {
   previousStep = "welcome-step";
 } else if (currentStep === "otp-step") {
   previousStep = "email-step";
 } else {
   return;
 }

 if (currentStep === "otp-step") {
   clearInterval(countdownInterval);
 }

 nextStep(previousStep);
});
successSectionBtn.addEventListener('click', ()=> {
 loginSignupModal.classList.add('hidden')
})