/**
 * Constructor
 */
function Utils() {};



/**
 * Close the browser opened by showWebPage.
 */
Utils.prototype.copyToClipboard = function (text) {
    if (typeof text === "undefined" || text === null) text = "";
        Cordova.exec(this.onSuccess, this.onFail, "Clipboard", "copy", [text]);
};


Utils.prototype.onSuccess = function (err){
	console.log("Utils.prototype.onSuccess! " + err);
	Materialize.toast("Copied into Clipboard", 4000);


}

Utils.prototype.onFail = function (){
	console.log("Utils.prototype.failed!");
	Materialize.toast("FAIL COPY - Preparado para copy to clipboard pero falta migrar la versión de cordova para que pueda funcionar", 4000);
}

