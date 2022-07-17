
var list = document.querySelector("#limit-list");
var saveButton = document.querySelector("#save")

loadList();

// save list
saveButton.addEventListener("click", function(){
	 // Get the HTML contents of the list...
  	var html = list.innerHTML;

	// Write the HTML to local storage...
	localStorage.setItem("listHTML", html);
	setTimeout(function(){
		saveButton.style.display = (saveButton.style.display == 'none' ? '':'none');
	}, 200)
	setTimeout(function(){
		saveButton.style.display = (saveButton.style.display == 'none' ? '':'none');
	}, 400)
})


// load on refresh
function loadList() {
  // Read the saved HTML from local storage...
  var html = localStorage.getItem("listHTML");

  // Set it to the list HTML...
  list.innerHTML = html;
}
