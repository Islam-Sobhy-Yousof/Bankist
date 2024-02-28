'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Mohamed Sobhy',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};
const account2 = {
  owner: 'Islam Sobhy',
  movements: [987, 852, 951, 753, 357, -10],
  interestRate: 1,
  pin: 2222,
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

const createMovement = function (mov, i, moveType) {
  const move = `<div class="movements__row">
          <div class="movements__type movements__type--${moveType}">${
    i + 1
  } ${moveType}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}€</div>
        </div>`;
  containerMovements.insertAdjacentHTML('afterbegin', move);
};
const displayMovement = function (movements,sort = false) {
  //Clear the content of the movements container
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a,b) => a - b):movements;
  movs.forEach(function (mov, i) {
    const moveType = mov > 0 ? 'deposit' : 'withdrawal';
    createMovement(mov, i, moveType);
  });
};
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov);
  labelBalance.textContent = `${acc.balance}💶`;
};
const calcDisplaySummary = function (account) {
  const incom = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  const outcome = account.movements
    .filter(mov => mov <= 0)
    .reduce((acc, mov) => acc + mov);
  //Display the values on the labels
  labelSumIn.textContent = `${incom}€`;
  labelSumOut.textContent = `${Math.abs(outcome)}€`;
  const interestRate = account.interestRate / 100;
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => mov * interestRate)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${interest.toFixed(3)}€`;
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
  displayMovement(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};
let activeAcount = null;
let sortedMovements = null;
let unsortedMovements = null;
const login = function (event) {
  event.preventDefault();
  const userName = inputLoginUsername.value;
  const pin = parseInt(inputLoginPin.value);
  const account = accounts.find(acc => {
    return acc.userName === userName && acc.pin === pin;
  });
  if (account) {
    //assign this account to active account
    activeAcount = account;
    sortedMovements = activeAcount.movements
      .map(mov => mov)
      .sort((a, b) => a - b);
    unsortedMovements = activeAcount.movements.map(mov => mov);
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
    accountToTransfere.movements.push(moneyAmount);
    //add this withdrawal to the current account
    activeAcount.movements.push(-moneyAmount);
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
  const loanAmount = parseInt(inputLoanAmount.value);
  if (loanAmount > 0) {
    const canTakeLoan = activeAcount.movements.some(
      mov => mov >= loanAmount * (10 / 100)
    );
    if (canTakeLoan) {
      activeAcount.movements.push(loanAmount);
      updateUI(activeAcount);
    }
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
};
btnLoan.addEventListener('click', requestLone);
const closeAccount = function (event) {
  event.preventDefault();
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
    displayMovement(activeAcount.movements);
  } else if (isSorted === false) {
    //the movements is not sorted Sort Them!
    displayMovement(activeAcount.movements,true);
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
