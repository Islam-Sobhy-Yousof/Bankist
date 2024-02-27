'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
const account5 = {
  owner: 'Islam Sobhy',
  movements: [987, 852, 951, 753, 357],
  interestRate: 1,
  pin: 5555,
};
const accounts = [account1, account2, account3, account4, account5];

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
  const tmpContainer = document.createElement('div');
  tmpContainer.innerHTML = move.trim();
  const appendedChild = tmpContainer.firstElementChild;
  containerMovements.appendChild(appendedChild);
};
const displayMovement = function (movements) {
  //Clear the content of the movements container
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const moveType = mov > 0 ? 'deposit' : 'withdrawal';
    createMovement(mov, i, moveType);
  });
};
const calcDisplayBalance = function (movements) {
  const totalBalance = movements.reduce((acc, mov) => acc + mov);
  labelBalance.textContent = `${totalBalance}💶`;
};
const calcDisplaySummary = function (account) {
  const incom = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  const outcome = movements
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
const login = function (event) {
  event.preventDefault();
  const userName = inputLoginUsername.value;
  const pin = parseInt(inputLoginPin.value);
  const account = accounts.find(acc => {
    return acc.userName === userName && acc.pin === pin;
  });
  if (account) {
    //make the two fields to lose thier foucs
    inputLoginUsername.blur();
    inputLoginPin.blur();
    inputLoginUsername.value = inputLoginPin.value = '';
    displayMovement(account.movements);
    calcDisplayBalance(account.movements);
    calcDisplaySummary(account);
    containerApp.style.opacity = '1';
    labelWelcome.textContent = `Welcom Back, ${account.owner.split(' ')[0]}🎉`;
  }
};
btnLogin.addEventListener('click', login);
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
