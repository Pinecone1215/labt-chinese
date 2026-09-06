async function load_data(language, level) {
    const response = await fetch(`./data/${language}_${level}_condition.json`);
    const data = await response.json();
    return data
}

function show_screen(screen) {
    return new Promise((resolve) => {
        requestAnimationFrame((timestamp) => {
            const screens = document.querySelectorAll("#task-screen > div");
            screens.forEach((item) => { item.classList.remove("active"); });
            screen.classList.add("active");
            resolve(timestamp);
        });
    });
}

function wait_until(target_timestamp) {
    return new Promise((resolve) => {
        function check_time(timestamp) {
            if (timestamp >= target_timestamp) {
                resolve(timestamp);
            }else { requestAnimationFrame(check_time); }
        }
        requestAnimationFrame(check_time);
    });
}