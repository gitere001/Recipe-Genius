const form = document.getElementById("resetForm");
const submitBtn = document.getElementById("submitBtn");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");
const loadingSpinner = document.getElementById("loadingSpinner");

const successModal = document.getElementById("successModal");
const errorModal = document.getElementById("errorModal");

const closeSuccessModal = document.getElementById("closeSuccessModal");
const closeErrorModal = document.getElementById("closeErrorModal");
const newPasswordElement = document.getElementById("newPassword");
const confirmPasswordElement = document.getElementById("confirmPassword");
const overly = document.getElementById("overly");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPassword = newPasswordElement.value.trim();
  const confirmPassword = confirmPasswordElement.value.trim();

  if (!newPassword || !confirmPassword) {
    errorMessage.textContent = "Both fields are required.";
    errorMessage.classList.remove("hidden");
    return;
  }

  if (newPassword !== confirmPassword) {
    errorMessage.textContent = "Passwords do not match.";
    errorMessage.classList.remove("hidden");
    return;
  }

  submitBtn.textContent = "submiting...";
  try {
    const resetToken = window.location.pathname.split("/").pop();

    const response = await fetch(
      `http://localhost:5000/reset-password/${resetToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }),
      }
    );

    const data = await response.json();
    if (data.success) {
      newPasswordElement.value = "";
      confirmPasswordElement.value = "";
      overly.classList.remove("hidden")
      successModal.classList.add("show")
    } else {
      overly.classList.remove("hidden")
      errorModal.classList.add("show")

    }
  } catch (error) {
    overly.classList.remove("hidden")
      errorModal.classList.add("show")

  }
});

// Close Success Modal
closeSuccessModal.addEventListener("click", () => {
  overly.classList.add("hidden");
  successModal.classList.remove("show");
  console.log(successModal.classList);
  window.location.href = "http://localhost:5173";
});

// Close Error Modal
closeErrorModal.addEventListener("click", () => {
  errorModal.classList.remove("show");
  overly.classList.add("hidden");
  submitBtn.textContent = "Reset Password"
});
