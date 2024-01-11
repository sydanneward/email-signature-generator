
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('emailForm');
    const imgPlaceholder = '[PhotoUpload]'; // Placeholder in your HTML template

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        var name = document.getElementById('name').value.toUpperCase(); // Capitalize the name
        var title = document.getElementById('title').value;
        var rsaphone = document.getElementById('rsaphone').value;
        var cellphone = document.getElementById('cellphone').value;
        var agentlicense = document.getElementById('agentlicense').value;
        var rsalicense = document.getElementById('rsalicense').value;

        // Add "C: " in front of the "Cell Phone" field
        if (cellphone) {
            cellphone = 'C: ' + formatcellphone(cellphone);
        }

        // Add "#" in front of the "Agent License Number" field
        if (agentlicense) {
            agentlicense = '#' + agentlicense;
        }

        // Get checkbox values
        var showCellphone = document.getElementById('cellphoneCheckbox').checked;
        var showAgentLicense = document.getElementById('agentlicenseCheckbox').checked;

        document.addEventListener('DOMContentLoaded', function() {
            fetchImages();
        });  

        // Handle photo upload
        const photoInput = document.getElementById('photoUpload');
        let base64Image = '';
        if (photoInput.files && photoInput.files[0]) {
            const imgFile = photoInput.files[0];
            base64Image = await getBase64(imgFile);
        }

        // Fetch and process the template
        fetch('es-template.html')
            .then(response => response.ok ? response.text() : Promise.reject('Failed to load template'))
            .then(html => {
var tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Set the photo source directly to the URL
            var photodropdown = document.getElementById('photodropdown');
            var selectedPhotoUrl = photodropdown.options[photodropdown.selectedIndex].value;
            tempDiv.querySelector('#photodropdown').src = selectedPhotoUrl;

            // Replace placeholders with user-specific data
            tempDiv.querySelector('#nameOutput').textContent = name;
            tempDiv.querySelector('#titleOutput').textContent = title;
            tempDiv.querySelector('#rsaphoneOutput').textContent = rsaphone;
            tempDiv.querySelector('#rsalicense').textContent = rsalicense;

            // Conditionally show/hide elements based on checkboxes
            if (showCellphone) {
                tempDiv.querySelector('#cellphoneOutput').textContent = cellphone;
            } else {
                tempDiv.querySelector('#cellphoneOutput').style.display = 'none';
            }

            if (showAgentLicense) {
                tempDiv.querySelector('#agentlicense').textContent = agentlicense;
            } else {
                tempDiv.querySelector('#agentlicense').style.display = 'none';
            }

            // Replace the content of the signatureOutput div with the modified HTML
            document.getElementById('signatureOutput').innerHTML = tempDiv.innerHTML;
                    })
            .catch(error => console.error('Error:', error));
    });
});

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

function formatcellphone(cellphone) {
    // Format the phone number with dashes
    return cellphone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
}
