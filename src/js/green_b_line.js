// Mouseover change text color
const stationNames = document.querySelectorAll('.station-name');
stationNames.forEach(station => {
    station.addEventListener('mouseover', () => {
        station.style.color = 'green';
    });

    station.addEventListener('mouseleave', () => {
        station.style.color = '';
    });
});


const subwayMap = document.getElementById('subwayMap');
const googleMap = document.getElementById('googleMap');
const switchButton = document.getElementById('switchButton');
let tooltip = null;

// Show hint if mouseover image
const displayTooltip = (event) => {
    if (tooltip) {
        tooltip.remove();
    }

    tooltip = document.createElement('div');
    tooltip.textContent = 'Click to switch to Google Maps';
    tooltip.style.position = 'fixed';
    tooltip.style.top = `${event.clientY}px`;
    tooltip.style.left = `${event.clientX + 20}px`;
    tooltip.style.backgroundColor = '#ffffff';
    tooltip.style.padding = '5px';
    tooltip.style.border = '1px solid #000000';
    document.body.appendChild(tooltip);

    // Remove hint after a delay
    setTimeout(() => {
        tooltip.remove();
    }, 2000);
};

subwayMap.addEventListener('mousemove', displayTooltip);


const switchToGoogleMap = () => {
    subwayMap.style.display = 'none';
    googleMap.style.display = 'block';
    googleMap.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12499.338309782476!2d-71.07875599208888!3d42.34701664811187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e379f63f253f6d%3A0x3d0b1b4956e5f3bd!2sGovernment%20Center!5e0!3m2!1sen!2sus!4v1638279630550!5m2!1sen!2sus';
    switchButton.style.display = 'block';
};

const switchToOriginalImage = () => {
    subwayMap.style.display = 'block';
    googleMap.style.display = 'none';
    switchButton.style.display = 'none';
};

// Switch to google map
subwayMap.addEventListener('click', switchToGoogleMap);

// Switch back
googleMap.addEventListener('click', switchToOriginalImage);

// Switch back
switchButton.addEventListener('click', switchToOriginalImage);