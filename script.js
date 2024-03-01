'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Islam Sobhy',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-02-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2024-02-28T14:11:59.604Z',
    '2024-02-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2024-02-29T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-GB', // de-DE
};

const account2 = {
  owner: 'Mohamed Sobhy',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-GB',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
let activeAcount = null;

const formate = type => `${type}`.padStart(2, '0');
const formateDate = function (date) {
  const formatedDate = Intl.DateTimeFormat(activeAcount.locale).format(date);
  const calcDate = (dateOne, dateTwo) =>
    Math.round(Math.abs(dateTwo - dateOne) / (24 * 60 * 60 * 1000));
  const daysPassed = calcDate(new Date(), date);
  if (daysPassed === 0) {
    return 'Today';
  } else if (daysPassed === 1) {
    return 'YesterDay';
  } else if (daysPassed <= 7) {
    return `${daysPassed} Days ago`;
  } else {
    return `${formatedDate}`;
  }
};
const currenciesMap = new Map([
  ['EUR', '💶'],
  ['USD', '💵'],
]);
const formateCurrencies = function (amount, acc) {
  const formatedAmount = Intl.NumberFormat(acc.locale).format(amount);
  const currencyIcon = currenciesMap.get(acc.currency);
  return `${formatedAmount}${currencyIcon}`;
};
const createMovement = function (acc, i, moveType) {
  const currentMoveDate = new Date(acc.movementsDates[i]);
  const transActionDate = formateDate(currentMoveDate);
  const move = `<div class="movements__row">
          <div class="movements__type movements__type--${moveType}">${
    i + 1
  } ${moveType}</div>
          <div class="movements__date">${transActionDate}</div>
          <div class="movements__value">${formateCurrencies(
            acc.movements[i],
            acc
          )}</div>
        </div>`;
  containerMovements.insertAdjacentHTML('afterbegin', move);
};
const displayMovement = function (acc, sort = false) {
  //Clear the content of the movements container
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const moveType = mov > 0 ? 'deposit' : 'withdrawal';
    createMovement(acc, i, moveType);
  });
};
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov);
  labelBalance.textContent = `${formateCurrencies(acc.balance, acc)}`;
};
const diplayDate = function () {
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    weekday: 'long', //this for making it like this february not like this 2
  };
  const formatedDate = Intl.DateTimeFormat(activeAcount.locale, options).format(
    now
  );
  labelDate.textContent = `${formatedDate}`;
};
const calcDisplaySummary = function (acc) {
  const incom = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  const outcome = acc.movements
    .filter(mov => mov <= 0)
    .reduce((acc, mov) => acc + mov);
  //Display the values on the labels

  labelSumIn.textContent = `${formateCurrencies(incom, acc)}`;
  labelSumOut.textContent = `${formateCurrencies(Math.abs(outcome), acc)}`;
  const interestRate = acc.interestRate / 100;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => mov * interestRate)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${formateCurrencies(interest, acc)}`;
};
const createUserNames = function (user) {
  return user
    .toLocaleLowerCase()
    .split(' ')
    .map(val => val.at(0))
    .join('');
};

const addUserNames = function () {
  accounts.forEach(
    account => (account.userName = createUserNames(account.owner))
  );
};
addUserNames();
const updateUI = function (acc) {
  displayMovement(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
  diplayDate();
};
let TimerId = null;
const timerStarts = function () {
  const timer = labelTimer.textContent;
  let minutes = parseInt(timer.slice(0, 2));
  let seconds = parseInt(timer.slice(3));
  if (seconds === 0) {
    if (minutes > 0) {
      seconds = 60;
      minutes -= 1;
    }
  }
  seconds -= 1;
  labelTimer.textContent = `${formate(minutes)}:${formate(seconds)}`;
  if (minutes === 0 && seconds === 0) {
    console.log('clearing interval');
    clearInterval(TimerId);
    containerApp.style.opacity = '0';
    labelWelcome.textContent = `Log in to get started!🔑💻`;
  }
};
const login = function (event) {
  event.preventDefault();
  const userName = inputLoginUsername.value;
  const pin = parseInt(inputLoginPin.value);
  const account = accounts.find(acc => {
    return acc.userName === userName && acc.pin === pin;
  });
  if (account) {
    //Call the timer
    clearInterval(TimerId);
    timerStarts();
    TimerId = setInterval(timerStarts, 1000);
    //assign this account to active account
    activeAcount = account;
    //make the two fields to lose thier foucs
    inputLoginUsername.blur();
    inputLoginPin.blur();
    inputLoginUsername.value = inputLoginPin.value = '';
    updateUI(activeAcount);
    containerApp.style.opacity = '1';
    labelWelcome.textContent = `Welcom Back, ${account.owner.split(' ')[0]}🎉`;
  }
};
btnLogin.addEventListener('click', login);
const transferMoney = function (event) {
  event.preventDefault();
  labelTimer.textContent = '05:00';
  const recieverAccount = inputTransferTo.value;
  const moneyAmount = parseInt(inputTransferAmount.value);
  const accountToTransfere = accounts.find(
    acc => acc.userName === recieverAccount
  );
  const isPositive = moneyAmount > 0;
  const hasEnoughMoney = moneyAmount <= activeAcount.balance;
  const sameAccount = accountToTransfere?.userName !== activeAcount.userName;
  if (isPositive && hasEnoughMoney && accountToTransfere && sameAccount) {
    //transfere money to the reciever account
    const currentDate = new Date().toISOString();
    accountToTransfere.movements.push(moneyAmount);
    accountToTransfere.movementsDates.push(currentDate);
    //add this withdrawal to the current account
    activeAcount.movements.push(-moneyAmount);
    activeAcount.movementsDates.push(currentDate);
    updateUI(activeAcount);
    //clear the input field and the foucs
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferTo.blur();
    inputTransferAmount.blur();
  }
};
btnTransfer.addEventListener('click', transferMoney);
const requestLone = function (event) {
  event.preventDefault();
  labelTimer.textContent = '05:00';
  const loanAmount = parseInt(inputLoanAmount.value);
  if (loanAmount > 0) {
    const canTakeLoan = activeAcount.movements.some(
      mov => mov >= loanAmount * (10 / 100)
    );
    if (canTakeLoan) {
      //Adding setTimeOut
      const approveLoan = function () {
        activeAcount.movements.push(loanAmount);
        const currentDate = new Date().toISOString();
        activeAcount.movementsDates.push(currentDate);
        updateUI(activeAcount);
      };
      setTimeout(approveLoan, 2000);
    }
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
};
btnLoan.addEventListener('click', requestLone);
const closeAccount = function (event) {
  event.preventDefault();
  labelTimer.textContent = '05:00';
  const activeUser = activeAcount.userName;
  const activePin = activeAcount.pin;
  const inputUserName = inputCloseUsername.value;
  const inputPin = parseInt(inputClosePin.value);
  //Empty the fields
  inputCloseUsername.value = inputClosePin.value = '';
  if (inputUserName === activeUser && inputPin === activePin) {
    //find the index of the active account
    const activeAcountIndx = accounts.findIndex(
      acc => acc.userName === activeUser
    );
    accounts.splice(activeAcountIndx, 1);
    containerApp.style.opacity = '0';
  }
};
btnClose.addEventListener('click', closeAccount);
let isSorted = false;
const sortTransActions = function () {
  if (isSorted === true) {
    //the array is sorted make it back to orignal state
    isSorted = false;
    displayMovement(activeAcount);
  } else if (isSorted === false) {
    //the movements is not sorted Sort Them!
    displayMovement(activeAcount, true);
    isSorted = true;
  }
};
btnSort.addEventListener('click', sortTransActions);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
