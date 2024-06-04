chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    if (data.msg === 'do-scraping') {
        DoScrape()
    }
});

//https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
//helper function --> wait for an element to load completely
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


async function DoScrape() {
    //create a notifer element
    let notifer_el = document.createElement("div");
    notifer_el = document.createElement("div");
    notifer_el.style.zIndex = 999;
    notifer_el.style.backgroundColor = "#0080ff";
    notifer_el.style.color = "#ffffff";
    notifer_el.style.position = "absolute";
    notifer_el.style.left = "12px";
    notifer_el.style.top = "12px";
    notifer_el.style.width = "300px";
    notifer_el.style.fontSize = "smaller";
    notifer_el.style.padding = "6px 10px 6px 8px";
    notifer_el.style.border = "3px solid #ffd000";
    notifer_el.style.borderRadius = "7px";
    notifer_el.innerHTML = "Telegram Member Scraper (by v-User) </ br> Scraping process started...";
    console.log("Scraping process started...");
    document.body.insertBefore(notifer_el, document.body.firstChild);

    let all_members_info = "", black_list='';

    const memberRows = document.querySelectorAll("div.search-super-container-members ul.chatlist > a");
    if (memberRows.length) {

        let index = 0;
        let iAll = memberRows.length;
        let doWhile = true;

        const member_amount_info = `Found ${iAll} members`;
        notifer_el.innerHTML = "Telegram Member Scraper (by v-User) </ br> " + member_amount_info;
        console.log(member_amount_info);

        try{
            while (doWhile) {
                for (let i=0; i<memberRows.length; i++) {
                    let userLink = memberRows[i];

                    if (userLink){
                        userLink.click();
                        //userLink.dispatchEvent(new MouseEvent("mousedown", {view: window, bubbles: true, cancelable: true, buttons: 1}));
                        await wait(3000);

                        //profile page (member)
                        let name = document.querySelector(".profile-content .profile-avatars-info .profile-name .peer-title");
                        let nameText = name ? name.textContent : '';

                        let phone = document.querySelector(".profile-content .sidebar-left-section-container .row-clickable:first-child .row-title");
                        let phoneNumber = phone ? phone.textContent : '';

                        let username = document.querySelector(".profile-content .sidebar-left-section-container .row-clickable:nth-child(2) .row-title");
                        let usernameText = username ? username.textContent : '';

                        let bio = document.querySelector(".profile-content .sidebar-left-section-container .row-clickable .row-title.pre-wrap");
                        let bioText = bio ? bio.textContent : '';

                        let current_member_info = `Name: ${nameText}, Phone: ${phoneNumber}, Username: ${usernameText}, Bio: ${bioText}`;
                        console.log(current_member_info);

                        if (!black_list.includes(current_member_info)){
                            await wait(1000);
                            index++;
                            all_members_info += current_member_info + "\r\n";
                            black_list = black_list + current_member_info;
                            if (index > 150){
                                throw new Error('break');
                            }
                        }else {
                            doWhile = false;
                        }
                        notifer_el.innerHTML = "Telegram Member Scraper (by v-User) <br> " + current_member_info;
                    }
                    let member_number_info = `Member ${index + 1}/${iAll}`;
                    notifer_el.innerHTML = "Telegram Member Scraper (by v-User) </ br> " + member_number_info;




                    //click to button for backing to the list of members
                    let backBtn = document.querySelector('.sidebar-header .chat-info-container .sidebar-close-button');
                    let sidebarHeader = document.querySelector('.sidebar-header');
                    if (sidebarHeader) {
                        backBtn.click();
                    }
                    await wait(2000);
                }
            }
        }catch (error){
            if (error.message !== 'break') throw error;
        }


        notifer_el.innerHTML = "Telegram Member Scraper (by v-User) </ br> Scraping process finished.";
        console.log("Scraping process finished.");

		//get group name for exporting file name later
		let fnE = document.querySelector(".sidebar-header .chat-info .content .top .peer-title ");
		let fn = fnE ? fnE.textContent : "v-user-export-data.txt";
		fn = fn.replace(/[\/\\?%*:|"<>.]/g, '-'); // remove illegal chars from the file name

        all_members_info = all_members_info.replace("#", "-")
        //save as a text file
        const uri = "data:text/plain;charset=utf-8," + all_members_info;
        let ea = document.createElement("a");
        ea.href = uri;
        ea.download = fn; //group name
        document.body.appendChild(ea);
        ea.click();
        // 	document.body.removeChild(ea);

    } else {
        notifer_el.style.backgroundColor = "#ad0000";
        notifer_el.innerHTML = "Telegram Member Scraper (by v-User) </ br> Error: Members list is not visible!";
        console.log("Error: Members list is not visible!");
    }
    document.body.removeChild(notifer_el);
}

// ساخت فانکشن برای ایجاد مکث -----------------
function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}