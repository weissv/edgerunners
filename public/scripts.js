window.addEventListener('DOMContentLoaded', () => {

    console.log("DOM готов. Запускаем скрипт v3.2 Remix Dossier (Полный)...");

    // --- Элементы DOM ---
    const videoContainer = document.getElementById("videoContainer");
    const statusText = document.getElementById("statusText");
    // Форма регистрации
    const registrationForm = document.getElementById("registrationForm");
    const clientIdInput = document.getElementById("clientId");
    const visitTimeInput = document.getElementById("visitTime");
    const clientNameInput = document.getElementById("clientName");
    const clientAgeInput = document.getElementById("clientAge");
    const clientGenderInput = document.getElementById("clientGender");
    const clientPhoneInput = document.getElementById("clientPhone");
    const clientPurposeInput = document.getElementById("clientPurpose");
    const saveRegFormButton = document.getElementById("saveRegFormButton");
    const closeRegFormButton = document.getElementById("closeRegFormButton");
    // Панель досье
    const dossierDisplayPanel = document.getElementById("dossierDisplayPanel");
    const dossierId = document.getElementById("dossierId");
    const dossierName = document.getElementById("dossierName");
    const dossierAge = document.getElementById("dossierAge");
    const dossierGender = document.getElementById("dossierGender");
    const dossierPhone = document.getElementById("dossierPhone");
    const dossierClientIdDisplay = document.getElementById("dossierClientIdDisplay");
    const dossierVisitHistory = document.getElementById("dossierVisitHistory");
    const closeDossierButton = document.getElementById("closeDossierButton");

    // Проверка наличия всех элементов
    const allElements = { videoContainer, statusText, registrationForm, clientIdInput, visitTimeInput, clientNameInput, clientAgeInput, clientGenderInput, clientPhoneInput, clientPurposeInput, saveRegFormButton, closeRegFormButton, dossierDisplayPanel, dossierId, dossierName, dossierAge, dossierGender, dossierPhone, dossierClientIdDisplay, dossierVisitHistory, closeDossierButton };
    for (const key in allElements) {
        if (!allElements[key]) {
            console.error(`CRITICAL ERROR: Element with ID '${key}' not found!`);
            alert(`Критическая ошибка: Элемент '${key}' не найден. Проверьте index.html.`);
            return;
        }
    }
    console.log("Элементы DOM успешно найдены.");

    const video = document.createElement("video");
    video.autoplay = true; video.muted = true; video.width = 720; video.height = 560;
    videoContainer.appendChild(video);
    console.log("Видео элемент создан и добавлен.");

    let canvas;
    let clientDataMap = new Map();
    let labels = [];
    let faceMatcher = null;
    let detectionInterval = null;
    let unknownFaceState = {
        tracking: false, startTime: null, descriptor: null, ageReadings: [],
        genderReadings: [], stabilizedAge: null, stabilizedGender: null,
        formShown: false, box: null, detectionData: null
    };
    let dossierShownForLabel = null;

    const ANALYSIS_TIME = 1000; // 1 секунда
    const FORM_DELAY = 1000;    // 1 секунда

    if (typeof faceapi === 'undefined') {
        console.error("КРИТИЧЕСКАЯ ОШИБКА: Библиотека face-api.min.js не загружена!");
        statusText.innerText = "ОШИБКА: face-api.js не найден!";
        alert("Не удалось загрузить face-api.min.js. Проверьте путь к файлу в index.html и его наличие.");
        return;
    }
    console.log("Библиотека faceapi найдена.");

    // --- Вспомогательные функции ---
    function calculateMedian(arr) {
        if (arr.length === 0) return null;
        const sorted = arr.slice().sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    }

    function calculateMode(arr) {
        if (arr.length === 0) return null;
        const modeMap = {};
        let maxCount = 0;
        let mode = arr[0];
        arr.forEach(val => {
            modeMap[val] = (modeMap[val] || 0) + 1;
            if (modeMap[val] > maxCount) {
                maxCount = modeMap[val];
                mode = val;
            }
        });
        return mode;
    }

    function generateClientId() {
        return `NEW-${Date.now().toString().slice(-6)}`;
    }
    console.log("Вспомогательные функции определены.");

    // --- Функции для работы с формой ---
    function showRegistrationForm(age, gender) {
        console.log("ВЫЗОВ: showRegistrationForm()");
        hideDossier();
        clientIdInput.value = generateClientId();
        visitTimeInput.value = new Date().toLocaleString('ru-RU');
        clientAgeInput.value = age || '';
        clientGenderInput.value = gender || 'unknown';
        clientNameInput.value = ''; clientPhoneInput.value = ''; clientPurposeInput.value = '';
        registrationForm.style.display = 'block';
        unknownFaceState.formShown = true;
        if (detectionInterval) clearInterval(detectionInterval);
        detectionInterval = null;
    }

    function hideRegistrationForm() {
        console.log("ВЫЗОВ: hideRegistrationForm()");
        registrationForm.style.display = 'none';
        unknownFaceState.formShown = false;
        resetUnknownFaceState();
        if (!detectionInterval) { startDetection(); }
    }

    saveRegFormButton.addEventListener('click', () => {
        const newData = {
            id: clientIdInput.value, name: clientNameInput.value, age: clientAgeInput.value,
            gender: clientGenderInput.value, phoneNumber: clientPhoneInput.value,
            clientId: clientIdInput.value,
            visitSchedule: [{ visitId: `V-${Date.now()}`, entryTime: visitTimeInput.value, exitTime: null, purpose: clientPurposeInput.value }]
        };
        console.log("Сохранение нового клиента (СИМУЛЯЦИЯ):", newData);
        alert(`Клиент ${newData.name} (ID: ${newData.id}) условно сохранен! Проверьте консоль.\n\n(РЕАЛЬНОЕ СОХРАНЕНИЕ ТРЕБУЕТ БЭКЕНДА!)`);
        hideRegistrationForm();
    });
    closeRegFormButton.addEventListener('click', hideRegistrationForm);
    console.log("Обработчики кнопок формы регистрации добавлены.");

    // --- Функции для досье ---
    function showDossier(clientInfo) {
        if (!clientInfo) return;
        // Не показываем, если уже показано для этого же клиента
        if (dossierDisplayPanel.style.display === 'block' && dossierShownForLabel === clientInfo.label) return;

        console.log(`ВЫЗОВ: showDossier() для ${clientInfo.label}`);
        hideRegistrationForm(); // Скрываем форму регистрации, если открыта

        dossierId.textContent = clientInfo.id || '-';
        dossierName.textContent = clientInfo.name || '-';
        dossierAge.textContent = clientInfo.age || '-';
        dossierGender.textContent = clientInfo.gender === 'male' ? 'Мужской' : (clientInfo.gender === 'female' ? 'Женский' : 'Не указан');
        dossierPhone.textContent = clientInfo.phoneNumber || '-';
        dossierClientIdDisplay.textContent = clientInfo.clientId || '-';

        if (clientInfo.visitSchedule && clientInfo.visitSchedule.length > 0) {
            dossierVisitHistory.innerHTML = clientInfo.visitSchedule.map(v =>
                `<li>${v.purpose} <span>${v.entryTime}</span></li>`
            ).join('');
        } else {
            dossierVisitHistory.innerHTML = '<li>Нет данных о визитах</li>';
        }
        dossierDisplayPanel.style.display = 'block';
        dossierShownForLabel = clientInfo.label;
        if (detectionInterval) clearInterval(detectionInterval); // Пауза детекции, пока досье открыто
        detectionInterval = null;
    }

    function hideDossier() {
        if (dossierDisplayPanel.style.display === 'none') return;
        console.log("ВЫЗОВ: hideDossier()");
        dossierDisplayPanel.style.display = 'none';
        dossierShownForLabel = null;
        if (!detectionInterval && !unknownFaceState.formShown) { // Возобновляем, если не открыта форма регистрации
             startDetection();
        }
    }
    closeDossierButton.addEventListener('click', hideDossier);
    console.log("Функции досье и обработчик кнопки закрытия определены.");

    // --- Функции загрузки данных ---
    async function loadClientData() {
        console.log("Начинаю загрузку clients.json...");
        try {
            const response = await fetch('./clients.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for clients.json`);
            const clients = await response.json();
            clients.forEach(client => { clientDataMap.set(client.label, client); labels.push(client.label); });
            console.log("УСПЕХ: Данные клиентов загружены. Всего меток:", labels.length);
            statusText.innerText = "Данные клиентов загружены.";
        } catch (error) {
            console.error("ОШИБКА загрузки clients.json:", error);
            statusText.innerText = "Ошибка: Не удалось загрузить базу клиентов.";
        }
    }

    async function loadLabeledImagesAndMatcher(labelsToLoad) {
        if (!labelsToLoad || labelsToLoad.length === 0) { console.warn("Нет меток для загрузки. FaceMatcher не будет создан."); return null; }
        console.log("ЗАГРУЗКА ЭТАЛОННЫХ ЛИЦ для:", labelsToLoad); statusText.innerText = "Загрузка эталонных лиц...";
        const labeledFaceDescriptors = await Promise.all(
            labelsToLoad.map(async (label) => {
                const descriptors = []; console.log(`-- Загрузка для ${label} --`);
                for (let i = 1; i <= 2; i++) { // Загружаем 2 фото для каждого
                    let img = null;
                    for (const ext of ['jpg', 'png', 'jpeg']) {
                        const path = `./labeled_faces/${label}/${i}.${ext}`;
                        try { img = await faceapi.fetchImage(path); console.log(`   УСПЕХ: ${path} загружен.`); break; } catch (e) { /* Игнорируем, если не найдено с этим расширением */ }
                    }
                    if (img) {
                        try {
                             console.log(`   Обнаружение лица на ${label}/${i}...`);
                             const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                             if (detection) { descriptors.push(detection.descriptor); console.log(`      => Лицо найдено и дескриптор добавлен для ${label}/${i}.`); }
                             else { console.warn(`      => Лицо НЕ найдено на ${label}/${i}.`); }
                        } catch (detectError) { console.error(`      => ОШИБКА обнаружения на ${label}/${i}:`, detectError); }
                    } else { console.error(`   ОШИБКА: Не удалось загрузить ${label}/${i}.(jpg/png/jpeg). Проверьте путь и наличие файла!`); }
                }
                if (descriptors.length > 0) { console.log(`   => УСПЕХ для ${label}: ${descriptors.length} дескриптор(а) создано.`); return new faceapi.LabeledFaceDescriptors(label, descriptors); }
                else { console.error(`   => ОШИБКА для ${label}: Не удалось создать ни одного дескриптора.`); return null; }
            })
        );
        const validDescriptors = labeledFaceDescriptors.filter(d => d !== null);
        console.log(`ИТОГО: Загружено валидных дескрипторов: ${validDescriptors.length} из ${labelsToLoad.length}`);
        if (validDescriptors.length === 0) { console.error("КРИТИЧЕСКАЯ ОШИБКА: НИ ОДНОГО дескриптора. FaceMatcher не будет создан."); statusText.innerText = "Ошибка: Не удалось загрузить эталонные лица."; return null; }
        statusText.innerText = "Face Matcher готов."; console.log("Face Matcher УСПЕШНО создан.");
        return new faceapi.FaceMatcher(validDescriptors, 0.6);
    }

    // --- Логика обработки и отслеживания ---
    function resetUnknownFaceState() {
        unknownFaceState.tracking = false; unknownFaceState.startTime = null;
        unknownFaceState.descriptor = null; unknownFaceState.ageReadings = [];
        unknownFaceState.genderReadings = []; unknownFaceState.stabilizedAge = null;
        unknownFaceState.stabilizedGender = null;
        // unknownFaceState.formShown = false; // Не сбрасываем formShown здесь, им управляют его функции
        unknownFaceState.box = null; unknownFaceState.detectionData = null;
    }

    function processDetections(detections, displaySize, canvas) {
        const ctx = canvas.getContext("2d"); ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detections.length === 0) {
            resetUnknownFaceState(); hideDossier(); hideRegistrationForm();
            statusText.innerText = "Ожидание лиц...";
            return;
        }

        // Если одна из форм уже открыта, просто рисуем текущее лицо и выходим
        if (unknownFaceState.formShown && unknownFaceState.detectionData) {
            drawUnknownFace(unknownFaceState.detectionData, canvas, `Регистрация...`);
            return;
        }
        if (dossierShownForLabel && detections.length > 0) {
            const currentDossierFace = detections.find(d => faceMatcher && faceMatcher.findBestMatch(d.descriptor).label === dossierShownForLabel);
            if (currentDossierFace) {
                drawKnownFace(currentDossierFace, dossierShownForLabel, canvas);
                return; // Если досье для текущего лица уже показывается, ничего больше не делаем
            } else {
                // Лицо, для которого было досье, пропало, но есть другие лица
                hideDossier(); // Скрываем, так как его нет
            }
        }


        let foundKnownFaceThisFrame = null;
        let firstUnknownFaceData = null;

        detections.forEach(d => {
            const bestMatch = (faceMatcher) ? faceMatcher.findBestMatch(d.descriptor) : { label: 'unknown', distance: 1 };
            console.log(`  Лицо: Возраст=${d.age?.toFixed(1)}, Пол=${d.gender}, Match=${bestMatch.label} (Дист: ${bestMatch.distance.toFixed(2)})`);

            if (bestMatch.label !== 'unknown') {
                if (!foundKnownFaceThisFrame) { // Берем первое известное лицо
                    foundKnownFaceThisFrame = clientDataMap.get(bestMatch.label);
                }
                drawKnownFace(d, bestMatch.label, canvas);
            } else {
                if (!firstUnknownFaceData) { // Берем первое неизвестное
                    firstUnknownFaceData = d;
                }
                drawUnknownFace(d, canvas, "Не опознан");
            }
        });

        if (foundKnownFaceThisFrame) {
            showDossier(foundKnownFaceThisFrame);
            resetUnknownFaceState(); // Сбрасываем трекинг неизвестного, если видим известное
            hideRegistrationForm(); // Закрываем форму регистрации
        } else if (detections.length === 1 && firstUnknownFaceData) { // Только если ОДНО лицо и оно НЕИЗВЕСТНОЕ
             hideDossier(); // Убедимся, что досье скрыто
            if (firstUnknownFaceData.age === undefined || firstUnknownFaceData.gender === undefined) {
                console.warn("Возраст/Пол не определены для неизвестного лица!");
                drawUnknownFace(firstUnknownFaceData, canvas, "Ошибка данных");
                resetUnknownFaceState();
            } else {
                handleUnknownFace(firstUnknownFaceData, displaySize, canvas);
            }
        } else { // Несколько неизвестных лиц или смесь без опознанных ИЛИ если было опознанное, но оно пропало
            hideDossier();
            hideRegistrationForm();
            resetUnknownFaceState();
            statusText.innerText = detections.length > 1 ? "Обнаружено несколько лиц" : "Анализ...";
        }
    }

    function handleUnknownFace(d, displaySize, canvas) {
        console.log("ВЫЗОВ: handleUnknownFace()");
        const now = Date.now();
        unknownFaceState.detectionData = d; // Сохраняем для отрисовки, пока форма открыта

        if (!unknownFaceState.tracking) {
             unknownFaceState.tracking = true;
             unknownFaceState.startTime = now;
             unknownFaceState.descriptor = d.descriptor; // Не используется активно, но можно для трекинга
        }

        const timeElapsed = now - unknownFaceState.startTime;

        if (timeElapsed < ANALYSIS_TIME) {
            unknownFaceState.ageReadings.push(d.age);
            unknownFaceState.genderReadings.push(d.gender);
            statusText.innerText = `Анализ нового лица... ${((ANALYSIS_TIME - timeElapsed) / 1000).toFixed(1)}с`;
            drawUnknownFace(d, canvas, `Анализ... (~${Math.round(d.age)})`);
        } else {
            if (unknownFaceState.stabilizedAge === null) {
                unknownFaceState.stabilizedAge = calculateMedian(unknownFaceState.ageReadings);
                unknownFaceState.stabilizedGender = calculateMode(unknownFaceState.genderReadings);
            }

            if (timeElapsed >= (ANALYSIS_TIME + FORM_DELAY) && !unknownFaceState.formShown) {
                statusText.innerText = "Обнаружен новый клиент! Открытие формы регистрации...";
                showRegistrationForm(unknownFaceState.stabilizedAge, unknownFaceState.stabilizedGender);
                // unknownFaceState.formShown = true; // Устанавливается внутри showRegistrationForm
            } else if (!unknownFaceState.formShown) {
                statusText.innerText = `Новое лицо. Возраст: ${unknownFaceState.stabilizedAge}. Регистрация через ${((ANALYSIS_TIME + FORM_DELAY - timeElapsed) / 1000).toFixed(1)}с`;
                drawUnknownFace(d, canvas, `Новый клиент (~${unknownFaceState.stabilizedAge})`);
            }
        }
     }

    // --- Функции отрисовки ---
    function drawFaceInfo(ctx, box, textLines) {
         new faceapi.draw.DrawTextField(
             textLines,
             box.topLeft,
             {
                 backgroundColor: 'rgba(22, 27, 34, 0.7)', // Темный фон (из Remix)
                 fontColor: '#C9D1D9', // Светлый текст (из Remix)
                 fontSize: 14,
                 padding: 8
             }
         ).draw(ctx);
    }

    function drawKnownFace(d, label, canvas) {
        console.log(`  => Рисую ИЗВЕСТНОЕ: ${label}`);
        const ctx = canvas.getContext("2d");
        const boxColor = '#58A6FF'; // Синий акцент (из Remix)
        faceapi.draw.drawDetections(canvas, d, { boxColor: boxColor, lineWidth: 2 });
        const clientInfo = clientDataMap.get(label);
        const text = clientInfo ? clientInfo.name : label;
        drawFaceInfo(ctx, d.detection.box, [text]);
    }

    function drawUnknownFace(d, canvas, mainText) {
        console.log(`  => Рисую НЕИЗВЕСТНОЕ: ${mainText}`);
        const ctx = canvas.getContext("2d");
        const boxColor = '#8B949E'; // Серый для неизвестных (из Remix)
        faceapi.draw.drawDetections(canvas, d, { boxColor: boxColor });
        const age = unknownFaceState.stabilizedAge || (d.age ? Math.round(d.age) : '?');
        const genderRaw = unknownFaceState.stabilizedGender || d.gender;
        const gender = genderRaw === 'male' ? 'Мужской' : (genderRaw === 'female' ? 'Женщина' : '?');
        drawFaceInfo(ctx, d.detection.box, [mainText, `${gender}, ~${age} лет`]);
    }

    // --- Запуск и интервал ---
    async function startDetection() {
         console.log("Вызвана функция startDetection.");
         if (!canvas) { canvas = faceapi.createCanvasFromMedia(video); videoContainer.appendChild(canvas); }
         statusText.innerText = "Запуск обнаружения...";
         const displaySize = { width: video.width, height: video.height };
         faceapi.matchDimensions(canvas, displaySize);
         if (detectionInterval) { console.log("Очистка предыдущего интервала."); clearInterval(detectionInterval); detectionInterval = null; }
         console.log("Canvas настроен. Запускаю setInterval...");
         detectionInterval = setInterval(async () => {
             try {
                 const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptors().withAgeAndGender();
                 const resizedDetections = faceapi.resizeResults(detections, displaySize);
                 if (!unknownFaceState.formShown && !dossierShownForLabel) { // Обрабатываем, только если никакая форма не открыта
                    processDetections(resizedDetections, displaySize, canvas);
                 } else if (unknownFaceState.formShown && resizedDetections.length > 0) {
                     // Просто рисуем лицо, если форма открыта
                     const ctx = canvas.getContext("2d"); ctx.clearRect(0, 0, canvas.width, canvas.height);
                     drawUnknownFace(resizedDetections[0], canvas, "Регистрация...");
                 } else if (dossierShownForLabel && resizedDetections.length > 0) {
                     const ctx = canvas.getContext("2d"); ctx.clearRect(0, 0, canvas.width, canvas.height);
                     const knownFaceInView = resizedDetections.find(det => faceMatcher && faceMatcher.findBestMatch(det.descriptor).label === dossierShownForLabel);
                     if (knownFaceInView) {
                        drawKnownFace(knownFaceInView, dossierShownForLabel, canvas);
                     } else {
                        // Если лицо, для которого было досье, пропало, но есть другие
                        detections.forEach(det => drawUnknownFace(det, canvas, "Не опознан"));
                     }
                 }


             } catch (error) { console.error("ОШИБКА в цикле обнаружения:", error); statusText.innerText = "Ошибка обнаружения!"; if(detectionInterval) clearInterval(detectionInterval); detectionInterval = null; }
         }, 500);
    }

    const run = async () => {
        console.log("Вызвана функция run.");
        statusText.innerText = "Загрузка моделей..."; console.log("Начинаю загрузку моделей...");
        const models = [ 'ssdMobilenetv1', 'faceLandmark68Net', 'faceRecognitionNet', 'ageGenderNet', 'faceExpressionNet' ];
        for (const modelName of models) {
            try { console.log(`Загрузка ${modelName}...`); await faceapi.nets[modelName].loadFromUri("./models"); console.log(`   УСПЕХ: ${modelName} загружена.`); }
            catch (error) { console.error(`   !!! ОШИБКА загрузки ${modelName}:`, error); statusText.innerText = `Ошибка загрузки ${modelName}!`; return; }
        }
        console.log("Все модели успешно загружены.");

        await loadClientData();
        faceMatcher = await loadLabeledImagesAndMatcher(labels);

        if (!faceMatcher) { console.warn("FaceMatcher не создан. Распознавание будет ограничено."); statusText.innerText = "Внимание: Распознавание известных лиц не работает."; }

        console.log("Запускаю видеопоток..."); statusText.innerText = "Запуск видеопотока...";
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
            video.srcObject = stream;
        } catch (err) { console.error("Ошибка доступа к камере:", err); statusText.innerText = "ОШИБКА: Нет доступа к камере!"; alert("Не удалось получить доступ к камере."); return; }

        video.addEventListener("play", () => {
            console.log("Событие 'play' сработало. Вызываю startDetection...");
            statusText.innerText = "Видео запущено.";
            startDetection();
        });
        console.log("Обработчик 'play' добавлен.");
    };

    console.log("Вызываю run()...");
    run();

});