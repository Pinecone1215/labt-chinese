async function load_config() {
    const response = await fetch("./data/task_parameters.json");
    const config = await response.json();
    return config;
}

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

async function main() {
    const config = await load_config();
    const data = await load_data("chinese", "easy");

    const message = document.getElementById("message");
    const fixation = document.getElementById("fixation");

    const word_pairs = document.getElementById("word-pairs");
    const pair_rows = word_pairs.querySelectorAll(".pair-row");

    const single_word = document.getElementById("single-word");

    const mc_question = document.getElementById("multiple-choice-question");
    const question_word = document.getElementById("question-word");
    const options = document.getElementById("options");

    // 測驗開始
    trial = data.trials[0];

    category = "younger";
    let apr = config[category].initial_apr;

    let timestamp = null;

    // 顯示 fixation
    timestamp = await show_screen(fixation);
    await wait_until(timestamp + config.common.fixation_duration);

    // 顯示 trial number
    message.textContent = `第 ${trial.number} 回合`;
    timestamp = await show_screen(message);
    await wait_until(timestamp + config.common.trial_number_duration);

    // 顯示 word pairs
    for (let i = 0; i < pair_rows.length; i++) {
        const words = pair_rows[i].querySelectorAll("span");
        words[0].textContent = trial.word_pairs[i][0];
        words[2].textContent = trial.word_pairs[i][1];
    }
    timestamp = await show_screen(word_pairs);
    await wait_until(timestamp + apr);

    // 顯示 fixation
    timestamp = await show_screen(fixation);
    await wait_until(timestamp + config.common.fixation_duration);

    // 顯示 single word
    single_word.textContent = trial.single_words[0];
    timestamp = await show_screen(single_word);
    await wait_until(timestamp + config.common.single_word_duration);

    // 顯示 fixation
    timestamp = await show_screen(fixation);
    await wait_until(timestamp + config.common.fixation_duration);

    // 顯示 single word
    single_word.textContent = trial.single_words[1];
    timestamp = await show_screen(single_word);
    await wait_until(timestamp + config.common.single_word_duration);

    // 顯示 fixation
    timestamp = await show_screen(fixation);
    await wait_until(timestamp + config.common.fixation_duration);

    // 顯示 multiple choice question
    question_word.textContent = trial.question_word;
    const buttons = options.querySelectorAll("button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].textContent = trial.options[i];
    }
    timestamp = await show_screen(mc_question);
    let end = await wait_until(timestamp + config.common.response_limit);
}

main();