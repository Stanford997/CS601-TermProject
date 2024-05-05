function openTab(evt, tabName) {
    var i, tabcontent, tabbuttons;

    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tabbuttons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].className = tabbuttons[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

document.getElementById('get-trip').addEventListener('click', function () {
    var fromLocation = document.getElementById('from').value;
    var toLocation = document.getElementById('to').value;
    alert('Searching for trips from ' + fromLocation + ' to ' + toLocation);
});

document.querySelectorAll('.alert-category button').forEach(function (button) {
    button.addEventListener('click', function () {
        alert('More information about ' + this.textContent);
    });
});

// fetch from MBTA API to get alerts information
document.addEventListener('DOMContentLoaded', function () {
    const apiKey = 'YourAPIKey';
    const url = 'https://api-v3.mbta.com/alerts';

    fetch(url, {
        headers: {
            'x-api-key': apiKey
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            var data_array = data.data;
            console.info(data_array)
            // Clear existing content
            const subwayContainer = document.querySelector('.alert-category.subway');
            subwayContainer.innerHTML = '<h4>Subway</h4>';
            const busContainer = document.querySelector('.alert-category.local-bus');
            busContainer.innerHTML = '<h4>Bus</h4>';
            const railContainer = document.querySelector('.alert-category.commuter-rail');
            railContainer.innerHTML = '<h4>Commuter Rail</h4>';
            const ferryContainer = document.querySelector('.alert-category.ferry');
            ferryContainer.innerHTML = '<h4>Ferry</h4>';

            let routeNumbers = new Set();
            const railNameDic = ['Fairmount Line', 'Fitchburg Line', 'Framingham/Worcester Line',
                'Franklin/Foxboro Line', 'Greenbush Line', 'Haverhill Line', 'Kingston Line',
                'Lowell Line', 'Middleborough/Lakeville Line', 'Needham Line',
                'Newburyport/Rockport Line', 'Providence/Stoughton Line']
            let railNames = new Set();
            data_array.forEach(alert => {
                // Only get alert with severity >= 6
                if (alert.attributes.severity >= 6) {
                    if (alert.attributes.service_effect.startsWith("Route")) {
                        const routeNumber = parseInt(alert.attributes.service_effect.match(/\d+/)[0]); // Convert to integer for correct sorting
                        routeNumbers.add(routeNumber);
                    }
                }
                if (alert.attributes.severity >= 6) {
                    railNameDic.forEach(railName => {
                        if (alert.attributes.service_effect.includes(railName)) {
                            railNames.add(railName);
                        }
                    });
                }
            });

            // Sort
            routeNumbers = [...routeNumbers].sort((a, b) => a - b);
            railNames = [...railNames].sort((a, b) => a - b);

            const subwayDiv = document.querySelector('.alert-category.subway');
            const localBusDiv = document.querySelector('.alert-category.local-bus');
            const railDiv = document.querySelector('.alert-category.commuter-rail');
            const ferryDiv = document.querySelector('.alert-category.ferry');

            if (localBusDiv) {
                if (routeNumbers.length === 0) {
                    const noAlertsP = document.createElement('p');
                    noAlertsP.textContent = 'There are no high priority bus alerts at this time';
                    localBusDiv.appendChild(noAlertsP);
                } else {
                    routeNumbers.forEach(routeNumber => {
                        const routeButton = document.createElement('button');
                        routeButton.className = 'route-button';
                        routeButton.textContent = routeNumber;
                        localBusDiv.appendChild(routeButton);
                    });
                }
            }

            if (railDiv) {
                if (railNames.length === 0) {
                    const noAlertsP = document.createElement('p');
                    noAlertsP.textContent = 'There are no high priority commuter rail alerts at this time';
                    railDiv.appendChild(noAlertsP);
                } else {
                    railNames.forEach(rail => {
                        const routeButton = document.createElement('button');
                        routeButton.className = 'route-button';
                        routeButton.textContent = rail;
                        railDiv.appendChild(routeButton);
                    });
                }
            }

            const noAlertsP1 = document.createElement('p');
            noAlertsP1.textContent = 'There are no high priority subway alerts at this time';
            const noAlertsP2 = document.createElement('p');
            noAlertsP2.textContent = 'There are no high priority ferry alerts at this time';
            subwayDiv.appendChild(noAlertsP1);
            ferryDiv.appendChild(noAlertsP2);

        })
        .catch(error => {
            console.error('Could not fetch MBTA alerts:', error);
        });
});


/* Dijkstra*/
class Graph {
    constructor() {
        this.vertices = {};
    }

    addVertex(name, edges) {
        this.vertices[name] = edges;
    }

    dijkstra(start, end) {
        const visited = {};
        const distance = {};
        const previous = {};
        const queue = [];

        for (let vertex in this.vertices) {
            distance[vertex] = Infinity;
            previous[vertex] = null;
        }

        distance[start] = 0;

        queue.push(start);

        while (queue.length) {
            const current = queue.shift();
            if (current === end) {
                const path = [];
                let vertex = end;
                while (vertex) {
                    path.push(vertex);
                    vertex = previous[vertex];
                }
                return path.reverse();
            }

            for (let neighbor in this.vertices[current]) {
                const distanceToNeighbor = this.vertices[current][neighbor];
                const totalDistance = distance[current] + distanceToNeighbor;

                if (totalDistance < distance[neighbor]) {
                    distance[neighbor] = totalDistance;
                    previous[neighbor] = current;
                    if (!visited[neighbor]) {
                        queue.push(neighbor);
                    }
                }
            }
            visited[current] = true;
        }
        return [];
    }
}

const route = new Graph();

// Name of stations
const stationNames = [
    "Subway-Green B-Government Center",
    "Subway-Green B-Park Street",
    "Subway-Green B-Boylston",
    "Subway-Green B-Arlington",
    "Subway-Green B-Copley",
    "Subway-Green B-Hynes Convention Center",
    "Subway-Green B-Kenmore",
    "Subway-Green B-Blandford Street",
    "Subway-Green B-Boston University East",
    "Subway-Green B-Boston University Central",
    "Subway-Green B-Amory Street",
    "Subway-Green B-Babcock Street",
    "Subway-Green B-Packard's Corner",
    "Subway-Green B-Harvard Avenue",
    "Subway-Green B-Griggs Street",
    "Subway-Green B-Allston Street",
    "Subway-Green B-Warren Street",
    "Subway-Green B-Washington Street",
    "Subway-Green B-Sutherland Road",
    "Subway-Green B-Chiswick Road",
    "Subway-Green B-Chestnut Hill Avenue",
    "Subway-Green B-South Street",
    "Subway-Green B-Boston College",
    "Subway-Red-Alewife",
    "Subway-Red-Davis",
    "Subway-Red-Porter",
    "Subway-Red-Harvard",
    "Subway-Red-Central",
    "Subway-Red-Kendall/MIT",
    "Subway-Red-Charles/MGH",
    "Subway-Red-Downtown Crossing",
    "Subway-Red-South Station",
    "Subway-Red-Broadway",
    "Subway-Red-Andrew",
    "Subway-Red-JFK/UMass",
    "Subway-Red-North Quincy",
    "Subway-Red-Wollaston",
    "Subway-Red-Quincy Center",
    "Subway-Red-Quincy Adams",
    "Subway-Red-Savin Hill",
    "Subway-Red-Fields Corner",
    "Subway-Red-Shawmut",
    "Bus-66-Nubian",
    "Bus-66-Malcolm X Blvd @ Shawmut Ave",
    "Bus-66-Malcolm X Blvd @ O'Bryant HS",
    "Bus-66-Malcolm X Blvd @ Madison Park HS",
    "Bus-66-Malcolm X Blvd @ Madison Park HS",
    "Bus-66-Malcolm X Blvd @ Tremont St",
    "Bus-66-Tremont St opp Roxbury Crossing Sta",
    "Bus-66-Tremont St @ Tobin Community Center",
    "Bus-66-Tremont St @ Saint Alphonsus St",
    "Bus-66-Tremont St @ Huntington Ave",
    "Bus-66-Huntington Ave @ Fenwood Rd",
    "Bus-66-835 Huntington Ave opp Parker Hill Ave",
    "Bus-66-Huntington Ave @ Riverway",
    "Bus-66-Washington St @ Pearl St",
    "Bus-66-Harvard St @ Kent St",
    "Bus-66-Harvard St @ Aspinwall Ave",
    "Bus-66-Harvard St opp Vernon St",
    "Bus-66-Harvard St @ Beacon St",
    "Bus-66-Harvard St @ Stedman St",
    "Bus-66-Harvard St @ Coolidge St",
    "Bus-66-Harvard St opp Verndale St",
    "Bus-66-Harvard Ave @ Brighton Ave",
    "Bus-66-Brighton Ave opp Quint Ave",
    "Bus-66-Cambridge St opp Hano St",
    "Bus-66-Cambridge St @ Harvard Ave",
    "Bus-66-N Harvard St @ Empire St",
    "Bus-66-N Harvard St @ Oxford St",
    "Bus-66-N Harvard St @ Kingsley St",
    "Bus-66-N Harvard St @ Western Ave",
    "Bus-66-N Harvard St opp Harvard Stadium Gate 2",
    "Bus-66-JFK St @ Eliot St",
    "Bus-66-Massachusetts Ave @ Johnston Gate",
    "Bus-66-arvard Sq @ Garden St - Dawes Island",
];
// Green B Line
route.addVertex("Subway-Green B-Government Center", {"Subway-Green B-Park Street": 1});
route.addVertex("Subway-Green B-Park Street", {
    "Subway-Green B-Government Center": 1,
    "Subway-Green B-Boylston": 1,
    "Subway-Red-Charles/MGH": 1,
    "Subway-Red-Downtown Crossing": 1
});
route.addVertex("Subway-Green B-Boylston", {"Subway-Green B-Park Street": 1, "Subway-Green B-Arlington": 1});
route.addVertex("Subway-Green B-Arlington", {"Subway-Green B-Boylston": 1, "Subway-Green B-Copley": 1});
route.addVertex("Subway-Green B-Copley", {"Subway-Green B-Arlington": 1, "Subway-Green B-Hynes Convention Center": 1});
route.addVertex("Subway-Green B-Hynes Convention Center", {"Subway-Green B-Copley": 1, "Subway-Green B-Kenmore": 1});
route.addVertex("Subway-Green B-Kenmore", {
    "Subway-Green B-Hynes Convention Center": 1,
    "Subway-Green B-Blandford Street": 1
});
route.addVertex("Subway-Green B-Blandford Street", {
    "Subway-Green B-Kenmore": 1,
    "Subway-Green B-Boston University East": 1
});
route.addVertex("Subway-Green B-Boston University East", {
    "Subway-Green B-Blandford Street": 1,
    "Subway-Green B-Boston University Central": 1
});
route.addVertex("Subway-Green B-Boston University Central", {
    "Subway-Green B-Boston University East": 1,
    "Subway-Green B-Amory Street": 1
});
route.addVertex("Subway-Green B-Amory Street", {
    "Subway-Green B-Boston University Central": 1,
    "Subway-Green B-Babcock Street": 1
});
route.addVertex("Subway-Green B-Babcock Street", {
    "Subway-Green B-Amory Street": 1,
    "Subway-Green B-Packard's Corner": 1
});
route.addVertex("Subway-Green B-Packard's Corner", {
    "Subway-Green B-Babcock Street": 1,
    "Subway-Green B-Harvard Avenue": 1
});
route.addVertex("Subway-Green B-Harvard Avenue", {
    "Subway-Green B-Packard's Corner": 1,
    "Subway-Green B-Griggs Street": 1,
    "Bus-66-Harvard St opp Verndale St": 2,
    "Bus-66-Harvard Ave @ Brighton Ave": 2,
});
route.addVertex("Subway-Green B-Griggs Street", {
    "Subway-Green B-Harvard Avenue": 1,
    "Subway-Green B-Allston Street": 1
});
route.addVertex("Subway-Green B-Allston Street", {
    "Subway-Green B-Griggs Street": 1,
    "Subway-Green B-Warren Street": 1
});
route.addVertex("Subway-Green B-Warren Street", {
    "Subway-Green B-Allston Street": 1,
    "Subway-Green B-Washington Street": 1
});
route.addVertex("Subway-Green B-Washington Street", {
    "Subway-Green B-Warren Street": 1,
    "Subway-Green B-Sutherland Road": 1
});
route.addVertex("Subway-Green B-Sutherland Road", {
    "Subway-Green B-Washington Street": 1,
    "Subway-Green B-Chiswick Road": 1
});
route.addVertex("Subway-Green B-Chiswick Road", {
    "Subway-Green B-Sutherland Road": 1,
    "Subway-Green B-Chestnut Hill Avenue": 1
});
route.addVertex("Subway-Green B-Chestnut Hill Avenue", {
    "Subway-Green B-Chiswick Road": 1,
    "Subway-Green B-South Street": 1
});
route.addVertex("Subway-Green B-South Street", {
    "Subway-Green B-Chestnut Hill Avenue": 1,
    "Subway-Green B-Boston College": 1
});
route.addVertex("Subway-Green B-Boston College", {"Subway-Green B-South Street": 1});
// Red Line (Park Street in Green B Line)
route.addVertex("Subway-Red-Alewife", {"Subway-Red-Davis": 1});
route.addVertex("Subway-Red-Davis", {"Subway-Red-Alewife": 1, "Subway-Red-Porter": 1});
route.addVertex("Subway-Red-Porter", {"Subway-Red-Davis": 1, "Subway-Red-Harvard": 1});
route.addVertex("Subway-Red-Harvard", {"Subway-Red-Porter": 1, "Subway-Red-Central": 1});
route.addVertex("Subway-Red-Central", {"Subway-Red-Harvard": 1, "Subway-Red-Kendall/MIT": 1});
route.addVertex("Subway-Red-Kendall/MIT", {"Subway-Red-Central": 1, "Subway-Red-Charles/MGH": 1});
route.addVertex("Subway-Red-Charles/MGH", {"Subway-Red-Kendall/MIT": 1, "Subway-Green B-Park Street": 1});
route.addVertex("Subway-Red-Downtown Crossing", {"Subway-Green B-Park Street": 1, "Subway-Red-South Station": 1});
route.addVertex("Subway-Red-South Station", {"Subway-Red-Downtown Crossing": 1, "Subway-Red-Broadway": 1});
route.addVertex("Subway-Red-Broadway", {"Subway-Red-South Station": 1, "Subway-Red-Andrew": 1});
route.addVertex("Subway-Red-Andrew", {"Subway-Red-Broadway": 1, "Subway-Red-JFK/UMass": 1});
route.addVertex("Subway-Red-JFK/UMass", {"Subway-Red-Andrew": 1, "North Quincy": 1, "Subway-Red-Savin Hill": 1});
route.addVertex("Subway-Red-North Quincy", {"Subway-Red-JFK/UMass": 1, "Subway-Red-Wollaston": 1});
route.addVertex("Subway-Red-Wollaston", {"Subway-Red-North Quincy": 1, "Subway-Red-Quincy Center": 1});
route.addVertex("Subway-Red-Quincy Center", {"Subway-Red-Wollaston": 1, "Subway-Red-Quincy Adams": 1});
route.addVertex("Subway-Red-Quincy Adams", {"Subway-Red-Quincy Center": 1});
route.addVertex("Subway-Red-Savin Hill", {"Subway-Red-JFK/UMass": 1, "Subway-Red-Fields Corner": 1});
route.addVertex("Subway-Red-Fields Corner", {"Subway-Red-Savin Hill": 1, "Subway-Red-Shawmut": 1});
route.addVertex("Subway-Red-Shawmut", {"Subway-Red-Fields Corner": 1});
// Bus 57
route.addVertex("Bus-66-Nubian", {"Bus-66-Malcolm X Blvd @ Shawmut Ave": 1});
route.addVertex("Bus-66-Malcolm X Blvd @ Shawmut Ave", {"Bus-66-Nubian": 1, "Bus-66-Malcolm X Blvd @ O'Bryant HS": 1});
route.addVertex("Bus-66-Malcolm X Blvd @ O'Bryant HS", {
    "Bus-66-Malcolm X Blvd @ Shawmut Ave": 1,
    "Bus-66-Malcolm X Blvd @ Madison Park HS": 1
});
route.addVertex("Bus-66-Malcolm X Blvd @ Madison Park HS", {
    "Bus-66-Malcolm X Blvd @ O'Bryant HS": 1,
    "Bus-66-Malcolm X Blvd @ Tremont St": 1
});
route.addVertex("Bus-66-Malcolm X Blvd @ Tremont St", {
    "Bus-66-Malcolm X Blvd @ Madison Park HS": 1,
    "Bus-66-Tremont St opp Roxbury Crossing Sta": 1
});
route.addVertex("Bus-66-Tremont St opp Roxbury Crossing Sta", {
    "Bus-66-Malcolm X Blvd @ Tremont St": 1,
    "Bus-66-Tremont St @ Tobin Community Center": 1
});
route.addVertex("Bus-66-Tremont St @ Tobin Community Center", {
    "Bus-66-Tremont St opp Roxbury Crossing Sta": 1,
    "Bus-66-Tremont St @ Saint Alphonsus St": 1
});
route.addVertex("Bus-66-Tremont St @ Saint Alphonsus St", {
    "Bus-66-Tremont St @ Tobin Community Center": 1,
    "Bus-66-Tremont St @ Huntington Ave": 1
});
route.addVertex("Bus-66-Tremont St @ Huntington Ave", {
    "Bus-66-Tremont St @ Saint Alphonsus St": 1,
    "Bus-66-Huntington Ave @ Fenwood Rd": 1
});
route.addVertex("Bus-66-Huntington Ave @ Fenwood Rd", {
    "Bus-66-Tremont St @ Huntington Ave": 1,
    "Bus-66-835 Huntington Ave opp Parker Hill Ave": 1
});
route.addVertex("Bus-66-835 Huntington Ave opp Parker Hill Ave", {
    "Bus-66-Huntington Ave @ Fenwood Rd": 1,
    "Bus-66-Huntington Ave @ Riverway": 1
});
route.addVertex("Bus-66-Huntington Ave @ Riverway", {
    "Bus-66-835 Huntington Ave opp Parker Hill Ave": 1,
    "Bus-66-Washington St @ Pearl St": 1
});
route.addVertex("Bus-66-Washington St @ Pearl St", {
    "Bus-66-Huntington Ave @ Riverway": 1,
    "Bus-66-Harvard St @ Kent St": 1
});
route.addVertex("Bus-66-Harvard St @ Kent St", {
    "Bus-66-Washington St @ Pearl St": 1,
    "Bus-66-Harvard St @ Aspinwall Ave": 1
});
route.addVertex("Bus-66-Harvard St @ Aspinwall Ave", {
    "Bus-66-Harvard St @ Kent St": 1,
    "Bus-66-Harvard St opp Vernon St": 1
});
route.addVertex("Bus-66-Harvard St opp Vernon St", {
    "Bus-66-Harvard St @ Aspinwall Ave": 1,
    "Bus-66-Harvard St @ Beacon St": 1
});
route.addVertex("Bus-66-Harvard St @ Beacon St", {
    "Bus-66-Harvard St opp Vernon St": 1,
    "Bus-66-Harvard St @ Stedman St": 1
});
route.addVertex("Bus-66-Harvard St @ Stedman St", {
    "Bus-66-Harvard St @ Beacon St": 1,
    "Bus-66-Harvard St @ Coolidge St": 1
});
route.addVertex("Bus-66-Harvard St @ Coolidge St", {
    "Bus-66-Harvard St @ Stedman St": 1,
    "Bus-66-Harvard St opp Verndale St": 1
});
route.addVertex("Bus-66-Harvard St opp Verndale St", {
    "Bus-66-Harvard St @ Coolidge St": 1,
    "Subway-Green B-Harvard Avenue": 1
});
route.addVertex("Bus-66-Harvard Ave @ Brighton Ave", {
    "Subway-Green B-Harvard Avenue": 1,
    "Bus-66-Brighton Ave opp Quint Ave": 1
});
route.addVertex("Bus-66-Brighton Ave opp Quint Ave", {
    "Bus-66-Harvard Ave @ Brighton Ave": 1,
    "Bus-66-Cambridge St opp Hano St": 1
});
route.addVertex("Bus-66-Cambridge St opp Hano St", {
    "Bus-66-Brighton Ave opp Quint Ave": 1,
    "Bus-66-Cambridge St @ Harvard Ave": 1
});
route.addVertex("Bus-66-Cambridge St @ Harvard Ave", {
    "Bus-66-Cambridge St opp Hano St": 1,
    "Bus-66-N Harvard St @ Empire St": 1
});
route.addVertex("Bus-66-N Harvard St @ Empire St", {
    "Bus-66-Cambridge St @ Harvard Ave": 1,
    "Bus-66-N Harvard St @ Oxford St": 1
});
route.addVertex("Bus-66-N Harvard St @ Oxford St", {
    "Bus-66-N Harvard St @ Empire St": 1,
    "Bus-66-N Harvard St @ Kingsley St": 1
});
route.addVertex("Bus-66-N Harvard St @ Kingsley St", {
    "Bus-66-N Harvard St @ Oxford St": 1,
    "Bus-66-N Harvard St @ Western Ave": 1
});
route.addVertex("Bus-66-N Harvard St @ Western Ave", {
    "Bus-66-N Harvard St @ Kingsley St": 1,
    "Bus-66-N Harvard St opp Harvard Stadium Gate 2": 1
});
route.addVertex("Bus-66-N Harvard St opp Harvard Stadium Gate 2", {
    "Bus-66-N Harvard St @ Western Ave": 1,
    "Bus-66-JFK St @ Eliot St": 1
});
route.addVertex("Bus-66-JFK St @ Eliot St", {
    "Bus-66-N Harvard St opp Harvard Stadium Gate 2": 1,
    "Bus-66-Massachusetts Ave @ Johnston Gate": 1
});
route.addVertex("Bus-66-Massachusetts Ave @ Johnston Gate", {
    "Bus-66-JFK St @ Eliot St": 1,
    "Bus-66-arvard Sq @ Garden St - Dawes Island": 1
});
route.addVertex("Bus-66-arvard Sq @ Garden St - Dawes Island", {"Bus-66-Massachusetts Ave @ Johnston Gate": 1});

document.getElementById('get-trip').addEventListener('click', function () {
    const fromStation = document.getElementById('from').value.trim();
    const toStation = document.getElementById('to').value.trim();

    if (fromStation && toStation) {
        const path = route.dijkstra(fromStation, toStation);
        const resultsDiv = document.getElementById('results');
        if (path.length > 0) {
            // Format the path
            const formattedPath = formatPath(path);
            resultsDiv.innerHTML = "Shortest path:<br><pre>" + formattedPath + "</pre>";
        } else {
            resultsDiv.innerHTML = "No path found between " + fromStation + " and " + toStation;
        }
    } else {
        alert("Please enter both a starting and a destination station.");
    }
});

// FormatPath
function formatPath(path) {
    let formattedPath = '';
    let currentPrefix = '';
    path.forEach((stop, index) => {
        const splitStop = stop.split('-');
        const prefix = splitStop[0] + '-' + splitStop[1];
        const stopName = splitStop.slice(2).join('-').trim();

        // Prefix
        let lineClass = '';
        if (prefix.startsWith('Bus')) {
            lineClass = 'bus-line';
        } else if (prefix.includes('Red')) {
            lineClass = 'red-line';
        } else if (prefix.includes('Green B')) {
            lineClass = 'green-b-line';
        }

        if (prefix !== currentPrefix) {
            if (currentPrefix !== '') {
                formattedPath += '</div></div>';
            }
            currentPrefix = prefix;
            formattedPath += `<div class="line"><span class="line-title">${prefix}:</span><div class="stops ${lineClass}">`;
        }
        formattedPath += `<button class="stop-name">${stopName}</button>`;
    });
    formattedPath += '</div></div>';
    return formattedPath;
}

document.addEventListener('DOMContentLoaded', function () {
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');
    const fromSuggestions = document.getElementById('from-suggestions');
    const toSuggestions = document.getElementById('to-suggestions');

    function filterStations(input, suggestionsDiv) {
        const value = input.value.toLowerCase();
        const filteredStations = stationNames.filter(station => station.toLowerCase().includes(value));
        suggestionsDiv.innerHTML = '';
        filteredStations.forEach(station => {
            const div = document.createElement('div');
            div.textContent = station;
            div.onclick = function () {
                input.value = station;
                suggestionsDiv.style.display = 'none';
            };
            suggestionsDiv.appendChild(div);
        });
        suggestionsDiv.style.display = filteredStations.length ? 'block' : 'none';
    }

    fromInput.addEventListener('input', () => filterStations(fromInput, fromSuggestions));
    toInput.addEventListener('input', () => filterStations(toInput, toSuggestions));

    document.addEventListener('click', function (e) {
        if (!fromInput.contains(e.target)) {
            fromSuggestions.style.display = 'none';
        }
        if (!toInput.contains(e.target)) {
            toSuggestions.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const routeButtonsDiv = document.querySelector('.route-buttons');

    if (localStorage.getItem('visitedGreenBLine')) {
        const button = document.createElement('button');
        button.className = 'route-button green';
        button.textContent = 'Green Line B';
        button.onclick = function () {
            window.location.href = 'green_b_line.html';
        };
        routeButtonsDiv.appendChild(button);
    }
});


const images = document.querySelectorAll('.New img');

images.forEach(image => {
    image.addEventListener('mouseenter', () => {
        zoomIn(image);
    });

    image.addEventListener('mouseleave', () => {
        zoomOut(image);
    });
});

function zoomIn(element) {
    element.style.transform = "scale(1.1)";
    element.style.transition = "transform 0.3s ease-in-out";
}

function zoomOut(element) {
    element.style.transform = "scale(1)";
}


const feedbackButton = document.getElementById('feedback-button');
const policeButton = document.getElementById('police-button');

feedbackButton.addEventListener('click', () => {
    fetch('https://MBTA/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({feedback: 'Your feedback message'})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Feedback sent successfully!');
        })
        .catch(error => {
            console.error('Error sending feedback:', error);
            alert('Failed to send feedback. Please try again later.');
        });
});

policeButton.addEventListener('click', () => {
    fetch('https://MBTA/police', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({message: 'Emergency message'})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Contacted MBTA Transit Police successfully!');
        })
        .catch(error => {
            console.error('Error contacting police:', error);
            alert('Failed to contact MBTA Transit Police. Please try again later.');
        });
});