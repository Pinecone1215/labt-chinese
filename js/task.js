async function load_data(language, level) {
    const response = await fetch(`./data/${language}_${level}_condition.json`);
    const data = await response.json();
    return data
}

function set_screen(screen) {
    const screens = document.querySelectorAll("#task-screen > div");
    screens.forEach((item) => { item.classList.remove("active"); });
    screen.classList.add("active");
}