"use strict";
var todoGlobal = {};
(function() {
    var is_trash_page = false;
    var current_list = "jsontodolist";
    var secondary_list = "trash";
    var item = "blankcard"
    var todo = document.querySelector('#example-row'),
        blankcard = document.querySelector('#blankcard'),
        submit_btn = document.getElementById('submit');

    // Add New Note
    submit_btn.onclick = function() {
        var cln = blankcard.cloneNode(true);
//        var timestamp = $('.timestamp', cln);
        var d = new Date();
        var id = $('[name="id"]', cln);
        id[0].value = d.getTime();
//        var times = d.toDateString() + " " + d.toLocaleTimeString()
//        timestamp[0].innerText = times;
        cln.removeAttribute("hidden");
        // todo.appendChild(cln);
        todo.insertBefore(cln, todo.childNodes[0]);
        cln.querySelector(".title").focus();
        storestate();
    };

    document.addEventListener('DOMContentLoaded', retrievestate, false);

    function storestate() {
        var all_contents = [],
            all_titles = [];
        var current = document.getElementsByClassName('contents'),
            titles = document.getElementsByClassName('title'),
            id = document.getElementsByName('id'),
//            timestamp = document.getElementsByClassName('timestamp'),

            json_data;
        var img = document.getElementsByClassName("todoImage");
        console.log(current);
        for (var i = 0; i < current.length; i++) {
            console.log(current[i])
            if (current[i].offsetWidth > 0) {
                all_contents.push({
                    "id": id[i].value,
                    "title": titles[i].innerText,
                    "content": current[i].innerText,
                    "img": getBase64Image(img[i])
                });
                all_titles.push(titles[i].innerText);
            }
        }
        console.log(all_contents);
        json_data = JSON.stringify(all_contents);
        localStorage[current_list] = json_data;
    }

    function retrievestate() {
        if (localStorage[current_list]) {
            var notesArray = JSON.parse(localStorage[current_list]);
            var count = notesArray.length;
            var i;
            for (i = 0; i < count; i++) {
                var cln = blankcard.cloneNode(true);
                var title = $('.title', cln)[0];
                var contents = $('.contents', cln)[0];
                var id = $('[name="id"]', cln)[0];
                var img = $('.todoImage', cln)[0];
                var timestamp = $('.timestamp', cln)[0];

                var storedNote = notesArray[i];
                title.innerHTML = storedNote.title;
                contents.innerHTML = storedNote.content;
                id.value = storedNote.id;
                timestamp.value = storedNote.timestamp;
                img.src = fetchImage(storedNote.img);
                cln.removeAttribute("hidden");
                todo.appendChild(cln);
            }

            var timeoutID;
            $('[contenteditable]').bind('DOMCharacterDataModified', function() {
                clearTimeout(timeoutID);
                var $that = $(this);
                timeoutID = setTimeout(function() {
                    $that.trigger('change')
                }, 50)
            });
            $('[contentEditable]').bind('change', function() {
                console.log($(this).text());
                storestate();
            })
        }
    };

    document.body.addEventListener("click", function(event) {
        if (event.target.classList.contains("delete")) {
            var notesArray = [];
            var parentEl = event.target.parentElement.parentElement.parentElement;
            var title = parentEl.querySelector(".title").innerText;
            var content = parentEl.querySelector(".contents").innerText;
            var id = parentEl.querySelector("[name='id']");
            var img = parentEl.querySelector(".todoImage");

            var currentEl = {
                "id": id.value,
                "title": title,
                "content": content,
                "img": getBase64Image(img)
            };
            if (localStorage[secondary_list]) {
                notesArray = JSON.parse(localStorage[secondary_list]);
            }
            notesArray.push(currentEl);
            localStorage[secondary_list] = JSON.stringify(notesArray);
            console.log(parentEl);
            console.log(currentEl);
            parentEl.remove();
            storestate();
        }

        if (event.target.classList.contains("imageSelector")) {
            event.target.onchange = function() {
                var notesArray = [];
                var parentEl = event.target.parentElement.parentElement.parentElement;
                var img = parentEl.querySelector(".todoImage");
                var file = event.target.files[0];
                var toDoType = "image";
                var fReader = new FileReader();
                fReader.onload = function() {
                    //console.log(fReader.result);
                    img.src = fReader.result;
                    var task = getBase64Image(img);
                    storestate();
                };
                fReader.readAsDataURL(file);
            }
        }
    });

    todoGlobal.toggle_trash = function(val) {
        is_trash_page = val;
        todo.innerHTML = "";

        if (is_trash_page) {
            document.getElementById("title").innerHTML = "Trash";
            current_list = "trash";
            secondary_list = "jsontodolist";
            blankcard = document.querySelector('#blanktrash'),
                submit_btn.style.visibility = "hidden";
        } else {
            document.getElementById("title").innerHTML = "Sticky Notes";
            current_list = "jsontodolist";
            secondary_list = "trash";
            blankcard = document.querySelector('#blankcard'),
                submit_btn.style.visibility = "";
        } //convert thr image data into binary
        retrievestate();
    }

    //convert thr image data into binary
    function getBase64Image(img) {
        if (img) {
            console.log(img.width);
            var canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        }
    }

    //return the url of image for displaying
    function fetchImage(dataImage) {
        if (dataImage != "data:,") {
            return "data:image/png;base64," + dataImage;
        } else {
            return "";
        }
    }
}());