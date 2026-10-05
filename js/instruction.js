const sections = document.querySelectorAll('.instruction');
const navigation = document.querySelector('.navigation');
const page_position = document.getElementById('page-position');
const start_button = document.getElementById('start-button');
const back_button = document.getElementById('back-button');
const next_button = document.getElementById('next-button');

let position = 0;
function show_page(new_position) {
    sections[position].classList.remove('active');

    position = new_position;
    sections[position].classList.add('active');

    if (position === 0) {
        navigation.classList.remove('active');
    }
    else {
        navigation.classList.add('active');
        page_position.textContent = `${position}/${sections.length - 1}`;

        if (position === sections.length - 1) {
            next_button.textContent = '前往測驗';
        } else { next_button.textContent = '下一頁'; }
    }
}

async function apply_condition_style() {
    const url_params = new URLSearchParams(window.location.search);
    const category = url_params.get("category");

    const response = await fetch("./data/task_parameters.json");
    const config = await response.json();

    const condition = config[category];
    document.documentElement.style.setProperty(
        "--base-font-size",
        condition.font_size
    );

    document.documentElement.style.setProperty(
        "--base-font-weight",
        condition.font_weight
    );
}

apply_condition_style();

start_button.addEventListener('click', () => { show_page(1); });
back_button.addEventListener('click', () => {
    if (position > 0) { show_page(position - 1); }
});

next_button.addEventListener('click', () => {
    if (position < sections.length - 1) {
        show_page(position + 1);
    } else { window.location.href = `task.html${window.location.search}`; }
});