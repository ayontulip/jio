module.exports = {
    getMessageHtml: function (err) {  
        var gerError = "";
        var error = err.ValidationError;
        for (var key in error) {
            if (error.hasOwnProperty(key)) {
                for (var ekey in error[key]) {
                    if (error[key].hasOwnProperty(ekey)) {
                        gerError += "<p>"+ error[key][ekey]["message"]+ "</p>";
                    }
                }
            }
        }
        return gerError;
    }
}