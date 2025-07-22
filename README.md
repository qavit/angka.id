# Angka.id - Essential Math Review

An interactive, multi-language web application designed for adults to refresh their essential arithmetic and algebra skills. The interface is clean, simple, and allows for a focused learning experience.

## ✨ Key Features

*   **📚 Multiple Units:** Covers a wide range of topics from basic arithmetic (addition, fractions, order of operations) to fundamental algebra (linear equations, powers, inequalities).
*   **🌐 Multi-Language Support:** Seamlessly switch the entire interface and problem text between English, Indonesian (ID), and Traditional Chinese (繁中).
*   **➗ Dual Math Display Modes:** Choose between beautifully rendered mathematical notation with **KaTeX** or accessible **Plain Text**. This can be configured on the settings page.
*   **⚙️ Interactive Learning:**
    *   Problems are generated dynamically for endless practice.
    *   Check your answers instantly.
    *   Use the "Skip" button to move to a new problem or "Show Answer" if you get stuck.
*   **📱 Responsive Design:** A clean and modern UI that works on both desktop and mobile devices.

## 🛠️ Tech Stack

*   **Frontend:** Vanilla JavaScript (ES6 Modules)
*   **Styling:** TailwindCSS and custom CSS
*   **Math Rendering:** KaTeX

## 🚀 Getting Started

Because this project uses ES Modules, you cannot run it by simply opening the `index.html` file in your browser. It needs to be served by a local web server.

**Prerequisites:**
*   You need to have Git installed.
*   You need to have Python 3 installed (or any other tool that can run a local server).

**Instructions:**

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/qavit/angka.id.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd angka.id
    ```

3.  **Start a local server:**
    If you have Python 3, you can run this command:
    ```sh
    python3 -m http.server
    ```
    This will start a server, usually on port 8000.

4.  **Open the application in your browser:**
    Open your web browser and go to `http://localhost:8000`.

## 🔮 Future Development

This project was initially built with Vanilla JS for rapid prototyping. The next major step is to migrate it to a modern front-end framework like **Svelte** or **Vue.js** to improve scalability, state management, and overall maintainability.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.