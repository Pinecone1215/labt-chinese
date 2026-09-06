function showScreen(screen) {
    const screens = document.querySelectorAll("#task-screen > div");

    screens.forEach((item) => {
        item.classList.remove("active");
    });

    screen.classList.add("active");
}

async function loadData() {
    const response = await fetch("./data/Chinese_Easy_Condition.json");
    const data = await response.json();

    const trial = data.trials[0];
    const wordPairs = trial["word-pairs"];

    const wordPairsScreen = document.getElementById("word-pairs");
    const rows = wordPairsScreen.querySelectorAll(".pair-row");

    for (let i = 0; i < rows.length; i++) {
        const words = rows[i].querySelectorAll("span");

        words[0].textContent = wordPairs[i][0];
        words[2].textContent = wordPairs[i][1];
    }

    showScreen(wordPairsScreen);
}

loadData();