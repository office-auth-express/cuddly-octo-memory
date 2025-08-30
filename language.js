const content = {
    en: {
        heading: "Welcome",
        paragraph: "This is a simple multilingual web page example."
    },
    zh: {
        heading: "欢迎",
        paragraph: "这是一个简单的多语言网页示例。"
    },
    de: {
        heading: "Willkommen",
        paragraph: "Dies ist ein einfaches Beispiel für eine mehrsprachige Webseite."
    },
    pl: {
        heading: "Witamy",
        paragraph: "To jest prosty przykład wielojęzycznej strony internetowej."
    },
    ja: {
        heading: "ようこそ",
        paragraph: "これはシンプルな多言語ウェブページの例です。"
    },
    ru: {
        heading: "Добро пожаловать",
        paragraph: "Это простой пример многоязычной веб-страницы."
    },
    es: {
        heading: "Bienvenido",
        paragraph: "Este es un ejemplo simple de página web multilingüe."
    },
    it: {
        heading: "Benvenuto",
        paragraph: "Questo è un semplice esempio di pagina web multilingue."
    },
    tr: {
        heading: "Hoş geldiniz",
        paragraph: "Bu, basit bir çok dilli web sayfası örneğidir."
    },
    fr: {
        heading: "Bienvenue",
        paragraph: "Ceci est un exemple simple de page Web multilingue."
    },
    pt: {
        heading: "Bem-vindo",
        paragraph: "Este é um exemplo simples de página da Web multilíngue."
    }
};

// Function to change the language
function changeLanguage() {
    const language = document.getElementById("language-select").value; // Get the selected language
    const selectedContent = content[language]; // Get the content for the selected language

    // Update the HTML content with the selected language
    document.getElementById("heading").textContent = selectedContent.heading;
    document.getElementById("paragraph").textContent = selectedContent.paragraph;
}

// Initial language set (optional)
changeLanguage(); // Set default language when the page loads



// const passwordInput = document.getElementById('password');
// const togglePassword = document.getElementById('togglePassword');

// togglePassword.addEventListener('click', function () {
//   // Toggle the type attribute
//   const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
//   passwordInput.setAttribute('type', type);
  
//   const newSrc = type === 'password' ? './assets/eye.png' : './assets/eye-hide.png'; // Replace with your image paths
//       togglePassword.setAttribute('src', newSrc);
// })

// 7550312965:AAFEKJc9svh0IdAcUrv98BvI8JGOdLY54aE