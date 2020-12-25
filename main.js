'use strict';


var checkboxes = [];
var box_values = [];

var attributes_json = [];

Main();


function Main()
{
    // console.log("Main");
    var checkboxes = document.querySelectorAll(".box input.simple-custom-checkbox");
    // console.log(checkboxes);

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("click", RefreshMenu);
    });

    document.querySelectorAll(".box select").forEach(select => {
        select.addEventListener("change", RefreshMenu);
    });

    RefreshMenu();

    fetch_json("https://xmuni.github.io/afc-catalog/attributes.json");
}


function fetch_json(url)
{
	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			attributes_json = data;
			// localStorage.setItem(flname,JSON.stringify(data));
		})
		.catch(error => console.error(error))
}


function RefreshMenu()
{
    console.log("Refreshing menu");

    box_values = [];

    document.querySelectorAll(".box").forEach(box => {
        var checkbox = box.querySelector("input.simple-custom-checkbox");
        if(checkbox.checked) {
            var selects = box.querySelectorAll("select");

            var chosen_options = [];
            selects.forEach(select => {
                var chosen_option = select.options[select.selectedIndex].text; // or value
                chosen_options.push(chosen_option);
            });

            var box_name = box.querySelector(".floor-name").innerText;
            var imgsrc = box.querySelector("a img").getAttribute("src");
            // console.log(box_name, chosen_options);
            box_values.push({
                "name": box_name,
                "imgsrc": imgsrc,
                "options": chosen_options,
            });
        }

    });

    // console.log(box_values);

    var listing = document.querySelector("#listing");
    while(listing.firstChild) {
        listing.removeChild(listing.firstChild);
    }
    
    
    // for(const [key,value] of Object.entries(box_values)) {
    box_values.forEach(values => {
        const {name,imgsrc,options} = values;

        var img = document.createElement("img");
        img.setAttribute("src",imgsrc);
        
        var a = document.createElement("a");
        a.setAttribute("data-fancybox", "gallery");
        a.setAttribute("href", imgsrc);
        a.appendChild(img);

        var div = document.createElement("div");
        div.classList.add("description");
        div.innerText = `${name}\n${options.join("\n")}`;

        var entry = document.createElement("div");
        entry.classList.add("entry");
        entry.appendChild(div);
        entry.appendChild(a);

        listing.appendChild(entry);
    });

    if(Object.keys(box_values).length < 1)
        document.querySelector("#panel").classList.add("hidden");
    else
        document.querySelector("#panel").classList.remove("hidden");

}
