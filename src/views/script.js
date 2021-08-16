function isValidDate(dateString)
{
    // First check for the pattern
    var regex_date = /^\d{4}\-\d{1,2}\-\d{1,2}$/;

    if(!regex_date.test(dateString))
    {
        return false;
    }

    // Parse the date parts to integers
    var parts   = dateString.split("-");
    var day     = parseInt(parts[2], 10);
    var month   = parseInt(parts[1], 10);
    var year    = parseInt(parts[0], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
    {
        return false;
    }

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
    {
        monthLength[1] = 29;
    }

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}


document.addEventListener('DOMContentLoaded', (event) => { 
  const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  const form = document.getElementById('submit-form')
  const email = document.getElementById('email')
  const password = document.getElementById('password')
  const confirmPassword = document.getElementById('confirm-password')
  const age = document.getElementById('age')
  const submitBtn = document.getElementById('submit-btn')

  submitBtn.addEventListener('click', (evt) => {
    console.log('haha')
    if (regexEmail.test(email.value) && password.value == confirmPassword.value && regexPassword.test(password.value) && isValidDate(age.value)) {
      form.submit()
    } else {
      console.log('Email ou passwd invalide.')
    }
  })
})