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

        // Handle photo upload
        const photoInput = document.getElementById('photoUpload');
        let base64Image = '';
        if (photoInput.files && photoInput.files[0]) {
            const imgFile = photoInput.files[0];
            base64Image = await getBase64(imgFile); // Use await here
        }

        // Fetch and process the template
        try {
            const response = await fetch('es-template.html');
            if (!response.ok) {
                throw new Error('Failed to load template');
            }
            const html = await response.text();
            
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Set the photo source directly to the URL
            if (base64Image) {
                tempDiv.querySelector('#photoUpload').src = base64Image; // Make sure you have an img element with this ID in your template
            }

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

            document.getElementById('signatureOutput').innerHTML = tempDiv.innerHTML;
        } catch (error) {
            console.error('Error:', error);
        }
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
