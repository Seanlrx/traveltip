// Bootstrap javascript to validate the input data from the forms
(function () {
    'use strict'

    // File-input-button1.2 run the javascript code to trigger this button feature of showing file names
    bsCustomFileInput.init()

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()