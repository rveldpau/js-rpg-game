function Model() {
    var changeListeners = {};
    var listeningFields = [];

    this.set = function (key, value) {
        var oldValue = this[key];
        if (oldValue === value) {
            return;
        }
        this[key] = value;
        var change = {
            key: key,
            value: value,
            oldValue: oldValue
        }

        if (changeListeners["*"] !== undefined) {
            changeListeners["*"].forEach(function (changeListener) {
                changeListener(change);
            }, change);
        }

        if (changeListeners[key] !== undefined) {
            changeListeners[key].forEach(function (changeListener) {
                changeListener(change);
            }, change);
        }
    }

    this.onChange = function (fields, func) {
        fields.split(";").forEach(function (field) {
            if (changeListeners[field] === undefined) {
                changeListeners[field] = [];
            }
            changeListeners[field].push(func);
        })
    }

    this.attach = function (field, input) {
        var me = this;

        var parseData = function (rawVal) {
            if (rawVal!="" && !isNaN(rawVal)) {
                return parseFloat(rawVal);
            } else {
                return rawVal;
            }
        }

        if (this[field] === undefined) {
            this[field] = parseData($(input).val());
        } else {
            $(input).val(this[field]);
        }


        this.onChange(field, function () {
            $(input).val(me[field]);
        })

        $(input).change(function (ev) {
            var rawVal = $(input).val();
            me.set(field, parseData(rawVal));
        })
        
        listeningFields.push(input);
    }
    
    this.detach = function () {
        listeningFields.forEach(function(input){
            $(input).unbind("change").val("");
        })
        listeningFields = [];
        changeListeners = {};
    }
}



