function toggleDarkMode() {
    let isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    switchImage()
  }
function switchImage() {
    const img = document.getElementById('darkModeImage');
    if (img.src.includes('dark')) {
        img.src = 'assets/light.png';
    } else {
        img.src = 'assets/dark.png';
    }
}
  
document.addEventListener('DOMContentLoaded', (event) => {
    if (localStorage.getItem('darkMode') === 'enabled') {
      document.body.classList.add('dark-mode');
    }
});

