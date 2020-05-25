const form = document.getElementById('form');
const card = document.getElementById('card');
const cvv = document.getElementById('cvv');
const date = document.getElementById('date');
const btn = document.getElementById("addCard")
const cardTypeImg = document.getElementById('cardTypeImage');
const table = document.getElementById('saved-cards-table');
var allCards = JSON.parse(localStorage.getItem("Data")) || {};
var cardTypeGlobal = ''


const cardTypeValidationConst = {
  "Visa": { type: '^4[0-9]{6,}$', cvv: '3', date: '', cardlength: '16', cardIcon: 'visa.jpeg' },
  "MasterCard": { type: '^5[1-5][0-9]{5,}|222[1-9][0-9]{3,}|22[3-9][0-9]{4,}|2[3-6][0-9]{5,}|27[01][0-9]{4,}|2720[0-9]{3,}$', cvv: '3', date: '', cardlength: '16', cardIcon: 'masterCard.png' },
  "American Express": { type: '^3[47][0-9]{5,}$', cvv: '4', date: '', cardlength: '15', cardIcon: 'americanExp.jpeg' },
  "Diners Club": { type: '^3(?:0[0-5]|[68][0-9])[0-9]{4,}$', cvv: '3', date: '', cardlength: '16', cardIcon: 'dinnersClub.jpeg' },
  "Discover": { type: '^6(?:011|5[0-9]{2})[0-9]{3,}$', cvv: '3', date: '', cardlength: '19', cardIcon: 'discover.png' },
  "JCB": { type: '^(?:2131|1800|35[0-9]{3})[0-9]{3,}$', cvv: '3', date: '', cardlength: '19', cardIcon: 'jcb.png' }
}

/**
* after dom loaded, check if anycard is available in local list
* if length more than 0 , render table else show no cards available
*/
document.addEventListener('DOMContentLoaded', event => {
  if (Object.keys(allCards).length > 0)
    renderTable(allCards)
  ifNoData(allCards)
})

/**
* @desc renderTable takes all cards available, and render table dynamically
* @param allCards-list of cards
*/
function renderTable(allCards) {
  for (key in allCards) {
    createRow(key, allCards[key])
  }
}


/**
* @desc createRow creates row dynamically and add 'X' for delete
* @param key-used to add as id for 'X' delete
* @obj data for 1 row(single card data)
*/
function createRow(key, obj) {
  var tr = document.createElement('tr');
  for (keys in obj) {
    var td = document.createElement('td');
    td.innerHTML = obj[keys];
    tr.append(td);
  }
  var td = document.createElement('td');
  td.setAttribute('id', key);
  td.addEventListener('click', (e) => {
    deleteRow(e)

  })
  td.innerHTML = 'X';
  tr.append(td)
  table.append(tr);
}

/**
* @desc ifNoData  used to switch between no card found conatiner and table container
* @param allCards-lsit of cards
*/
function ifNoData(allCards) {
  let tableWrapper = document.getElementsByClassName('table-wrapper')[0];
  let noCards = document.getElementById('no-card');
  if (Object.keys(allCards).length == 0) {
    tableWrapper.classList.add('display-none')
    if (noCards.classList.contains('display-none'))
      noCards.classList.remove('display-none')
  }
  else {
    if (tableWrapper.classList.contains('display-none'))
      tableWrapper.classList.remove('display-none')
    noCards.classList.add('display-none')
  }

}

/**
* @desc deleteRow -on click of 'X' deletes the row using id attached to 'X'
*and also update data in local storage
*and check if after delete no data available show no card dound container
* @param e-click event
*/
function deleteRow(e) {
  let currentRow = e.srcElement.parentElement;
  let id_row = e.srcElement.id
  let parent = e.srcElement.parentElement.parentElement
  parent.removeChild(currentRow)

  //also update data in localStorage
  for (key in allCards) {
    if (key == id_row) {
      delete allCards[key]
      break
    }
  }
  ifNoData(allCards)
  localStorage.setItem('Data', JSON.stringify(allCards))
}



/**
* @desc checkCardType- checks what type of card
* @return card type if availble in obj else false
*/
function checkCardType(value) {
  for (key in cardTypeValidationConst) {
    type = new RegExp(cardTypeValidationConst[key].type);
    if (type.test(value)) {
      return key;
    }
  }
  return false
}


/**
* @desc cardTypeValidation
* check card type after 4 input by calling checkCardType
* check for length of the card as specified in JSON eg. for Discover max length can be 19
* for different cards its different
* set image icon if card is in the configuration json 
@param e click event to get typed value
*/
function cardValidation(e) {
  let cardValue = e.srcElement.value
  if (cardValue.length >= 4) {
    cardType = checkCardType(cardValue)
    if (cardType) {
      cardTypeGlobal = cardType;
      if (cardTypeImg.classList.contains('display-none'))
        cardTypeImg.classList.remove('display-none')
      //set icon for cars
      cardTypeImg.setAttribute('alt', cardType)
      cardTypeImg.setAttribute('src', './assets/' + cardTypeValidationConst[cardType].cardIcon)
      let cardTypeStatus = checkLength(card, 15, cardTypeValidationConst[cardType].cardlength);

      //once card is valid,enabled cvv and date
      if (cardTypeStatus) {
        //enables other fields
        cvv.removeAttribute('disabled');
        date.removeAttribute('disabled')
      }
      else {
        cvv.setAttribute("disabled", true);
        date.setAttribute("disabled", true)
      }
    }
    else {
      //no card type found,hide image as well to avoid empty layout
      cardTypeImg.classList.add('display-none')
      cardTypeGlobal = ''
    }

  }
}

/**
* @desc cvvValidation -on key press in cvv checks length of the cvv
* for differnt cards ,length varies as mentioned in card configuration
*/
function cvvValidation(e) {
  checkLength(cvv, 3, cardTypeValidationConst[cardTypeGlobal].cvv);
}

/**
* @validate allows only digits to enter in input field
*/
function validate(evt) {
  var theEvent = evt || window.event;

  // Handle paste
  if (theEvent.type === 'paste') {
    key = event.clipboardData.getData('text/plain');
  } else {
    // Handle key press
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
  }
  var regex = /[0-9]|\./;

  if (!regex.test(key)) {
    theEvent.returnValue = false;
    if (theEvent.preventDefault) theEvent.preventDefault();
  }
}

/**
* @showError to show error for input field
* @param input -field
* @message message to show
*/
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = 'form-control error';
  const small = formControl.querySelector('small');
  small.innerText = message;
  input.removeAttribute("valid")
}

/**
* @showSuccess to show error for field
* @param input field name
*/
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = 'form-control success';
  input.setAttribute("valid", true)
}


/**
* @checkLength used to check required length 
* and show and error message accordingly
*/
function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} must be more than ${min} characters`
    );
  }
  else {
    if (input.value.length > max) {
      showError(
        input,
        `${getFieldName(input)} must be less than ${max} characters`
      );
      return false;
    } else {
      showSuccess(input);
      if (input.value.length == max) {
        showSuccess(input);
        return true
      }
      return false;
    }
  }
}


/**
* on form submit calls add row to add new row
* update data in local Storage
* once submit done remove field values and make button disabled
*/
form.addEventListener('submit', function (e) {
  e.preventDefault();
  let obj = {}
  obj["cardValue"] = card.value;
  obj["cvvValue"] = '***';
  obj["date"] = date.value;

  let key;
  if (allCards) {
    min = 0
    for (key in allCards) {
      min = Math.max(min, key)
    }
    key = min + 1
  } else {
    key = 1
  }

  allCards[key] = (obj)
  createRow(key, allCards[key]);
  ifNoData(allCards)
  localStorage.setItem("Data", JSON.stringify(allCards));
  resetForm();
})

/**
*@desc used to reset form
*/
function resetForm() {
  cvv.value = '';
  card.value = '';
  date.value = '';
  cardTypeGlobal = '';
  cardTypeImg.classList.add('display-none')

  btn.classList.add('button-disabled')
  //remove class as well
  let allForm = document.getElementsByClassName('form-control success');
  for (i = 0; i < allForm.length; i++) {
    allForm[i].classList.remove('success');
  }
}

/**
*@desc buttonStatus - on every individual field input if form valid enable button 
* else disabled
*/
function buttonStatus() {
  if (card.hasAttribute('valid') && cvv.hasAttribute('valid') && date.hasAttribute('valid')) {
    if (btn.classList.contains('button-disabled'))
      btn.classList.remove('button-disabled')
  }
  else {
    btn.classList.add('button-disabled')

  }
}

/**
*@desc normalizeYear -used to check year in date input Field
*/
function normalizeYear(year) {
  // Century fix
  var YEARS_AHEAD = 20;
  if (year < 100) {
    var nowYear = new Date().getFullYear();
    year += Math.floor(nowYear / 100) * 100;
    if (year > nowYear + YEARS_AHEAD) {
      year -= 100;
    } else if (year <= nowYear - 100 + YEARS_AHEAD) {
      year += 100;
    }
  }
  return year;
}

/**
*@desc checkExp -used to take valid format of date and check whether valid or not
*/
function checkExp(e) {
  var match = e.srcElement.value.match(/^\s*(0?[1-9]|1[0-2])\/(\d\d|\d{4})\s*$/);
  if (!match) {
    showError(
      date,
      `Invalid format!`
    );
    return;
  }
  var exp = new Date(normalizeYear(1 * match[2]), 1 * match[1] - 1, 1).valueOf();
  var now = new Date();
  var currMonth = new Date(now.getFullYear(), now.getMonth(), 1).valueOf();
  if (exp <= currMonth) {
    showError(
      date,
      `Invalid`
    );
  } else {
    showSuccess(
      date
    );
  };
}
