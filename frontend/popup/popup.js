// Check off specfic todos by clicking
$("ul").on("click", "li", function(){
	$(this).toggleClass("completed");
});

// Click on x to delete item
$("ul").on("click", "span", function(event){
	$(this).parent().fadeOut(300, function(){
		$(this).remove();
	});
	event.stopPropagation();
});

// To add new todo
$("input[type='text']").keypress(function(event){
	if(event.which === 13){
		var url = $(this).val();
		$(this).val("");
    const duration = document.getElementById('duration-textbox');
		$("ul").append("<li class='blocked-url'><span class='delete-icon material-symbols-outlined'>delete</span>" + url  + "<div class='duration' id='duration-value'>" + duration.value + "</div>" + "</li>");
    duration.value = "00:00:00"
	}
});


// Click pencil to edit function
$("#toggle-form").click(function(){
	$("input[type='text']").fadeToggle();
});

// Clear all function
$("#clear-all").click(function(){
	$("li").fadeOut(300, function(){
		$("li").remove();
	});
});

chrome.runtime.onInstalled.addListener(() => {
  updateBlockedUrlTimes()
})


function updateBlockedUrlTimes() {
  const blockedUrl = document.getElementsByClassName("blocked-url")
  let currentUrl;
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, tabs => {
    if (tabs.length > 0) {
      currentUrl = tabs[0].url.toString()
      console.log(currentUrl)
      for (let url of blockedUrl) {
        if (checkDomainMatch(currentUrl, url.innerText.substring("delete".length, url.innerText.length-8))) {
          console.log('match')
          console.log(url)
          let timer = url.getElementsByClassName('duration')
          timer = timer[0];
          console.log(timer.innerText)
          let interval = setInterval(function() {
            var parts = timer.innerText.split(':')
            const nextTime = getNextTime(parts[0], parts[1], parts[2])
            if (nextTime === '00:00:00' || (parts[0] === '00' && parts[1] === '00' && parts[2] === '00')) {
              console.log('blocking')
              // Get the HTML contents of the list...
  	var html = list.innerHTML;

    // Write the HTML to local storage...
    localStorage.setItem("listHTML", html);

              chrome.tabs.update({ url: 'https://annie2409.github.io/No-Access/' })
              clearInterval(interval)
              timer.innerText = '00:00:00'
            } else {
              timer.innerText = nextTime
            }

          }, 1000)
        }
      }
    }
  })
}


const checkDomainMatch = (current, target) => {
  console.log(current)
  console.log(target)
  if (!target.startsWith("https")) {
    target = "https://" + target;
  }
  return current.startsWith(target) || current == target || target.startsWith(current)
}

chrome.webNavigation.onCompleted.addListener((info) => {
  console.log('start updating')
  updateBlockedUrlTimes()
})

const getNextTime = (hh, mm, ss) => {
  let seconds = parseInt(ss)
  let minutes = parseInt(mm)
  let hours = parseInt(hh)

  seconds = seconds - 1
  let newSs = seconds % 60
  let newMm = (Math.floor(seconds / 60)) % 60
  let newHh = Math.floor((Math.floor(seconds / 60)) / 60)
  let newNewSs = newSs.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  })
  let newNewMin = newMm.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  })
  let newNewHh = newHh.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  })
  return newNewHh + ":" + newNewMin + ":" + newNewSs
}
