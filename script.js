const countryInput = document.getElementById("country-input");
const searchBtn = document.getElementById("search-btn");
const loadingSpinner = document.getElementById("loading-spinner");
const countryInfo = document.getElementById("country-info");
const borderingCountries = document.getElementById("bordering-countries");
const errorMessage = document.getElementById("error-message");

async function fetchCountry(countryName) {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);

    if (!response.ok) {
        throw new Error("Country not found");
    }

    const data = await response.json();
    return data;
}

async function fetchBorderCountry(code) {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);

    if (!response.ok) {
        throw new Error("Border country not found");
    }

    const data = await response.json();
    return data;
}

function displayCountry(country) {
    countryInfo.innerHTML = `
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="150">
    `;
}

async function displayBorderCountries(borders) {
    borderingCountries.innerHTML = "";

    if (!borders || borders.length === 0) {
        return;
    }

    for (const code of borders) {
        const borderData = await fetchBorderCountry(code);
        const borderCountry = borderData[0];

        borderingCountries.innerHTML += `
            <div>
                <h3>${borderCountry.name.common}</h3>
                <img src="${borderCountry.flags.png}" alt="Flag of ${borderCountry.name.common}" width="100">
            </div>
        `;
    }
}

async function searchCountry() {
    const countryName = countryInput.value.trim();

    countryInfo.innerHTML = "";
    borderingCountries.innerHTML = "";
    errorMessage.textContent = "";
    loadingSpinner.classList.remove("hidden");

    try {
        if (countryName === "") {
            throw new Error("Please enter a country name");
        }

        const data = await fetchCountry(countryName);
        const country = data[0];

        displayCountry(country);
        await displayBorderCountries(country.borders);
    } catch (error) {
        errorMessage.textContent = error.message;
    } finally {
        loadingSpinner.classList.add("hidden");
    }
}

searchBtn.addEventListener("click", searchCountry);

countryInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchCountry();
    }
});