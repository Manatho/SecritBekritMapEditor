{
    //HTML 
    let html = `
    <div id="loadingmodal" class="progressbar-modal">
        <div class="progressbar-modal-content">

            <div class="progressbar-border">
                <div id="progressbar" class="progressbar"></div>
                <div id="message" class="progressbar-message">Hej</div>
            </div>
        </div>
    </div>
    `
    let htmlContainer = document.createElement('module');
    htmlContainer.innerHTML = html;
    document.getElementsByTagName('body')[0].appendChild(htmlContainer)

    //CSS
    let css = `\t<link rel="stylesheet" href="module/progressbar/taskmodal.css"></link>`
    document.getElementsByTagName('head')[0].innerHTML += css;
    
    

    let modal = document.getElementById("loadingmodal");
    let progressbar = document.getElementById("progressbar");
    let message = document.getElementById("message");

    class ProgressBarController {
        constructor(){

        }

        start() {
            modal.style.display = "block";
            progressbar.style.width = 0 + "%";
        }

        stop() {
            modal.style.display = "none";
        }

        set message(m) {
            message.innerHTML = m;
        }

        get message(){
            return message.innerHTML;
        }

        set progress(p){
            progressbar.style.display = "block";
            progressbar.style.width = p + "%";
        }

        get progress(){
            return progressbar.style.width;
        }

        set visible(bool){
            if (!bool) {
                progressbar.style.display = "none";
            } else {
                progressbar.style.display = "block";
            }
        }
    }

    

    var Progressbar = new ProgressBarController();

}
