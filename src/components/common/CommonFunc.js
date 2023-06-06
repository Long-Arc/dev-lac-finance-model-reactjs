export default {
    NumericCellEditor() {
        function isCharNumeric(charStr) {
            return !!/\d/.test(charStr);
        }
        function isKeyPressedNumeric(event) {
            var charCode = getCharCodeFromEvent(event);
            var charAllowed = [".", "Backspace"];
            var charStr = String.fromCharCode(charCode);
            return isCharNumeric(charStr) || charAllowed.includes(charStr);
        }
        function getCharCodeFromEvent(event) {
            event = event || window.event;
            return typeof event.which === "undefined" ? event.keyCode : event.which;
        }
        function NumericCellEditor() { }
        NumericCellEditor.prototype.init = function (params) {
            this.focusAfterAttached = params.cellStartedEdit;
            this.eInput = document.createElement("input");
            this.eInput.style.width = "100%";
            this.eInput.style.height = "100%";
            this.eInput.value = isCharNumeric(params.charPress) ? params.charPress : params.value;
            var that = this;
            this.eInput.addEventListener("keypress", function (event) {
                if (!isKeyPressedNumeric(event)) {
                    that.eInput.focus();
                    if (event.preventDefault) event.preventDefault();
                }
            });
        };
        NumericCellEditor.prototype.getGui = function () {
            return this.eInput;
        };
        NumericCellEditor.prototype.afterGuiAttached = function () {
            if (this.focusAfterAttached) {
                this.eInput.focus();
                this.eInput.select();
            }
        };
        NumericCellEditor.prototype.isCancelBeforeStart = function () {
            return this.cancelBeforeStart;
        };
        NumericCellEditor.prototype.isCancelAfterEnd = function () { };
        NumericCellEditor.prototype.getValue = function () {
            return this.eInput.value;
        };
        NumericCellEditor.prototype.focusIn = function () {
            var eInput = this.getGui();
            eInput.focus();
            eInput.select();
            console.log("NumericCellEditor.focusIn()");
        };
        NumericCellEditor.prototype.focusOut = function () {
            console.log("NumericCellEditor.focusOut()");
        };
        return NumericCellEditor;
    },

    validateForm(errors) {
        let valid = true;
        Object.keys(errors).map(function (e) {
            if (errors[e].length > 0) {
                valid = false;
            }
        });
        return valid;
    },

    getDate(datetime) {
        var date_components = (datetime.split("T")[0]).split("-");
        var year = date_components[0];
        var month = date_components[1];
        var day = date_components[2];
        return year + '-' + month + '-' + day;
    },

    ExcelDateToJSDate(date) {
        let converted_date = new Date(Math.round((date - 25569) * 864e5));
        converted_date = String(converted_date).slice(4, 15)
        date = converted_date.split(" ")
        let day = date[1];
        let month = date[0];
        month = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3 + 1
        if (month.toString().length <= 1)
            month = '0' + month
        let year = date[2];
        return String(year + '-' + month + '-' + day)
    }
}