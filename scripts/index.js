const container = document.querySelector(".form-container");
const registerBtn = document.querySelector(".btn-signup");
const loginBtn = document.querySelector(".btn-login");
const signUpForm = document.querySelector(".form-signUp");
const loginForm = document.querySelector(".form-login");
signUpForm.classList.add("hidden");

registerBtn.addEventListener("click", (e) => {
    container.classList.add("active");
    loginForm.classList.add("hidden");
    signUpForm.classList.remove("hidden");

});
loginBtn.addEventListener("click", (e) => {
    container.classList.remove("active");
    loginForm.classList.remove("hidden");
    signUpForm.classList.add("hidden");

});