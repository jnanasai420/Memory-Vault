// Handle adding a new category
document
  .getElementById("addCategoryBtn")
  .addEventListener("click", async function () {
    const { value: categoryName } = await Swal.fire({
      title: "Enter Folder Name",
      input: "text",
      inputLabel: "Folder Name",
      inputPlaceholder: "foldername",
      inputAttributes: {
        maxlength: "10",
        autocapitalize: "off",
        autocorrect: "off",
      },
    });

    if (categoryName) {
      const container = document.getElementById("categoriesContainer");
      const categoryDiv = document.createElement("div");
      categoryDiv.className = "col-md-4 category";
      categoryDiv.innerHTML = `<h5>${categoryName}</h5><div class="image-container"></div>`;
      container.appendChild(categoryDiv);
    }
  });

// Handle image upload and insert into the latest category
document
  .getElementById("addimage")
  .addEventListener("click", async function () {
    const { value: file } = await Swal.fire({
      title: "Upload Image",
      input: "file",
      inputAttributes: {
        accept: "image/*",
      },
    });

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const categoryContainers = document.querySelectorAll(".category");
        const lastCategory = categoryContainers[categoryContainers.length - 1];

        if (lastCategory) {
          const imageContainer = lastCategory.querySelector(".image-container");
          imageContainer.innerHTML = `<img src="${e.target.result}" class="uploaded-image" style="max-width:100%; margin-top:10px;">`;
        } else {
          Swal.fire(
            "Error",
            "No category found! Please create a category first.",
            "error"
          );
        }
      };
      reader.readAsDataURL(file);
    }
  });
