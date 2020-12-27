'use strict';

var attributes_json = [];

Main();

console.log("Decode main");


function Main()
{
    fetch_json("https://xmuni.github.io/afc-catalog/attributes_output.json");


    // Load();
}


function Load()
{
    console.log("Loading");

    const query_string = window.location.search;
    console.log(query_string);

    var version = query_string.split('=')[0].replace('?v','');
    var floors = query_string.split('=')[1].split(';');
    
    // console.log(version);
    console.log(floors);

    // First two digits = hex of floor number
    // Every subsequent pair of digits = [option_type_index, chosen_option_index]

    // var all_floor_options = [];
    var chosen_floor_options = {};

    floors.forEach(string => {

        var floor_type = parseInt(string.slice(0,2),16); // Convert hex to decimal
        var options_str = "";
        if(string.length > 3)
            options_str = string.slice(2);

        console.log("Floor index (decimal):", floor_type, "Options:", options_str);

        chosen_floor_options[floor_type] = {
            "name": attributes_json[floor_type]["name"],
            "img": attributes_json[floor_type]["img"],
            "options": [],
        };

        attributes_json[floor_type]["options"].forEach(option => {
            chosen_floor_options[floor_type]["options"].push({
                "label": option["label"],
                "value": option["values"][option["default"]],
            });
        });

        console.log(attributes_json[floor_type]);

        // console.log("Chosen floor options");
        // console.log(chosen_floor_options);

        // var attributes = attributes_json[floor_type];
        // console.log("Attributes for floor type",floor_type);
        // console.log(attributes);

        
        // attributes["options"].forEach(option => {
        //     var default_index = option["default"];
        //     text_options[floor_type] = {
        //         "label": option["label"],
        //         "value": option["values"][default_index],
        //     };
        // });
        
        var options = split_string_into_pairs_of_two(options_str);
        // console.log(options);
        options.forEach(option => {
            console.log(option);
            var i = parseInt(option[0]);
            var j = parseInt(option[1]);

            var value = attributes_json[floor_type]["options"][i]["values"][j];
            chosen_floor_options[floor_type]["options"][i]["value"] = value;

            // text_options[floor_type] = {
            //     "label": attributes["options"][i]["label"],
            //     "value": attributes["options"][i]["values"][j],
            // };
        });
        // attributes["options"].forEach(option => {
        //     options.push([option[0], option[1][0]])
        // });
        // all_floor_options.push(text_options);
        // console.log("Text options:",text_options);

        // var defaults = {};
        // attributes["options"].forEach(option => {
            
        // });
    });

    console.log("Chosen_floor_options:");
    console.log(chosen_floor_options);


    var decoded_listing = document.querySelector("#decoded-listing");
    decoded_listing.innerText = "";

    for(const [key,value] of Object.entries(chosen_floor_options)) {
        decoded_listing.innerText += "\n";
        decoded_listing.innerText += value["name"];
        decoded_listing.innerText += "\n";
        value["options"].forEach(option => {
            decoded_listing.innerText += `${option["label"]}: ${option["value"]}\n`;
        });
        decoded_listing.innerText += "\n";
    }

    /*
    all_floor_options.forEach(floor => {
        floor.forEach(option => {
           decoded_listing.innerText += option.join(": ");
           decoded_listing.innerText += "\n";
        });
        decoded_listing.innerText += "\n";
    });
    */
}

function split_string_into_pairs_of_two(str)
{
    var pairs = [];
    for(var i=0; i<str.length/2; i++)
    {
        var index1 = 2*i;
        var index2 = 2*i +1;
        pairs.push([str[index1], str[index2]]);
        /*
        012345 --> [0,1], [2,3], [4,5]

        0 --> 0,1
        1 --> 2,3
        2 --> 4,5
        */
    }
    return pairs;
}

function fetch_json(url)
{
	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
            attributes_json = data;
            Load();
			// localStorage.setItem(flname,JSON.stringify(data));
		})
		.catch(error => console.error(error))
}
