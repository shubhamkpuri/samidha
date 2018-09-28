//login and signup formg
document.getElementById("signUpAppear").addEventListener("click", () => {
    document.getElementById("login").classList.add("d-none");
    document.getElementById("signup").classList.remove("d-none");
});
document.getElementById("logInAppear").addEventListener("click", () => {
    document.getElementById("login").classList.remove("d-none");
    document.getElementById("signup").classList.add("d-none");
});