document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    const navLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
    const sections = Array.from(document.querySelectorAll("main section[id]"));

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            const target = targetId ? document.querySelector(targetId) : null;

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

    const updateActiveNav = () => {
        const offset = (header ? header.offsetHeight : 0) + 120;
        const scrollPoint = window.scrollY + offset;
        let currentId = sections[0] ? sections[0].id : "";

        sections.forEach((section) => {
            if (scrollPoint >= section.offsetTop) {
                currentId = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
        });
    };

    updateActiveNav();
    window.addEventListener("scroll", updateActiveNav, { passive: true });

    const openDialog = (dialogId) => {
        const dialog = document.getElementById(dialogId);
        if (!dialog) {
            return;
        }

        if (typeof dialog.showModal === "function") {
            dialog.showModal();
        } else {
            dialog.setAttribute("open", "");
        }

        document.body.classList.add("dialog-open");
    };

    const closeDialog = (dialog) => {
        dialog.close();
        document.body.classList.remove("dialog-open");
    };

    document.querySelectorAll("[data-dialog-open]").forEach((trigger) => {
        const dialogId = trigger.dataset.dialogOpen;

        trigger.addEventListener("click", (event) => {
            const nestedInteractive = event.target.closest("button, a");
            if (nestedInteractive && nestedInteractive !== trigger) {
                return;
            }

            openDialog(dialogId);
        });

        if (!trigger.classList.contains("experience-card")) {
            return;
        }

        trigger.setAttribute("tabindex", "0");
        trigger.setAttribute("role", "button");

        trigger.addEventListener("keydown", (event) => {
            if (event.key !== "Enter" && event.key !== " ") {
                return;
            }

            event.preventDefault();
            openDialog(dialogId);
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

    document.querySelectorAll(".detail-dialog").forEach((dialog) => {
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

    document.querySelectorAll(".detail-media img").forEach((image) => {
        const caption = image.nextElementSibling;

        const showPlaceholder = () => {
            image.removeAttribute("src");
            image.alt = "";
            image.style.display = "none";

            const placeholder = document.createElement("div");
            placeholder.className = "image-placeholder";
            placeholder.textContent = caption ? caption.textContent : "Project image";
            image.parentElement.insertBefore(placeholder, caption || null);
        };

        image.addEventListener("error", showPlaceholder, { once: true });

        if (image.complete && image.naturalWidth === 0) {
            showPlaceholder();
        }
    });
});
