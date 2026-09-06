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
    const buttons = options.querySelectorAll("button");

    const trial = data.trials[0];
    const category = "younger";

    let apr = config[category].initial_apr;
    let timestamp = null;

    async function wait_for_response() {
        let index = null;
        let rt = null;
        let start_timestamp = null;

        buttons.forEach((button, i) => {
            button.onclick = () => {
                index = i + 1;
                rt = performance.now() - start_timestamp;
            };
        });

        start_timestamp = await show_screen(mc_question);
        return new Promise((resolve) => {
            function check_response(timestamp) {
                if (index !== null) {
                    resolve({
                        index: index,
                        rt: rt
                    });
                } else if (timestamp - start_timestamp >= config.common.response_limit) {
                    resolve({
                        index: null,
                        rt: config.common.response_limit
                    });
                } else { requestAnimationFrame(check_response); }
            }
            requestAnimationFrame(check_response);
        });
    }

    // 測驗開始
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
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].textContent = trial.options[i];
    }
    const response = await wait_for_response();

    // 當前 trial 結算
    const correct = response.index === trial.answer_index ? 1 : 0;
    const result = {
        apr: apr,
        correct: correct,
        response_rt: response.rt,
        response_index: response.index,
        answer_index: trial.answer_index
    };
    console.log(result);
}

main();