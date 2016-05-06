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
            timestamp = $('.timestamp', cln);
            var d = new Date();
            var id = $('[name="id"]', cln);
            id[0].value = d.getTime();
            var times = d.toDateString() + " " + d.toLocaleTimeString()
            timestamp[0].innerText = times;
            cln.removeAttribute("hidden");
            todo.appendChild(cln);
            storestate();
        };

        document.addEventListener('DOMContentLoaded', retrievestate, false);
        function storestate() {
            var all_contents = [],
                all_titles = [];
            var current = document.getElementsByClassName('contents'),
                titles = document.getElementsByClassName('title'),
                id = document.getElementsByName('id'),

                json_data;
            console.log(current);
            for (var i = 0; i < current.length; i++) {
                console.log(current[i])
                if (current[i].offsetWidth > 0) {
                    all_contents.push({
                        "id": id[i].value,
                        "title": titles[i].innerText,
                        "content": current[i].innerText
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
                count = notesArray.length;
                var i;
                for (i = 0; i < count; i++) {
                    var cln = blankcard.cloneNode(true);
                    title = $('.title', cln)[0];
                    contents = $('.contents', cln)[0];
                    id = $('[name="id"]', cln)[0];
                    var storedNote = notesArray[i];
                    title.innerHTML = storedNote.title;
                    contents.innerHTML = storedNote.content;
                    id.value = storedNote.id;
                    cln.removeAttribute("hidden");
                    todo.appendChild(cln);
                }

                var timeoutID;
                $('[contenteditable]').bind('DOMCharacterDataModified', function() {
                    clearTimeout(timeoutID);
                    $that = $(this);
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
                var currentEl = {
                    "id": id.value,
                    "title": title,
                    "content": content
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
        });

        function toggle_trash(val) {
            is_trash_page = val;
            if (is_trash_page) {
                document.getElementById("title").innerHTML = "Trash";
                current_list = "trash";
                secondary_list = "jsontodolist";
                todo.innerHTML = "";
                blankcard = document.querySelector('#blanktrash'),
                submit_btn.style.visibility = "hidden";
                retrievestate();
            } else {
                document.getElementById("title").innerHTML = "Sticky Notes";
                current_list = "jsontodolist";
                secondary_list = "trash";
                todo.innerHTML = "";
                blankcard = document.querySelector('#blankcard'),
                submit_btn.style.visibility = "";
                retrievestate();
            }
        }