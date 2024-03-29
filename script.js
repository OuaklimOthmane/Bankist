"use strict";

//! Data   ::
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2021-12-01T17:01:17.194Z",
    "2021-12-05T23:36:17.929Z",
    "2021-12-08T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account5 = {
  owner: "Othmane Ouaklim",
  movements: [3000, 400, -150, -290, -3211, -100, 5500, -30],
  interestRate: 1.5,
  pin: 5555,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2021-12-01T17:01:17.194Z",
    "2021-12-05T23:36:17.929Z",
    "2021-12-08T10:51:36.790Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "MAD",
  locale: "ar-MA",
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

const accounts = [account1, account2, account3, account4, account5];

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
//! FUNCTIONS ::

const formatMovementDates = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed === 7) return "1 Week ago ";
  if (daysPassed < 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach(function (movement, index) {
    const type = movement > 0 ? "deposit" : "withdrawal";
    const date = new Date(account.movementsDates[index]);
    const displayDate = formatMovementDates(date, account.locale);
    const formattedMovement = formatCurrency(
      movement,
      account.locale,
      account.currency
    );

    const html = `<div class="movements__row">
              <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
              <div class="movements__date">${displayDate}</div>
              <div class="movements__value">${formattedMovement}</div>
            </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
displayMovements(account1);

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
  labelBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
};
calcDisplayBalance(account1);

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter((movement) => movement > 0)
    .reduce((accumulator, movement) => accumulator + movement, 0);
  labelSumIn.textContent = formatCurrency(
    incomes,
    account.locale,
    account.currency
  );

  const out = account.movements
    .filter((movement) => movement < 0)
    .reduce((accumulator, movement) => accumulator + movement, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    account.locale,
    account.currency
  );

  const interest = account.movements
    .filter((movement) => movement > 0)
    .map((deposite) => (deposite * account.interestRate) / 100)
    .filter((deposite) => deposite >= 1)
    .reduce((accumulator, deposite) => accumulator + deposite, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
};
calcDisplaySummary(account1);

const updateUI = function (account) {
  // Display movements :
  displayMovements(account);

  // Display balance :
  calcDisplayBalance(account);

  // Display summary :
  calcDisplaySummary(account);
};

const startLogOutTimer = function () {
  const tick = function () {
    const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    const secondes = String(time % 60).padStart(2, 0);

    //* In each call, print the remaining time to UI
    labelTimer.textContent = `${minutes}:${secondes}`;

    //* When we reach 0 seconds, stop the timer andlog out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started ";
      containerApp.style.opacity = 0;
    }

    //* Decrease timer :
    time--;
  };

  //* Set time to 2 minutes :
  let time = 120;

  // Call the timer every second :
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

//! Event handlers ::

let currentAccount, timer;

//? Implementing LogIn :
btnLogin.addEventListener("click", function (e) {
  // As we knew the form button with the behavior of reloading the page 'cause it's a submit button and we need to stop that for happening so we give the function the event parameter and we call the method as below wich prevents the form for submitting  :
  e.preventDefault();

  currentAccount = accounts.find(
    (account) => account.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //* Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    //* Creating current dates and time :
    // const now = new Date();
    // const year = now.getFullYear();
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minute = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;

    //* Formating dates automatically using internationalization :
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      weekday: "long",
    };

    //* getting locale from user's browser :
    // const locale = navigator.language;
    // console.log(locale); // fr-FR

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //* Clear input fields :
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    //* Timer :
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    //* Update UI :
    updateUI(currentAccount);

    //* Clear the outputs :
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

  //* Clear the outputs :
  inputTransferTo.value = inputTransferAmount.value = "";

  //* Clear the focus from the amount input :
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    receiverAccount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    //* Doing the Transfer :
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    //* Add transfer date :
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    //* Update UI :
    updateUI(currentAccount);

    //* Reset timer :
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

//? Implementing Loan Amount :
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((movement) => movement >= amount * 0.1)
  ) {
    // simulating a Waiting loan amount request from a bank :
    setTimeout(function () {
      //* Add movement :
      currentAccount.movements.push(amount);

      //* Add loan date :
      currentAccount.movementsDates.push(new Date().toISOString());

      //* Update UI :
      updateUI(currentAccount);
    }, 2500);

    //* Reset timer :
    clearInterval(timer);
    timer = startLogOutTimer();
  }
  //* Clear the outputs :
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
    //* Delete account :
    accounts.splice(index, 1);

    //* Hide UI :
    containerApp.style.opacity = 0;

    //* Clear the outputs :
    inputCloseUsername.value = inputClosePin.value = "";

    //* Display the starter message :
    labelWelcome.textContent = "Log in to get started";
  }
});

//? Implementing Sorting movements :
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);

  sorted = !sorted;
});
