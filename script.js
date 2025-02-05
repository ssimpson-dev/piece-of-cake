// ✅ Open a product modal
function openModal(productId) {
    let modal = document.getElementById(productId);
    if (modal) {
        modal.style.display = "flex"; // ✅ Make modal visible
        modal.setAttribute("data-open", "true"); // ✅ Mark it as open
        console.log(`Opened modal: ${productId}`);

        // ✅ Add a slight delay before allowing it to close
        setTimeout(() => {
            modal.setAttribute("data-ready", "true");
        }, 100);
    } else {
        console.error(`Modal not found: ${productId}`);
    }
}

// ✅ Close a modal
function closeModal(productId) {
    let modal = document.getElementById(productId);
    if (modal) {
        modal.style.display = "none"; // ✅ Hide modal
        modal.removeAttribute("data-open"); // ✅ Reset modal state
        modal.removeAttribute("data-ready"); // ✅ Reset readiness
        console.log(`Closed modal: ${productId}`);
    }
}

// ✅ Run everything else after DOM loads
document.addEventListener("DOMContentLoaded", () => {
    // 📌 Mobile Menu Toggle
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });

        document.addEventListener("click", (event) => {
            if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
                navLinks.classList.remove("active");
            }
        });
    }

    // 📌 Attach Click Events to Product Cards
    document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("click", () => {
            const modalId = card.getAttribute("onclick").match(/'([^']+)'/)[1];
            openModal(modalId);
        });
    });

    // 📌 Handle Enquiry Modal Opening from "Order Now" Buttons
    const enquiryModal = document.getElementById("enquiryModal");
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("enquiry-btn")) {
            const productModal = event.target.closest(".modal"); // Find the currently open product modal
            if (productModal) closeModal(productModal.id); // Close the product modal first
            openModal("enquiryModal"); // ✅ Open the enquiry modal
        }
    });

    // 📌 Close Enquiry Modal on "X" Button Click
    const closeModalBtn = document.querySelector(".close-btn");
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            closeModal("enquiryModal");
        });
    }

    // 📌 Fix: Prevent Modals From Closing Immediately After Opening
    document.addEventListener("click", (event) => {
        document.querySelectorAll(".modal").forEach((modal) => {
            let modalContent = modal.querySelector(".modal-content");

            // ✅ Ensure modal is open and "ready" before checking clicks
            if (modal.style.display === "flex" && modal.getAttribute("data-open") === "true" && modal.getAttribute("data-ready") === "true") {
                // ✅ Ensure only clicks outside the modal content close it
                if (!modalContent.contains(event.target) && !event.target.classList.contains("card")) {
                    console.log(`Clicked outside modal: ${modal.id}`);
                    closeModal(modal.id);
                }
            }
        });
    });

    // 📌 Handle Enquiry Form Submission
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();
            var successMessage = document.getElementById("success-message");

            fetch(this.action, {
                method: "POST",
                body: new FormData(this),
                headers: { 'Accept': 'application/json' }
            })
                .then(response => {
                    if (response.ok) {
                        successMessage.style.display = "block";
                        this.reset();
                        setTimeout(() => {
                            closeModal("enquiryModal");
                            successMessage.style.display = "none";
                        }, 2000);
                    } else {
                        alert("There was an error. Please try again.");
                    }
                })
                .catch(error => alert("There was an error. Please try again."));
        });
    }
});
