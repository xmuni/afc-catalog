'use strict';


var checkboxes = [];
var box_values = [];

const base_url = "https://xmuni.github.io/afc-catalog/request?";

var attributes_json = {};

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

    fetch_json("https://xmuni.github.io/afc-catalog/attributes_output.json");

    document.querySelector("#minimize").addEventListener("click", function() {
        var panel = document.querySelector("#panel");
        if(panel.classList.contains("minimized"))
            panel.classList.remove("minimized");
        else
            panel.classList.add("minimized");
    });
}


function fetch_json(url)
{
	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
            attributes_json = data;
            RefreshMenu();
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
                chosen_options.push({
                    "index": select.selectedIndex,
                    "text": select.options[select.selectedIndex].text
                });
            });

            var box_name = box.querySelector(".floor-name").innerText;
            var imgsrc = box.querySelector("a img").getAttribute("src");
            // console.log(box_name, chosen_options);
            box_values.push({
                "id": box.getAttribute("data-floorid"),
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
        var options_text = [];
        options.forEach(option => {
            options_text.push(option["text"]);
        });

        var img = document.createElement("img");
        img.setAttribute("src",imgsrc);
        
        var a = document.createElement("a");
        a.setAttribute("data-fancybox", "gallery");
        a.setAttribute("href", imgsrc);
        a.appendChild(img);

        var div = document.createElement("div");
        div.classList.add("description");
        div.innerText = `${name}\n${options_text.join("\n")}`;

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

    if(attributes_json)
    {
        const query_code = make_code();
        // document.querySelector("#url-base").innerText = base_url;
        document.querySelector("#url-query").innerText = base_url+query_code;
        document.querySelector("#floor-link").setAttribute("href",base_url+query_code);
    }
}

function get_floor_attribute_index(name)
{
    for(var i=0; i<attributes_json.length; i++)
    {
        if(attributes_json[i]["name"] == name)
            return i;
    }
    
    return -1;
}

// Returns a string
function num_to_hex(num,length)
{
    var hex = parseInt(num).toString(16);
    // console.log(typeof(num),num,"-->",typeof(hex),hex);

    // Add leading zero
    var length_difference = length - hex.length;
    if(hex.length < length)
        return ["0".repeat(length_difference), hex].join('');
    else
        return hex;
}

function get_option_index(text,array)
{
    console.log(text,array);
    for(var i=0; i<array.length; i++)
    {
        if(array[i][0] == text)
            return i;
    }
    return -1;
}

function make_code()
{
    var hex_strings = [];

    box_values.forEach(box => {
        var options = box_values["options"];

        // var attribute_index = get_floor_attribute_index(box["name"]);
        var floor_id = box["id"];
        console.log("Floor id:",typeof(floor_id),floor_id);
        // var attributes = attributes_json[i];
        // console.log(attributes);

        var box_hexes = [];

        box_hexes.push(num_to_hex(floor_id,2));

        for(var i=0; i<box["options"].length; i++)
        {
            var option = box["options"][i];
            const chosen_index = option["index"];

            // Only encode option if it's not the default
            // if(!attributes_json[attribute_index]["default"].includes(option["text"]))
            if(Object.keys(attributes_json) == 0 || attributes_json[floor_id]["options"][i]["default"] != chosen_index)
            // if(true)
            {
                // Add index of option
                // console.log(i, option["index"], option["text"]);
                // var option_index = get_option_index(chosen_text, attributes_json[attribute_index]["options"]);
                box_hexes.push(i);
                // Add index of chosen option value
                box_hexes.push(num_to_hex(option["index"],1));
            }
        }

        hex_strings.push(box_hexes.join(''));

        // console.log(hex_strings);

        /*
        console.log(attribute_index, attributes_json[attribute_index]["name"]);
        box["options"].forEach(option => {
            console.log(option["index"], option["text"]);
        });
        console.log("--------")
        */
    });

    // console.log(hex_strings);

    // return "v1=" + hex_strings.join(';');
    return hex_strings.join(';');
}
