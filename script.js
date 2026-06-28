const authScreen = document.querySelector(".container .auth");
const internalScreen = document.querySelector(".container .internal");

const loginCard = document.querySelector(".login-card");
const registerCard = document.querySelector(".register-card");

const showLoginCardLink = document.querySelector(".login-link");
const showRegisterCardLink = document.querySelector(".register-link");

const registerForm = document.querySelector("#register-form");
const loginForm = document.querySelector("#login-form");


const loggedInUserName = document.querySelector(".navbar .user-info .user-name");
const logoutBtn = document.querySelector("#logout-btn");

let users = [];

function showCard(show, hide) {
    hide.classList.add("hidden");
    show.classList.remove("hidden");
}
showLoginCardLink.addEventListener("click", () => { showCard(loginCard, registerCard) });
showRegisterCardLink.addEventListener("click", () => { showCard(registerCard, loginCard) });

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

users = getUsers();

function registerUser(e) {
    e.preventDefault();

    const userName = document.querySelector("#register-form .user-name");
    const userEmail = document.querySelector("#register-form .user-email");
    const userPassword = document.querySelector("#register-form .user-password");

    const name = userName.value.trim();
    const email = userEmail.value.trim().toLowerCase();
    const password = userPassword.value;

    if (name === "" || email === "" || password === "") {
        Swal.fire(
            {
                icon: "error",
                title: "Error",
                text: "All fields are mandatory."
            }
        );

        return;
    }
    const existingUser = users.find(function (user) {
        return user.email === email;
    });
    if (existingUser) {
        Swal.fire(
            {
                icon: "error",
                title: "Error",
                text: "Email already exists."
            }
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
    saveUsers(users);
    Swal.fire(
        {
            icon: "success",
            text: "User has been registered successfully.",
            title: "Success"
        }
    );
    registerForm.reset();
    showCard(loginCard, registerCard)
}
registerForm.addEventListener("submit", (e) => { registerUser(e) });

function loginUser(e) {
    e.preventDefault();

    const userEmail = document.querySelector("#login-form .user-email");
    const userPassword = document.querySelector("#login-form .user-password");

    const email = userEmail.value.trim().toLowerCase();
    const password = userPassword.value;

    if (email === "" || password === "") {
        Swal.fire(
            {
                icon: "error",
                title: "Error",
                text: "All fields are mandatory."
            }
        );

        return;
    }

    const existingUser = users.find(function (user) {
        return user.email === email;
    });

    if (!existingUser) {
        Swal.fire(
            {
                icon: "error",
                title: "Error",
                text: "User not found."
            }
        );

        return;
    }
    if (existingUser.password !== password) {

        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Invalid Credentials"
        });

        return;
    }
    const currentUser = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email
    };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    Swal.fire({
        icon: "success",
        title: `Welcome ${currentUser.name}!`,
        text: "Login Successful"
    });
    loginForm.reset();
    showCard(internalScreen, authScreen);
    loggedInUserName.textContent = `Welcome ${currentUser.name}!`;

}
loginForm.addEventListener("submit", (e) => { loginUser(e) });

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    showCard(authScreen, internalScreen);
});

function hasLoggedInUser() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
        showCard(internalScreen, authScreen);
        loggedInUserName.textContent = `Welcome ${currentUser.name}!`;
    } else {
        showCard(authScreen, internalScreen);
    }
}
hasLoggedInUser();
