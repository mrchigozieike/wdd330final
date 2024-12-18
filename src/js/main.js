document.addEventListener("DOMContentLoaded", async () => {
  // Function to dynamically load the header and footer into a page
  const loadHeaderFooter = async () => {
    try {
      const headerTemplate = await fetch('../partials/header.html').then(res => res.text());
      const headerElement = document.querySelector('#main-header');

      const footerTemplate = await fetch('../partials/footer.html').then(res => res.text());
      const footerElement = document.querySelector('#main-footer');

      if (headerElement) headerElement.innerHTML = headerTemplate;
      if (footerElement) footerElement.innerHTML = footerTemplate;
    } catch (error) {
      console.error("Error loading header or footer:", error);
    }
  };

  await loadHeaderFooter(); // Load header and footer when the DOM is ready

  // Existing logic to fetch and display recipes
  const fetchRecipes = async () => {
    const apiUrl = "https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood";

    try {
      // Fetch the data from the API
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the JSON data
      const data = await response.json();

      // Call the function to display the recipes
      displayRecipes(data.meals);

      // Load details of the first recipe
      if (data.meals && data.meals.length > 0) {
        fetchRecipeDetails(data.meals[0].idMeal);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      displayErrorMessage("Failed to load recipes. Please try again later.");
    }
  };

  const fetchRecipeDetails = async (id) => {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

    try {
      // Fetch the detailed data for the recipe
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the JSON data
      const data = await response.json();

      // Call the function to display the recipe details
      displayRecipeDetails(data.meals[0]);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      displayErrorMessage("Failed to load recipe details. Please try again later.");
    }
  };

  const displayRecipes = (recipes) => {
    const recipeContainer = document.getElementById("recipe-container");

    // Clear the container
    recipeContainer.innerHTML = "";

    recipes.forEach((recipe) => {
      const recipeCard = document.createElement("div");
      recipeCard.classList.add("recipe-card");
      recipeCard.dataset.id = recipe.idMeal; // Store the recipe ID in a data attribute

      const recipeImage = document.createElement("img");
      recipeImage.src = recipe.strMealThumb;
      recipeImage.alt = recipe.strMeal;
      recipeImage.classList.add("recipe-image");

      const recipeName = document.createElement("h3");
      recipeName.textContent = recipe.strMeal;
      recipeName.classList.add("recipe-name");

      // Append image and name to the card
      recipeCard.appendChild(recipeImage);
      recipeCard.appendChild(recipeName);

      // Add an onclick listener to the recipe card
      recipeCard.addEventListener("click", () => {
        const recipeId = recipe.idMeal; // Get the recipe ID
        fetchRecipeDetails(recipeId); // Fetch and display recipe details
      });

      // Append the card to the container
      recipeContainer.appendChild(recipeCard);
    });
  };

  const displayRecipeDetails = (meal) => {
    const detailsContainer = document.getElementById("details-container");

    if (!detailsContainer) {
      console.error("No element with id 'details-container' found.");
      return;
    }

    // Clear previous details
    detailsContainer.innerHTML = "";

    // Create and append elements for meal details
    const mealName = document.createElement("h2");
    mealName.textContent = meal.strMeal;

    const mealImage = document.createElement("img");
    mealImage.src = meal.strMealThumb;
    mealImage.alt = meal.strMeal;

    const mealCategory = document.createElement("p");
    mealCategory.textContent = `Category: ${meal.strCategory}`;

    const mealArea = document.createElement("p");
    mealArea.textContent = `Cuisine: ${meal.strArea}`;

    const mealInstructions = document.createElement("p");
    mealInstructions.textContent = `Instructions: ${meal.strInstructions}`;

    detailsContainer.appendChild(mealName);
    detailsContainer.appendChild(mealImage);
    detailsContainer.appendChild(mealCategory);
    detailsContainer.appendChild(mealArea);
    detailsContainer.appendChild(mealInstructions);
  };

  const displayErrorMessage = (message) => {
    const recipeContainer = document.getElementById("recipe-container");
    recipeContainer.innerHTML = `<p class="error-message">${message}</p>`;
  };

  // Fetch and display recipes when the page loads
  fetchRecipes();
});
