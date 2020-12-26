'use strict';

var attributes_json = [];

Main();



function Main()
{
    fetch_json("https://xmuni.github.io/afc-catalog/attributes.json");
}


function Load()
{
    const query_string = window.location.search;
    console.log(query_string);

    var version = query_string.split('=')[0].replace('?v','');
    var floors = query_string.split('=')[1].split(';');
    
    console.log(version);
    console.log(floors);

    // First two digits = hex of floor number
    // Every subsequent pair of digits = [option_type_index, chosen_option_index]

    var all_floor_options = [];

    floors.forEach(string => {
        var floor_type = parseInt(string.slice(0,2));
        var options_str = "";
        if(string.length > 3)
            options_str = string.slice(2);

        console.log(floor_type,options_str);

        var attributes = attributes_json[floor_type];
        console.log(attributes);

        var options = split_string_into_pairs_of_two(options_str);
        console.log(options);

        var text_options = [];

        options.forEach(option => {
            console.log(option);
            var i = parseInt(option[0]);
            var j = parseInt(option[1]);
            text_options.push([attributes["options"][i][0], attributes["options"][i][1][j]]);
        });
        // attributes["options"].forEach(option => {
        //     options.push([option[0], option[1][0]])
        // });
        all_floor_options.push(text_options);
        console.log("Text options:",text_options);

        // var defaults = {};
        // attributes["options"].forEach(option => {
            
        // });
    });

    var decoded_listing = document.querySelector("#decoded-listing");
    decoded_listing.innerText = "";

    all_floor_options.forEach(floor => {
        floor.forEach(option => {
           decoded_listing.innerText += option.join(": ");
           decoded_listing.innerText += "\n";
        });
        decoded_listing.innerText += "\n";
    });
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
