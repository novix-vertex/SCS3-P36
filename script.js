const authScreen = document.querySelector(".container .auth");
const internalScreen = document.querySelector(".container .internal");

const dashboardView = document.querySelector(".container .internal #view-dashboard");
const settingsView = document.querySelector(".container .internal #view-settings");

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

const transactionTypeInp = document.querySelector("#form-add-transaction #transaction-type");
const transactionDescriptionInp = document.querySelector("#form-add-transaction #transaction-description");
const transactionAmountInp = document.querySelector("#form-add-transaction #transaction-amount");
const transactionDateInp = document.querySelector("#form-add-transaction #transaction-date");
const transactionCategoryInp = document.querySelector("#form-add-transaction #transaction-category");

const typeFilter = document.querySelector("#type-filter");
const categoryFilter = document.querySelector("#category-filter");

const navMenu = document.querySelector(".nav-menu");

let users = [];
let transactions = [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

const statBalance = document.querySelector("#stat-balance");
const statIncome = document.querySelector("#stat-income");
const statExpense = document.querySelector("#stat-expense");
const statCount = document.querySelector("#stat-count");

const searchInput = document.querySelector("#search-input");

let editingTransactionId = null;
let cashFlowChart = null;

let income = 0;
let expense = 0;

let searchText = "";
let typeFilterValue = "all";
let categoryFilterValue = "all";

function showCard(show, hide) {
    if (hide != null) {
        hide.classList.add("hidden");
    }
    if (show != null) {
        show.classList.remove("hidden");
    }
    if (editingTransactionId != null) {
        const transaction = transactions.find((transaction) => {
            return transaction.id == editingTransactionId;
        })
        transactionTypeInp.value = transaction.type;
        transactionDescriptionInp.value = transaction.description;
        transactionAmountInp.value = transaction.amount;
        transactionDateInp.value = transaction.date;
        transactionCategoryInp.value = transaction.category;
    }
    if (hide == addTransactionModal) {
        editingTransactionId = null;
        AddTransactionForm.reset();
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

    const type = transactionTypeInp.value;
    const description = transactionDescriptionInp.value.trim() || "";
    const amount = Number(transactionAmountInp.value);
    const date = transactionDateInp.value;
    const category = transactionCategoryInp.value;

    e.preventDefault();
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

    if (editingTransactionId != null) {
        const index = transactions.findIndex((transaction) => {
            return transaction.id == editingTransactionId;
        });

        if (index != -1) {
            transactions[index] = transaction;
        }
        editingTransactionId = null;
        saveTransactions();
        Swal.fire(
            {
                icon: "success",
                title: "Success",
                text: "Transaction has been updated successfully."
            }
        );

    } else {
        transactions.push(transaction);
        saveTransactions();
        Swal.fire(
            {
                icon: "success",
                title: "Success",
                text: "New Transaction has been added successfully."
            }
        );

    }
    showCard(null, addTransactionModal);
    AddTransactionForm.reset();
    refreshUI();
}
AddTransactionForm.addEventListener("submit", (e) => {
    addTransaction(e);
});

function showTransactions() {
    transactions = getTransactions();
    if (searchText !== "") {
        transactions = transactions.filter(function (item) {
            return item.description.toLowerCase().includes(searchText);
        });
    }
    if (typeFilterValue !== "all") {
        transactions = transactions.filter(item =>
            item.type === typeFilterValue
        );
    }
    if (categoryFilterValue !== "all") {
        transactions = transactions.filter(item =>
            item.category === categoryFilterValue
        );
    }

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
                         <td class="amount">${formatCurrency(transaction.amount)}</td>
                         <td class="actions">
                            <i class="edit-ic ri-pencil-fill" data-id="${transaction.id}"></i>
                            <i class="delete-ic ri-delete-bin-6-line" data-id="${transaction.id}"></i>
                         </td>`;
        transactionTableData.append(tr);
    });
}

transactionTableData.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-ic")) {

        Swal.fire({
            title: "Delete transaction?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteTransaction(Number(e.target.dataset.id));
            }
        });
    }
    if (e.target.classList.contains("edit-ic")) {
        editTransaction(Number(e.target.dataset.id));
    }
});

function deleteTransaction(id) {
    id = Number(id);
    transactions =
        transactions.filter(function (item) {
            return item.id !== id;
        });
    saveTransactions();
    refreshUI();
}

function editTransaction(id) {
    id = Number(id);
    editingTransactionId = id;
    showCard(addTransactionModal, null);
}
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0
    }).format(amount);

}
function updateSummaryCards() {
    income = transactions.reduce((sum, transaction) => {
        if (transaction.type === "income") {
            return sum += transaction.amount;
        }
        return sum;
    }, 0);

    expense = transactions.reduce((sum, transaction) => {
        if (transaction.type === "expense") {
            return sum += transaction.amount;
        }
        return sum;
    }, 0);

    statIncome.textContent = formatCurrency(income);
    statExpense.textContent = formatCurrency(expense);
    statBalance.textContent = formatCurrency(income - expense);
    statCount.textContent = transactions.length;

}

function renderChart() {
    const canvas = document.querySelector("#chart-canvas");
    if (cashFlowChart) {
        cashFlowChart.destroy();
    }
    cashFlowChart = new Chart(canvas, {
        type: "bar",
        data: {
            labels: ["Income", "Expense"],
            datasets: [{
                label: "Amount",
                data: [income, expense],
                backgroundColor: ["#28a745", "#fee2e2"],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: { grid: { display: false } },
                x: { grid: { display: false } },
            }
        }
    });

}


searchInput.addEventListener("input", function () {
    searchText = this.value.trim().toLowerCase();
    refreshUI();
});

typeFilter.addEventListener("change", function () {
    typeFilterValue = this.value;
    refreshUI();
});

categoryFilter.addEventListener("change", function () {
    categoryFilterValue = this.value;
    refreshUI();
});


navMenu.addEventListener("click", function (e) {
    e.preventDefault();

    const navItem = e.target.closest(".nav-item");
    if (!navItem) {
        return;
    }
    if (navItem.id === "nav-dashboard") {
        showCard(dashboardView, settingsView);
    } else if (navItem.id === "nav-settings") {
        showCard(settingsView, dashboardView);
    }
});



function refreshUI() {
    showTransactions();
    updateSummaryCards();
    renderChart();
}
refreshUI();




function hasLoggedInUser() {
    if (currentUser) {
        showCard(internalScreen, authScreen);
        loggedInUserName.textContent = `Welcome ${currentUser.name}!`;
    } else {
        showCard(authScreen, internalScreen);
    }
}
hasLoggedInUser();
