"use strict";

//! Data   ::
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

//! Elements   ::
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (movement, index) {
    const type = movement > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
              <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
              <div class="movements__value">${movement}€</div>
            </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
displayMovements(account1.movements);

const createUsername = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsername(accounts);

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(
    (accumulator, movement) => accumulator + movement,
    0
  );
  labelBalance.textContent = `${account.balance}€`;
};
calcDisplayBalance(account1);

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter((movement) => movement > 0)
    .reduce((accumulator, movement) => accumulator + movement, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = account.movements
    .filter((movement) => movement < 0)
    .reduce((accumulator, movement) => accumulator + movement, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = account.movements
    .filter((movement) => movement > 0)
    .map((deposite) => (deposite * account.interestRate) / 100)
    .filter((deposite) => deposite >= 1)
    .reduce((accumulator, deposite) => accumulator + deposite, 0);
  labelSumInterest.textContent = `${interest}€`;
};
calcDisplaySummary(account1);

const updateUI = function (account) {
  // Display movements :
  displayMovements(currentAccount.movements);

  // Display balance :
  calcDisplayBalance(currentAccount);

  // Display summary :
  calcDisplaySummary(currentAccount);
};

//! Event handlers :

let currentAccount;

//? Implementing LogIn :
btnLogin.addEventListener("click", function (e) {
  // As we knew the form button with the behavior of reloading the page 'cause it's a submit button and we need to stop that for happening so we give the function the event parameter and we call the method as below wich prevents the form for submitting  :
  e.preventDefault();

  currentAccount = accounts.find(
    (account) => account.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Update UI :
    updateUI(currentAccount);

    // Clear the outputs :
    inputTransferTo.value = inputTransferAmount.value = "";
  }
});

//? Implementing Transfer :
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    (account) => account.username === inputTransferTo.value
  );
  // console.log(receiverAccount);

  // Clear the outputs :
  inputTransferTo.value = inputTransferAmount.value = "";
  // Clear the focus from the amount input :
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    receiverAccount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    // Doing the Transfer :
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // Update UI :
    updateUI(currentAccount);
  }
});

//? Implementing Loan Amount :
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((movement) => movement >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);

    // Update UI :
    updateUI(currentAccount);
  }
  // Clear the outputs :
  inputLoanAmount.value = "";
});

//? Implementing LogOut :
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (account) => currentAccount.username === account.username
    );
    // Delete account :
    accounts.splice(index, 1);

    // Hide UI :
    containerApp.style.opacity = 0;

    // Clear the outputs :
    inputCloseUsername.value = inputClosePin.value = "";

    // Display the starter message :
    labelWelcome.textContent = "Log in to get started";
  }
});

//? Implementing Sorting movements :
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);

  sorted = !sorted;
});
