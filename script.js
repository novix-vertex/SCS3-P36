const loginCard = document.querySelector(".login-card");
const registerCard = document.querySelector(".register-card");

const showLoginCardLink = document.querySelector(".login-link");
const showRegisterCardLink = document.querySelector(".register-link");

const registerForm = document.querySelector("#register-form");

/**
 * This code is being used to show and hide the auth cards - register and login on clicking link shown at the bottom of the auth card
 */
function showCard(show, hide) {
    hide.classList.add("hidden");
    show.classList.remove("hidden");
}
showLoginCardLink.addEventListener("click", () => { showCard(loginCard, registerCard) });
showRegisterCardLink.addEventListener("click", () => { showCard(registerCard, loginCard) });


/**
 * This code is being used to register a user
 */
function registerUser(e) {
    e.preventDefault();

    const userName = document.querySelector("#register-form .user-name");
    const userEmail = document.querySelector("#register-form .user-email");
    const userPassword = document.querySelector("#register-form .user-password");

    const name = userName.value.trim();
    const email = userEmail.value.trim();
    const password = userPassword.value;

    if (name === "" || email === "" || password === "") {
        Swal.fire(
            "Error",
            "All fields are mandatory.",
            "error"
        );

        return;
    }
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = users.find(function (user) {
        return user.email === email;
    });
    if (existingUser) {
        Swal.fire(
            "Error",
            "Email already exists",
            "error"
        );

        return;
    }
    const user = {
        id: Date.now(),
        name,
        email,
        password
    };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    Swal.fire(
        "Success",
        "User has been registered successfully.",
        "success"
    );
    registerForm.reset();
    showCard(loginCard, registerCard)
}
registerForm.addEventListener("submit", (e) => { registerUser(e) });