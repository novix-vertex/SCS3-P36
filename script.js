const authScreen = document.querySelector(".container .auth");
const internalScreen = document.querySelector(".container .internal");

const loginCard = document.querySelector(".login-card");
const registerCard = document.querySelector(".register-card");

const showLoginCardLink = document.querySelector(".login-link");
const showRegisterCardLink = document.querySelector(".register-link");

const registerForm = document.querySelector("#register-form");
const loginForm = document.querySelector("#login-form");
const AddTransactionForm = document.querySelector("#form-add-transaction");


const loggedInUserName = document.querySelector(".navbar .user-info .user-name");
const logoutBtn = document.querySelector("#logout-btn");

const addTransactionModal = document.querySelector("#modal-add-transaction");
const closeAddTransactionModalBtn = document.querySelector("#modal-add-transaction .close-modal");

const addTransactionBtn = document.querySelector("#add-transaction-btn");
const transactionTableData = document.querySelector("#transaction-table-data");

let users = [];
let transactions = [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};


function showCard(show, hide) {
    if (hide != null) {
        hide.classList.add("hidden");
    }
    if (show != null) {
        show.classList.remove("hidden");
    }
}
showLoginCardLink.addEventListener("click", () => { showCard(loginCard, registerCard) });
showRegisterCardLink.addEventListener("click", () => { showCard(registerCard, loginCard) });

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}

function getTransactions() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
}

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

users = getUsers();
transactions = getTransactions();

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
    saveUsers();
    Swal.fire(
        {
            icon: "success",
            text: "User has been registered successfully.",
            title: "Success"
        }
    );
    registerForm.reset();
    showCard(loginCard, registerCard);
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
    currentUser = {
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

addTransactionBtn.addEventListener("click", () => {
    showCard(addTransactionModal, null);
});
closeAddTransactionModalBtn.addEventListener("click", () => {
    showCard(null, addTransactionModal);
});

window.addEventListener("click", function (e) {
    if (e.target === addTransactionModal) {
        showCard(null, addTransactionModal);
    }
});


function addTransaction(e) {
    e.preventDefault();

    const type = document.querySelector("#form-add-transaction #transaction-type").value;
    const description = document.querySelector("#form-add-transaction #transaction-description").value.trim() || "";
    const amount = Number(document.querySelector("#form-add-transaction #transaction-amount").value);
    const date = document.querySelector("#form-add-transaction #transaction-date").value;
    const category = document.querySelector("#form-add-transaction #transaction-category").value;

    if (type === "" || amount <= 0 || date === "" || category === "") {
        Swal.fire(
            {
                icon: "error",
                title: "Error",
                text: "Please fill all the required fields"
            }
        );
        return;
    }

    const transaction = {
        id: Date.now(),
        uid: currentUser.id,
        type,
        description,
        amount,
        date,
        category
    };
    transactions.push(transaction);
    saveTransactions();
    Swal.fire(
        {
            icon: "success",
            title: "Success",
            text: "New Transaction has been added successfully."
        }
    );
    showCard(null, addTransactionModal);
    AddTransactionForm.reset();
    showTransactions();
}
AddTransactionForm.addEventListener("submit", (e) => {
    addTransaction(e);
});

function showTransactions() {
    transactions = getTransactions();
    transactionTableData.innerHTML = "";
    if (transactions.length === 0) {
        transactionTableData.innerHTML = `<tr><td colspan="5">No Transactions Found</td></tr>`;
        return;
    }
    transactions.forEach(function (transaction) {
        let tr = document.createElement("tr");
        tr.innerHTML += `<td>${transaction.date}</td>
                         <td>${transaction.description}</td>
                         <td>${transaction.category}</td>
                         <td class="amount">${transaction.amount}</td>
                         <td class="actions">
                            <i class="edit-ic ri-pencil-fill" data-id="${transaction.id}"></i>
                            <i class="delete-ic ri-delete-bin-6-line" data-id="${transaction.id}"></i>
                         </td>`;
        transactionTableData.append(tr);
    });
}
showTransactions();

transactionTableData.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-ic")) {
        deleteTransaction(Number(e.target.dataset.id));
    }
});

function deleteTransaction(id) {
    id = Number(id);
    transactions =
        transactions.filter(function (item) {
            return item.id !== id;
        });
    saveTransactions();
    showTransactions();
}

function hasLoggedInUser() {
    if (currentUser) {
        showCard(internalScreen, authScreen);
        loggedInUserName.textContent = `Welcome ${currentUser.name}!`;
    } else {
        showCard(authScreen, internalScreen);
    }
}
hasLoggedInUser();
