(function () {
    var modSettings = {
        currentObjectTitle: undefined,
        loadedObjects: [],
        isDef: true,
        mode: "Random"
    };

    function ready() {
        addBubbleSettings();
        loadObjects();
    }

    function addBubbleSettings() {
        var bodyElement = document.getElementsByTagName("body")[0];

        var bubbleSettings = document.createElement("div");

        bubbleSettings.innerHTML = "Нaстрoйки<br><br>";
        bubbleSettings.setAttribute("style", "background: #9a9a9a;padding: 20px;z-index: 200000000000000000;position: absolute;right: 0;");

        var bubbleSettingsContainer = document.createElement("div");
        bubbleSettingsContainer.setAttribute("style", "text-align: left !important;");
        bubbleSettings.appendChild(bubbleSettingsContainer);

        var buildingMenu = document.createElement("div");
        buildingMenu.id = "building-menu";
        buildingMenu.innerText = "Oбъeкт: ";
        bubbleSettingsContainer.appendChild(buildingMenu);

        /*var inputDef = document.createElement("input");
         inputDef.id = "def-input";
         inputDef.setAttribute("type", "checkbox");
         inputDef.setAttribute("checked", "checked");
         inputDef.addEventListener("click", function () { defStateChange() });
         bubbleSettingsContainer.appendChild(inputDef);

         var inputDefText = document.createTextNode("Защищать");
         bubbleSettingsContainer.appendChild(inputDefText);*/

        var readyPercentInfo = document.createElement("div");
        readyPercentInfo.id = "ready-percent";
        readyPercentInfo.innerText = "Bыполненo: 0%";
        bubbleSettingsContainer.appendChild(readyPercentInfo);

        var seedInfo = document.createElement("div");
        seedInfo.id = "speed";
        seedInfo.innerText = "Скoрoсть: 0 PP2M";
        bubbleSettingsContainer.appendChild(seedInfo);

        var modeChangerMenu = document.createElement("div");
        modeChangerMenu.innerText = "Рeжим: ";
        bubbleSettingsContainer.appendChild(modeChangerMenu);

        var modeChanger = document.createElement("select");
        modeChanger.id = "mode-change";
        modeChanger.addEventListener("change", modeChangeEvent);

        var randomModeOption = document.createElement("option");
        randomModeOption.value = "Random";
        randomModeOption.innerText = "Random";
        modeChanger.appendChild(randomModeOption);

        var linearModeOption = document.createElement("option");
        linearModeOption.value = "Linear";
        linearModeOption.innerText = "Linear";
        modeChanger.appendChild(linearModeOption);

        modeChangerMenu.appendChild(modeChanger);

        var buttonStart = document.createElement("div");
        buttonStart.innerText = "Зaпуcтить";
        buttonStart.setAttribute("style", "padding: 3px; background: #f7f7f7; color: black; width: 100px; text-align: center; margin-top: 10px;user-select:none");
        buttonStart.addEventListener("click", function () { startEvent() });
        bubbleSettingsContainer.appendChild(buttonStart);

        var buttonDeleteCookie = document.createElement("div");
        buttonDeleteCookie.innerText = "Oчиcтить Cookie";
        buttonDeleteCookie.setAttribute("style", "padding: 3px; background: #f7f7f7; color: black; width: 100px; text-align: center; margin-top: 10px;user-select:none");
        buttonDeleteCookie.addEventListener("click", function () { deleteCookieEvent() });
        bubbleSettingsContainer.appendChild(buttonDeleteCookie);

        bodyElement.appendChild(bubbleSettings);
    }

    function startEvent() {
        var objectList = document.getElementById("select-build-menu");
        var selIndex = objectList.selectedIndex;
        var selValue = objectList[selIndex].value;

        var allImage = modSettings.loadedObjects;

        //if (modSettings.currentObjectTitle == selValue) {
            //alert("Этa задaча уже зaпущена! (" + selValue + ")");
            //return;
        //}

        for (var i = 0; i < allImage.length; i++) {
            if (allImage[i].title == selValue) {
                console.log("цeль выбрана - " + allImage[i].title);
                modSettings.currentObjectTitle = selValue;
                AutoPixels(allImage[i], false);
            }
        };


    }

    function defStateChange() {
        var checkbox = document.getElementById("def-input");
        if (checkbox.checked != undefined) {
            modSettings.isDef = false;
        }
        else {
            modSettings.isDef = true;
        }
    }

    function deleteCookieEvent() {
        var question = confirm("Вы увeрены, что хoтите очиcтить Cookie?");
        if (question) {
            deleteAllCookies();
        }
    }

    function deleteAllCookies() {
        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }

    function modeChangeEvent() {
        var chnager = document.getElementById("mode-change");
        modSettings.mode = chnager.value;
    }

    function loadObjects() {
        var url = "https://api.myjson.com/bins/1abltj.json";

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send();

        xhr.onreadystatechange = function () { // (3)
            if (xhr.readyState != 4)
                return;

            if (xhr.status == 200) {
                var objects = JSON.parse(xhr.responseText)["objects"];

                var buildingMenu = document.getElementById("building-menu");

                if (document.getElementById("select-build-menu") != undefined) {
                    buildingMenu.removeChild(document.getElementById("select-build-menu"));
                }

                var selectElem = document.createElement("select");
                selectElem.id = "select-build-menu";

                if (modSettings.loadedObjects.length != 0)
                    loadedObjects.clear();

                objects.forEach(function (item) {
                    var optionElem = document.createElement("option");
                    optionElem.innerText = item.title;
                    optionElem.setAttribute("value", item.title);

                    selectElem.appendChild(optionElem);

                    modSettings.loadedObjects.push(item);
                });

                buildingMenu.appendChild(selectElem);
            }
        }
    }

    function AutoPixels(image) {

        var Painter = function (config) {
            var board = document.getElementById("board").getContext('2d');
            var title = config.title || "unnamed";

            var img = new Image();
            img.crossOrigin = "anonymous";
            img.src = config.image;
            var startX = config.x;
            var startY = config.y;

            var canvas = document.createElement('canvas');
            var image = undefined;

            var imageAlreadyLoaded = false;

            var imagePixels = [];
            var coordsRandomMethod = [];

            var pixelsLoaded = false;
            var changedPixels = [];
            var writePixelChange = false;

            if (Notification.permission !== "granted")
                Notification.requestPermission();

            var om = App.socket.onmessage;

            var lastSamePixelCount = 0;

            var isCaptcha = false;

            App.socket.onmessage = function (message) {
                var m = JSON.parse(message.data);

                if (m.type == "captcha_required") {
                    if (Notification.permission !== "granted")
                        Notification.requestPermission();
                    else {
                        var notification = new Notification('Notification title', {
                            body: "Hey there! Enter the captcha!",
                        });
                    }
                }

                if (m.type == "pixel" & writePixelChange) {
                    var newPixel = m.pixels[0];
                    if (newPixel.x > startX && newPixel.x < startX + canvas.width &&
                        newPixel.y > startY && newPixel.y < startY + canvas.height) {
                        if (pixelsLoaded) {
                            if (changedPixels.length != 0) {
                                for (var i = 0; i < changedPixels.length; i++) {
                                    var changedPixel = changedPixels[i];
                                    if (imagePixels[changedPixel.x - startX][changedPixel.y - startY].colorId == changedPixel.color) {
                                        imagePixels[changedPixel.x - startX][changedPixel.y - startY].painted = true;
                                    }
                                    else
                                    {
                                        imagePixels[changedPixel.x - startX][changedPixel.y - startY].painted = false;
                                    }
                                }
                            }

                            if (imagePixels[newPixel.x - startX][newPixel.y - startY].colorId == newPixel.color) {
                                imagePixels[newPixel.x - startX][newPixel.y - startY].painted = true;
                            }
                            else
                            {
                                imagePixels[newPixel.x - startX][newPixel.y - startY].painted = false;
                            }
                        }
                        else {
                            // запись во временный массив
                            changedPixels.push(newPixel);
                        }
                    }
                }

                if (m.type == "captcha_required")
                {
                    isCaptcha = true;
                }

                if (m.type == "captcha_status")
                {
                    if(m.success == "true")
                        isCaptcha = false;
                }

                om(message);
            }

            function statsCounterInterval() {
                setInterval(function () {
                    statsCounter();
                }, 120000);
            }

            function statsCounter() {
                var samePixelCount = 0;
                var invisiblePixelCount = 0;
                for (var y = 0; y < canvas.height; y++) {
                    for (var x = 0; x < canvas.width; x++) {
                        var pixelInfo = imagePixels[x][y];

                        if (pixelInfo.colorId == -1) {
                            invisiblePixelCount = invisiblePixelCount + 1;
                            continue;
                        }

                        if (pixelInfo.painted) {
                            samePixelCount = samePixelCount + 1;
                            continue;
                        }
                    }
                }

                var readyPercent = document.getElementById("ready-percent");
                readyPercent.innerText = "Выполнено: " + ((samePixelCount * 100) / (canvas.height * canvas.width - invisiblePixelCount)).toFixed(2) + "%";

                if(lastSamePixelCount == 0)
                    lastSamePixelCount = samePixelCount;

                var speed = document.getElementById("speed");
                speed.innerText = "Скорость: " + (samePixelCount - lastSamePixelCount) + " PP2M";

                lastSamePixelCount = samePixelCount;
            }


            function preloadImage() {

                writePixelChange = true;

                for (var y = 0; y < canvas.height; y++) {
                    for (var x = 0; x < canvas.width; x++) {
                        var imagePixelData = image.getImageData(x, y, 1, 1).data;
                        var boardPixelData = board.getImageData(startX + x, startY + y, 1, 1).data;

                        var colorId = getColorIdByPixel(imagePixelData);
                        var painted = isSamePixelColor(imagePixelData, boardPixelData);

                        var data = {
                            colorId: colorId,
                            painted: painted
                        };

                        if (!imagePixels[x])
                            imagePixels[x] = []

                        imagePixels[x][y] = data;
                    }
                }

                pixelsLoaded = true;

                /*if (modSettings.mode == "Random") {
                 imagePixels = shuffle(imagePixels);
                 }*/
            }

            function shuffle(array) {
                let counter = array.length;

                // While there are elements in the array
                while (counter > 0) {
                    // Pick a random index
                    let index = Math.floor(Math.random() * counter);

                    // Decrease counter by 1
                    counter--;

                    // And swap the last element with it
                    let temp = array[counter];
                    array[counter] = array[index];
                    array[index] = temp;
                }

                return array;
            }

            function generateRandomCoords()
            {
                for (var y = 0; y < canvas.height; y++) {
                    for (var x = 0; x < canvas.width; x++) {
                        var coord = {
                            x: x,
                            y: y
                        };
                        coordsRandomMethod.push(coord);
                    }
                }

                coordsRandomMethod = shuffle(coordsRandomMethod);
            }

            function isSamePixelColor(pixel1, pixel2) {
                for (var i = 0; i < 3; i++) {
                    if (pixel1[i] != pixel2[i])
                        return false;
                }
                return true;
            }


            function getColorIdByPixel(pixel) {
                var colors = [
                    [255, 255, 255],
                    [228, 228, 228],
                    [136, 136, 136],
                    [34, 34, 34],
                    [255, 167, 209],
                    [229, 0, 0],
                    [229, 149, 0],
                    [160, 106, 66],
                    [229, 217, 0],
                    [148, 224, 68],
                    [2, 190, 1],
                    [0, 211, 221],
                    [0, 131, 199],
                    [0, 0, 234],
                    [207, 110, 228],
                    [130, 0, 128]
                ];

                if (pixel[3] <= 127) {
                    return -1;
                }

                var color_id = -1;
                var flag = false;
                for (var i = 0; i < colors.length; i++) {
                    flag = true;
                    for (var j = 0; j < 3; j++) {
                        if (pixel[j] != colors[i][j]) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        color_id = i;
                        break;
                    }
                }
                if (color_id < 0)
                    console.log("pixel at x:" + coords.x + " y: " + coords.y + " has incorrect color.");

                return color_id;
            }

            function tryToDraw() {
                for (var y = 0; y < canvas.height; y++) {
                    for (var x = 0; x < canvas.width; x++) {
                        var pixelInfo = imagePixels[x][y];

                        if(pixelInfo.colorId != -1 && !pixelInfo.painted)
                        {
                            console.log("drawing " + title + " coords " + " x:" + (startX + x) + " y:" + (startY + y));

                            App.switchColor(pixelInfo.colorId);
                            App.doPlace(startX + x, startY + y);

                            if(isCaptcha)
                                return 40;

                            return 1;
                        }
                    }
                }
                return 1;
            }


            function tryToDrawRandom() {
                for (var i = 0; i < coordsRandomMethod.length; i++) {

                    var coord = coordsRandomMethod[i];

                    var pixelInfo = imagePixels[coord.x][coord.y];

                    if (pixelInfo.colorId != -1 && !pixelInfo.painted) {
                        console.log("drawing " + title + " coords " + " x:" + (startX + coord.x) + " y:" + (startY + coord.y));

                        App.switchColor(pixelInfo.colorId);
                        App.doPlace(startX + coord.x, startY + coord.y);

                        if (isCaptcha)
                            return 40;

                        return 1;
                    }

                }
                return 1;
            }

            function drawImage() {
                if (imageAlreadyLoaded) {
                    if(modSettings.mode == "Random")
                    {
                        if(coordsRandomMethod.length == 0)
                            generateRandomCoords();

                        return tryToDrawRandom();
                    }
                    else{
                        return tryToDraw();
                    }
                }
                return -1;
            }

            function isReady() {
                return imageAlreadyLoaded;
            }

            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                image = canvas.getContext('2d');
                image.drawImage(img, 0, 0, img.width, img.height);
                preloadImage();
                statsCounter();
                statsCounterInterval();
                imageAlreadyLoaded = true;
            };

            return {
                drawImage: drawImage,
                isReady: isReady
            }
        };

        var painter = Painter(image);

        var timerCount = 0;

        function draw() {

            if (image.title != modSettings.currentObjectTitle) {
                return;
            }

            var timer = (App.cooldown - (new Date).getTime()) / 1E3;
            if (0 < timer) {
                timerCount = timerCount + 1;
                if (timerCount == 9) {
                    console.log("timer: " + timer);
                    timerCount = 0;
                }

                setTimeout(draw, 1000);
            }
            else {

                if (painter.isReady()) {
                    var result = painter.drawImage();

                    if (result > 0) {
                        setTimeout(draw, result * 1000);
                        return;
                    } else {
                        return;
                    }
                } else {
                    setTimeout(draw, 3000);
                }
            }
        }

        draw();
    }

    ready();
}());
