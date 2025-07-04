document.addEventListener('deviceready', onDeviceReady, false);
async function viewShedule(url) {
    const text = document.getElementById("text");
    text.textContent = "Программа запустилась"
    const response = await fetch("https://corsproxy.io/?" + encodeURIComponent(url));
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    table = doc.getElementsByTagName("table")[0];
    const rows = table.getElementsByTagName("tr");
    let matrix = [];
    let x = 0;
    let y = 0;

    for (let row of rows) {
        const cells = row.getElementsByTagName("td");
        let x = 0; // сбрасываем для каждой строки

        for (let cell of cells) {
            const rowspan = parseInt(cell.getAttribute("rowspan") || "1", 10);
            const colspan = parseInt(cell.getAttribute("colspan") || "1", 10);

            // пропускаем занятые координаты
            while (matrix[y] && matrix[y][x]) x++;

            for (let emptyY = 0; emptyY < rowspan; emptyY++) {
                if (!matrix[y + emptyY]) matrix[y + emptyY] = [];

                    for (let emptyX = 0; emptyX < colspan; emptyX++) {
                        matrix[y + emptyY][x + emptyX] = cell;
                }
            }

            x += colspan;
        }

    y++; // 📈 двигаем строку
    }

    console.log("Макет создан");
    // 🔍 Поиск координаты ячейки "ОС-21"
    let foundY = -1;
    let foundX = -1;

    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            const cell = matrix[y][x];
            if (cell && cell.textContent.trim() === "ВР-21") {
                foundY = y;
                foundX = x;
                break;
            }
    }
    if (foundY !== -1) break;
    }

    let lesson = [];
    if (foundY === -1 || foundX === -1) {
    console.log("⛔ Группа ОС-21 не найдена");
    } else {
    for (let i = 0; i <= 11; i++) {
        const row = matrix[foundY + i];
        const cell = row?.[foundX];

        if (cell) {
            lesson.push(cell.textContent.trim())
        } else {
        console.log("🕳️ Ячейка отсутствует — возможно, поглощена rowspan");
        }
    }
    }
    text.textContent = JSON.stringify(lesson)
}
function onDeviceReady() {
    viewShedule("https://www.vgtk.by/schedule/lessons/day-tomorrow.php")
}
