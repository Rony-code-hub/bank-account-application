"use strict";

const account1 = {
  owner: "Mahfuj Ahmed Rony",
  movements: [60, 40, -600, 3000, -250, -30, 190, 1300],
  interestRate: 1.2, // %
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2023-12-24T14:11:59.604Z",
    "2023-12-21T17:01:17.194Z",
    "2023-12-26T23:36:17.929Z",
    "2023-12-28T10:51:36.790Z",
  ],
  currency: "USD",
  pin: 1111,
  locale: "en-US",
};

const account2 = {
  owner: "Musfiq Kamal",
  movements: [3000, 400, -50, -230, -3210, -1000, 10500, -100],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2023-11-06T17:01:17.194Z",
    "2023-11-10T23:36:17.929Z",
    "2023-11-12T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-GB",
};

const account3 = {
  owner: "Mahmodullah Riyad",
  movements: [100, -200, 30, -20, 5020, 50, 400, -760],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2023-11-06T17:01:17.194Z",
    "2023-11-10T23:36:17.929Z",
    "2023-11-12T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account4 = {
  owner: "Albert Einstein",
  movements: [230, 1000, 800, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
  ],
  currency: "USD",
  locale: "bn-BD",
};

const accounts = [account1, account2, account3, account4];

const topPage = document.querySelector(".front-page");
const containerApp = document.querySelector(".app");
const containerMovement = document.querySelector(".movements");
const balanceValue = document.querySelector(".summary__label--balance-value");
const inValue = document.querySelector(".summary__label--in-value");
const outValue = document.querySelector(".summary__label--out-value");
const interestValue = document.querySelector(".summary__label--interest-value");
const loginUsername = document.querySelector(".login__input--user");
const loginPin = document.querySelector(".login__input--pin");
const welcomeUser = document.querySelector(".navbar__text");
const transferAmount = document.querySelector(".form__input--amount-transfer");
const transferUsername = document.querySelector(".form__input--to");
const inputUser = document.querySelector(".form__input--user");
const inputUserPin = document.querySelector(".form__input--pin");
const loanValue = document.querySelector(".form__input--amount-loan");
const displayWatch = document.querySelector(".account__watch");
const timeSet = document.querySelector(".timer__text");

const loginBtn = document.querySelector(".login__btn");
const logOutBtn = document.querySelector(".navbar__logout");
const transferBtn = document.querySelector(".form__btn--transfer");
const closeBtn = document.querySelector(".form__btn--close");
const loanBtn = document.querySelector(".form__btn--loan");
const sortBtn = document.querySelector(".sort__btn");

function updateTime() {
  const dateToday = new Date();

  const option = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  };

  displayWatch.textContent = new Intl.DateTimeFormat("en-US", option).format(
    dateToday
  );
}

setInterval(updateTime);

const timeOut = function () {
  let time = 30;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    timeSet.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);

      containerApp.classList.add("visible");
      topPage.classList.remove("visible");
    }

    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const updateUi = function (acc) {
  balanceAmount(acc);
  displayMovment(acc);
  displaySummery(acc);
};

let currentAccount, timer;
loginBtn.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find((acc) => acc.username === loginUsername.value);

  if (currentAccount?.pin === Number(loginPin.value)) {
    containerApp.classList.remove("visible");
    topPage.classList.add("visible");
  }

  loginUsername.value = "";
  loginPin.value = "";

  const nameArray = currentAccount.owner.split(" ");
  const firstNmae = nameArray[0];
  const lastName = nameArray[nameArray.length - 1][0];
  welcomeUser.textContent = `Welcome, ${firstNmae} ${lastName}.`;

  if (timer) clearInterval(timer);
  timer = timeOut();
  updateUi(currentAccount);
});

logOutBtn.addEventListener("click", function (e) {
  e.preventDefault();
  containerApp.classList.add("visible");
  topPage.classList.remove("visible");
});

const formatMovementsDate = function (myDate) {
  const calcDayPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayPassed = calcDayPassed(new Date(), myDate);

  if (dayPassed === 0) return "Today";
  if (dayPassed === 1) return "Yesterday";
  if (dayPassed <= 7) return `${dayPassed} days ago`;
  else {
    const year = `${myDate.getFullYear()}`.padStart(2, 0);
    const month = `${myDate.getMonth() + 1}`.padStart(2, 0);
    const day = `${myDate.getDate()}`.padStart(2, 0);
    return `${day}-${month}-${year}`;
  }
};

const displayMovment = function (acc, sort = false) {
  containerMovement.innerHTML = "";
  const sortMov = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  sortMov.forEach(function (val, i) {
    const typeName = val > 0 ? "deposit" : "withdrawal";
    const myDate = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(myDate);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${typeName}">
          ${i + 1} ${typeName}
        </div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${val.toFixed(2)} $</div>
      </div>
  `;
    containerMovement.insertAdjacentHTML("afterbegin", html);
  });
};

const balanceAmount = function (acc) {
  acc.balance = acc.movements.reduce((accm, val) => accm + val, 0);
  balanceValue.textContent = acc.balance.toFixed(2);
};

const displaySummery = function (acc) {
  const accountIn = acc.movements
    .filter((val) => val > 0)
    .reduce((accm, val) => accm + val, 0);
  inValue.textContent = `${accountIn.toFixed(2)}$`;

  const accountOut = acc.movements
    .filter((val) => val < 0)
    .reduce((accm, val) => accm + val, 0);
  outValue.textContent = `${Math.abs(accountOut).toFixed(2)}$`;

  const accountInterest = acc.movements
    .filter((val) => val > 0)
    .map((val) => (val * acc.interestRate) / 100)
    .filter((val) => val >= 1)
    .reduce((accm, val) => accm + val, 0);

  interestValue.textContent = `${Math.round(accountInterest).toFixed(2)}$`;
};

const createUserName = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((item) => item[0])
      .join("");
  });
};

createUserName(accounts);

transferBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const transferAmountValue = Number(transferAmount.value);
  const transferUsernameValue = accounts.find(
    (val) => val.username === transferUsername.value
  );
  transferAmount.value = transferUsername.value = "";
  if (
    transferAmountValue > 0 &&
    transferUsernameValue &&
    currentAccount.balance >= transferAmountValue &&
    transferUsernameValue?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-transferAmountValue);
    transferUsernameValue.movements.push(transferAmountValue);
    currentAccount.movementsDates.push(new Date().toISOString());
    transferUsernameValue.movementsDates.push(new Date().toISOString());

    updateUi(currentAccount);
    clearInterval(timer);
    timer = timeOut();
  }
});

loanBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const loanAmount = Number(loanValue.value);

  if (
    loanAmount > 0 &&
    currentAccount.movements.some((val) => val >= loanAmount * 0.1)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(loanAmount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUi(currentAccount);
      clearInterval(timer);
      timer = timeOut();
    }, 3000);
  }
  loanValue.value = "";
});

closeBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const closePin = Number(inputUserPin.value);
  const closeUsername = inputUser.value;

  if (
    closeUsername === currentAccount.username &&
    closePin === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (val) => val.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.classList.add("visible");
    topPage.classList.remove("visible");
  }
  inputUserPin.value = inputUser.value = "";
});

let sorted = false;
sortBtn.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovment(currentAccount.movements, !sorted);
  sorted = !sorted;
});
