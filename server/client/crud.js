document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const restaurantsContainer = document.getElementById("restaurants-container");

    // Función para recargar la página
const reloadPage = () => {
  window.location.reload();
};

  // Función para mostrar el modal de agregar calificación y comentario
 const showRatingModal = (restaurantId) => {
  const modal = document.getElementById("modal");
  const ratingForm = document.getElementById("rating-form");
  const closeModalBtn = document.querySelector(".close");
  const saveRatingBtn = document.getElementById("save-rating-btn");

  

  const onSaveRatingBtnClick = async (event) => {
    event.preventDefault();
    const rating = document.getElementById("rating").value;
    const comment = document.getElementById("comment").value;

    // Enviar la calificación y comentario al servidor
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment }), // Enviar ambos rating y comment
      });
      if (response.ok) {
        closeModal();
        getRestaurants().then((restaurants) => {
          showRestaurants(restaurants);
        });
      } else {
        console.error("Error al guardar calificación y comentario");
      }
    } catch (error) {
      console.error("Error al guardar calificación y comentario:", error);
    }
  };

  saveRatingBtn.addEventListener("click", onSaveRatingBtnClick);
  closeModalBtn.addEventListener("click", closeModal);
  window.addEventListener("click", outsideClick);

  function closeModal() {
    modal.style.display = "none";
    ratingForm.reset();
  }

  function outsideClick(event) {
    if (event.target === modal) {
      closeModal();
    }
  }

  modal.style.display = "block";
};

  // Función para mostrar el modal con calificaciones y comentarios
  const showRatingCommentsModal = (restaurant) => {
    const ratingModal = document.getElementById("rating-modal");
    const closeRatingModalBtn = ratingModal.querySelector(".close");
    const ratingCommentsContainer = document.getElementById("rating-comments");

    ratingCommentsContainer.innerHTML = "";

    restaurant.grades.forEach((grade) => {
      const date = new Date(grade.date).toLocaleDateString();
      const ratingComment = document.createElement("div");
      ratingComment.innerHTML = `<p>Fecha: ${date}</p><p>Calificación: ${grade.score}`;
      if (grade.comment) {
        ratingComment.innerHTML += ` - Comentario: ${grade.comment}</p>`;
      } else {
        ratingComment.innerHTML += "</p>";
      }
      ratingCommentsContainer.appendChild(ratingComment);
    });

    closeRatingModalBtn.addEventListener("click", () => {
      ratingModal.style.display = "none";
    });
    window.addEventListener("click", (event) => {
      if (event.target === ratingModal) {
        ratingModal.style.display = "none";
      }
    });

    ratingModal.style.display = "block";
  };

  // Función para calcular la calificación promedio
  const calculateAverageRating = (grades) => {
    if (grades.length === 0) return 0;
    const totalRating = grades.reduce((acc, grade) => acc + grade.score, 0);
    return totalRating / grades.length;
  };

  // Función para mostrar los restaurantes como tarjetas
  const showRestaurants = (restaurants) => {
    restaurantsContainer.innerHTML = "";

    restaurants.forEach((restaurant) => {
      const card = document.createElement("div");
      card.classList.add("restaurant-card");
      // Agregar la imagen del restaurante
      if (restaurant.image) {
        const image = document.createElement("img");
        image.src = `${restaurant.image}`;
        image.alt = restaurant.name;
        card.appendChild(image);
      }
      const name = document.createElement("h2");
      name.textContent = restaurant.name;
      card.appendChild(name);

      const averageRating = calculateAverageRating(restaurant.grades);
      const ratingText = document.createElement("p");
      ratingText.textContent = `Calificación promedio: ${averageRating.toFixed(1)}`;
      card.appendChild(ratingText);

      const cuisine = document.createElement("p");
      cuisine.textContent = `Cocina: ${restaurant.cuisine}`;
      card.appendChild(cuisine);

      const address = document.createElement("p");
      address.textContent = `Dirección: ${restaurant.address.street}, ${restaurant.address.city}`;
      card.appendChild(address);

      const schedule = document.createElement("p");
      schedule.textContent = `Horarios: ${restaurant.schedule}`;
      card.appendChild(schedule);

      const rateButton = document.createElement("button");
      rateButton.textContent = "Agregar Calificación";
      rateButton.classList.add("btn", "btn-primary");
      rateButton.addEventListener("click", () => {
        showRatingModal(restaurant._id);
      });
      card.appendChild(rateButton);

      const viewRatingsButton = document.createElement("button");
      viewRatingsButton.textContent = "Ver Calificaciones";
      viewRatingsButton.classList.add("btn", "btn-info");
      viewRatingsButton.addEventListener("click", () => {
        showRatingCommentsModal(restaurant);
      });
      card.appendChild(viewRatingsButton);
      // Agregar botón de edición
      const editButton = document.createElement("button");
      editButton.textContent = "Editar";
      editButton.classList.add("btn", "btn-secondary");
      editButton.addEventListener("click", () => {
        showEditModal(restaurant);
      });
      card.appendChild(editButton);
    // Agregar botón "Eliminar"
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      deleteButton.classList.add("btn", "btn-danger");
      deleteButton.type = "button"; // Cambiar el tipo de botón a "button"
      deleteButton.addEventListener("click", () => {
        // Mostrar una confirmación antes de eliminar el restaurante
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este restaurante?");
        if (confirmDelete) {
          deleteRestaurant(restaurant._id);
          reloadPage();
        }
      });
      card.appendChild(deleteButton);

      restaurantsContainer.appendChild(card);
    });
  };

  // Función para obtener la lista de restaurantes desde el servidor
  const getRestaurants = async () => {
    try {
      const response = await fetch("/api/restaurants");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener la lista de restaurantes:", error);
      return [];
    }
  };

  // Función para realizar la búsqueda de restaurantes
  const searchRestaurants = async (searchQuery) => {
    try {
      const response = await fetch(`/api/restaurants?searchQuery=${searchQuery}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
      return [];
    }
  };

  // Función para manejar la búsqueda al enviar el formulario
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const searchQuery = searchInput.value.trim();
    if (searchQuery === "") {
      // Si el campo de búsqueda está vacío, mostrar todos los restaurantes
      getRestaurants().then((restaurants) => {
        showRestaurants(restaurants);
      });
    } else {
      // Realizar la búsqueda con el valor ingresado
      searchRestaurants(searchQuery).then((restaurants) => {
        showRestaurants(restaurants);
      });
    }
  });



const showEditModal = (restaurant) => {
  const editModal = document.getElementById("edit-modal");
  const closeModalBtn = editModal.querySelector(".close");
  const editForm = document.getElementById("edit-form");
  const nameInput = document.getElementById("edit-name");
  const buildingInput = document.getElementById("edit-building");
  const streetInput = document.getElementById("edit-street");
  const zipcodeInput = document.getElementById("edit-zipcode");
  const cityInput = document.getElementById("edit-city");
  const suburbInput = document.getElementById("edit-suburb");
  const cuisineInput = document.getElementById("edit-cuisine");
  const imageInput = document.getElementById("edit-image");
  const scheduleInput = document.getElementById("edit-schedule");
  const saveEditBtn = document.getElementById("save-edit-btn");

  // Rellenar el formulario con los datos actuales del restaurante
  nameInput.value = restaurant.name;
  buildingInput.value = restaurant.address.building || "";
  streetInput.value = restaurant.address.street || "";
  zipcodeInput.value = restaurant.address.zipcode || "";
  cityInput.value = restaurant.address.city || "";
  suburbInput.value = restaurant.address.suburb || "";
  cuisineInput.value = restaurant.cuisine;
  imageInput.value = restaurant.image || "";
  scheduleInput.value = restaurant.schedule;

  const onSaveEditBtnClick = async (event) => {
  event.preventDefault();
  const name = nameInput.value;
  const building = buildingInput.value;
  const street = streetInput.value;
  const zipcode = zipcodeInput.value;
  const city = cityInput.value;
  const suburb = suburbInput.value;
  const cuisine = cuisineInput.value;
  const image = imageInput.value;
  const schedule = scheduleInput.value;

  // Enviar los datos editados al servidor
  try {
    const response = await fetch(`/api/restaurants/${restaurant._id}/edit`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, address: { building, street, zipcode, city, suburb }, cuisine, image, schedule }),
    });
    if (response.ok) {
      closeModal();
      // Recargar la página después de guardar los cambios exitosamente
      reloadPage();
    } else {
      console.error("Error al guardar los cambios");
    }
  } catch (error) {
    console.error("Error al guardar los cambios:", error);
  }
};

  saveEditBtn.addEventListener("click", onSaveEditBtnClick);
  closeModalBtn.addEventListener("click", closeModal);
  window.addEventListener("click", outsideClick);

  function closeModal() {
    editModal.style.display = "none";
    editForm.reset();
  }

  function outsideClick(event) {
    if (event.target === editModal) {
      closeModal();
    }
  }

  editModal.style.display = "block";
};

 // Función para mostrar el modal de agregar nuevo restaurante
  const showAddRestaurantModal = () => {
    const addModal = document.getElementById("add-modal");
    const closeAddModalBtn = addModal.querySelector(".close");
    const addForm = document.getElementById("add-form");
    const addNameInput = document.getElementById("add-name");
    const addBuildingInput = document.getElementById("add-building");
    const addStreetInput = document.getElementById("add-street");
    const addZipcodeInput = document.getElementById("add-zipcode");
    const addCityInput = document.getElementById("add-city");
    const addSuburbInput = document.getElementById("add-suburb");
    const addCuisineInput = document.getElementById("add-cuisine");
    const addImageInput = document.getElementById("add-image");
    const addScheduleInput = document.getElementById("add-schedule");
    const saveAddBtn = document.getElementById("save-add-btn");

    const onSaveAddBtnClick = async (event) => {
      event.preventDefault();
      const name = addNameInput.value;
      const building = addBuildingInput.value;
      const street = addStreetInput.value;
      const zipcode = addZipcodeInput.value;
      const city = addCityInput.value;
      const suburb = addSuburbInput.value;
      const cuisine = addCuisineInput.value;
      const image = addImageInput.value;
      const schedule = addScheduleInput.value;

      // Enviar los datos del nuevo restaurante al servidor
      try {
        const response = await fetch("/api/restaurants", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, address: { building, street, zipcode, city, suburb }, cuisine, image, schedule }),
        });
        if (response.ok) {
          closeModal();
          // Recargar la página después de guardar el nuevo restaurante exitosamente
          reloadPage();
        } else {
          console.error("Error al guardar el nuevo restaurante");
        }
      } catch (error) {
        console.error("Error al guardar el nuevo restaurante:", error);
      }
    };

    saveAddBtn.addEventListener("click", onSaveAddBtnClick);
    closeAddModalBtn.addEventListener("click", closeModal);
    window.addEventListener("click", outsideClick);

    function closeModal() {
      addModal.style.display = "none";
      addForm.reset();
    }

    function outsideClick(event) {
      if (event.target === addModal) {
        closeModal();
      }
    }

    addModal.style.display = "block";
  };

  const addRestaurantBtn = document.getElementById("add-restaurant-btn");
  addRestaurantBtn.addEventListener("click", showAddRestaurantModal);

      // Función para eliminar un restaurante
  const deleteRestaurant = async (restaurantId) => {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // Eliminar el restaurante de la lista y actualizar la vista
        const updatedRestaurants = restaurants.filter((restaurant) => restaurant._id !== restaurantId);
        showRestaurants(updatedRestaurants);
        reloadPage(); // Recargar la página después de eliminar el restaurante
      } else {
        console.error("Error al eliminar el restaurante");
      }
    } catch (error) {
      console.error("Error al eliminar el restaurante:", error);
    }
  };
  
  // Obtener la lista de restaurantes y mostrarlos al cargar la página
  getRestaurants().then((restaurants) => {
    showRestaurants(restaurants);
  });
});
