Payment Gateway

This project is done using  Javascript,html and css.

Any framework or any plugin has not been used.

run -
1.can easily run using http-server
2.install - npm i http-server
2.run  'http-server .' in terminal .


Functionality-

1.A form where the user can enter the credit card details like Card Number,
CVV and Expiry Date as well.
  a.CVV Masking: CVV should not be plain-text.
  b.Auto-tab used
2.Save the card details and show a list of saved cards when the user lands on
the page again. (eg; on browser refresh)
3.User should be able to delete already saved cards

validation -
1.User enters the card number first and then the other fields (CVV,
Expiry Date)
2.When user types the card number, detect the card type (Visa, Master,Maestro) and display it alongside. (showing icon and alt text as well)
    a.have added a cardConfigguartion json ,as per the json validation done
    b.added 4-5 types card with different cvv number length and differet card length
3.Validation if card number has required length (each card type has a specific length)
4.Validation for  expiry date added
5.validation for cvv number