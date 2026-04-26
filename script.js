document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);
            if (!target) {
                return;
            }

            event.preventDefault();
            const headerHeight = header ? header.offsetHeight : 0;
            const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top,
                behavior: "smooth"
            });
        });
    });

    const sections = Array.from(document.querySelectorAll("main section[id]"));
    const navLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));

    const setActiveNav = () => {
        const scrollPoint = window.scrollY + (header ? header.offsetHeight : 0) + 120;
        let currentId = "";

        sections.forEach((section) => {
            if (scrollPoint >= section.offsetTop) {
                currentId = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
        });
    };

    setActiveNav();
    window.addEventListener("scroll", setActiveNav, { passive: true });

    const dialogs = Array.from(document.querySelectorAll(".project-dialog"));

    const closeDialog = (dialog) => {
        dialog.close();
        document.body.classList.remove("dialog-open");
    };

    document.querySelectorAll("[data-dialog-open]").forEach((button) => {
        button.addEventListener("click", () => {
            const dialog = document.getElementById(button.dataset.dialogOpen);
            if (!dialog) {
                return;
            }

            if (typeof dialog.showModal === "function") {
                dialog.showModal();
            } else {
                dialog.setAttribute("open", "");
            }

            document.body.classList.add("dialog-open");
        });
    });

    dialogs.forEach((dialog) => {
        dialog.addEventListener("click", (event) => {
            if (event.target === dialog) {
                closeDialog(dialog);
            }
        });

        dialog.addEventListener("cancel", () => {
            document.body.classList.remove("dialog-open");
        });

        dialog.addEventListener("close", () => {
            document.body.classList.remove("dialog-open");
        });
    });

    document.querySelectorAll("[data-dialog-close]").forEach((button) => {
        button.addEventListener("click", () => {
            const dialog = button.closest("dialog");
            if (dialog) {
                closeDialog(dialog);
            }
        });
    });

    document.querySelectorAll(".project-media img").forEach((image) => {
        const placeholder = image.nextElementSibling;

        const showPlaceholder = () => {
            image.style.display = "none";
            if (placeholder) {
                placeholder.hidden = false;
            }
        };

        image.addEventListener("error", showPlaceholder);

        if (image.complete && image.naturalWidth === 0) {
            showPlaceholder();
        }
    });
});
