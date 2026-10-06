const participant_input = document.getElementById("participant-input");
const submit_button = document.getElementById("submit-button");

async function apply_condition_style() {
    const url_params = new URLSearchParams(window.location.search);
    const category = url_params.get("category");

    const response = await fetch("./data/task_parameters.json");
    const config = await response.json();

    const condition = config[category];
    document.documentElement.style.setProperty(
        "--base-size",
        condition.font_size
    );

    document.documentElement.style.setProperty(
        "--base-weight",
        condition.font_weight
    );
}

apply_condition_style();

submit_button.addEventListener("click", () => {
    const participant_id = participant_input.value.trim();
    if (participant_id === "") {
        alert("請輸入受試者代號。");
        return;
    }

    sessionStorage.setItem("participant_id", participant_id);
    window.location.href = `instruction.html${window.location.search}`;
});