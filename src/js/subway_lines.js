document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector('.search-bar input');
    const lines = document.querySelectorAll('.line');

    searchInput.addEventListener('input', function () {
        const searchValue = this.value.toLowerCase();

        lines.forEach(line => {
            const lineName = line.dataset.line.toLowerCase();
            if (lineName.startsWith(searchValue)) {
                line.style.display = '';
            } else {
                line.style.display = 'none';
            }
        });
    });
});

// Only click Green B Line then go to next page, else alert
const elementsToBlock = document.querySelectorAll('[data-line]:not([data-line="Green"])');

elementsToBlock.forEach(element => {
    element.addEventListener('click', () => {
        alert('The page is under construction, please try Green B Line.');
    });
});
const greenElements = document.querySelectorAll('[data-line="Green"]');
greenElements.forEach(element => {
    element.addEventListener('click', () => {
        window.location.href = element.getAttribute('href');
    });
});