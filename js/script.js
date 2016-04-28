(function () {
    var todo = document.querySelector('#example-row'),
        form = document.querySelector('form'),
        field = document.querySelector('#blankcard'),
        content = document.querySelector('#newitem-title'),
        blankcard = document.querySelector('#blankcard'),
        submit_btn = document.getElementById('submit');
    console.log(submit_btn);
    submit_btn.onclick = function () {
        alert("Hello");
        
        var cln = blankcard.cloneNode(true);
        timestamp = $('.timestamp',cln);
        var d = new Date();
        var times = d.toDateString() + " " + d.toLocaleTimeString() 
        timestamp[0].innerText = times;    
        cln.removeAttribute("hidden");
        todo.appendChild(cln);
        storestate();
    };

    todo.addEventListener('click', function (ev) {
        var t = ev.target;
        if (t.tagName === 'LI') {
            if (t.classList.contains('done')) {
                t.parentNode.removeChild(t);
            } else {
                t.classList.add('done');
            }
            storestate();
        }
        ev.preventDefault();
    }, false);

    document.addEventListener('DOMContentLoaded', retrievestate, false);
    var all_contents = [],
        all_titles = [];

    function storestate() {
        var current = document.getElementsByClassName('contents'),
            titles = document.getElementsByClassName('title'),
            json_data;
        console.log(current);
        for (var i = 0; i < current.length; i++) {
            console.log(current[i])
            all_contents.push({
                "title": titles[i].innerText,
                "content": current[i].innerText
            });
            all_titles.push(titles[i].innerText);
        } 
        console.log(all_contents);
        json_data = JSON.stringify(all_contents);
        localStorage.jsontodolist = json_data;
        localStorage.todolist = todo.innerHTML;
    }

    function retrievestate() {
        if (localStorage.todolist) {
            todo.innerHTML = localStorage.todolist;
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
            alert("Delete Pressed!!");
            event.target.parentElement.parentElement.parentElement.remove();
            storestate();
        }
    });

})();