
var checkboxes = [];
var box_values = [];

Main();

function Main()
{
    console.log("Main");
    var checkboxes = document.querySelectorAll(".box input.simple-custom-checkbox");
    console.log(checkboxes);

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("click", RefreshMenu);
    });

    document.querySelectorAll(".box select").forEach(select => {
        select.addEventListener("change", RefreshMenu);
    });

    RefreshMenu();
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

        var div = document.createElement("div");
        div.classList.add("description");
        div.innerText = `${name}\n${options.join("\n")}`;

        var entry = document.createElement("div");
        entry.classList.add("entry");
        entry.appendChild(div);
        entry.appendChild(img);

        listing.appendChild(entry);
    });

    if(Object.keys(box_values).length < 1)
        document.querySelector("#panel").classList.add("hidden");
    else
        document.querySelector("#panel").classList.remove("hidden");

}
