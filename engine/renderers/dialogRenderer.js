var _drawDialogSectionText = function(canvas, section) {

    var line = '';
    var x = section.x + 5;
    var y = section.y + 25;
    var lineHeight = 20;
    if (section.text !== null) {
        if (section.preformatted) {
            var lines = section.text.split('\n');
            lines.forEach(function(line) {
                canvas.fillText(line, x, y);
                y += lineHeight;
            })

        } else {
            var words = section.text.split(' ');
            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = canvas.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > section.width && n > 0) {
                    canvas.fillText(line, x, y);
                    line = words[n] + ' ';
                    y += lineHeight;
                }
                else {
                    line = testLine;
                }
            }
        }
        canvas.fillText(line, x, y);
        y += lineHeight;
    }

    var optionPad = 20;
    var optionX = x + optionPad;
    if (section.options != undefined) {
        section.options.forEach(function(option) {

            if (option.selected) {
                option.text = ">" + option.text
                canvas.fillStyle = 'rgb(255,255,255)';
            } else {
                canvas.fillStyle = 'rgb(200,200,200)';
            }
            var optionWidth = canvas.measureText(option.text).width;
            if (optionWidth + optionX > section.x + section.width) {
                optionX = x + optionPad;
                y += lineHeight;
            }
            canvas.fillText(option.text, optionX, y);
            if (section.oneOptionPerLine) {
                optionX = x + optionPad;
                y += lineHeight;
            } else {
                optionX += optionWidth + optionPad;
            }

        })
    }
}

var renderer = function(properties) {
    var canvas = properties.canvas;
    var dialog = properties.objects;
    canvas.clearRect(0,0,properties.screen.width,properties.screen.height);
    if (dialog === null) {
        return;
    }
    var section = null;
    canvas.fillStyle = 'rgba(0,0,0,0.2)';
    canvas.fillRect(0, 0, 640, 480);
    Object.keys(dialog.sections).forEach(function(sectionId) {
        section = dialog.sections[sectionId];
        canvas.fillStyle = 'rgba(0,0,0,0.6)';
        canvas.fillRect(section.x, section.y, section.width, section.height);
        canvas.fillStyle = 'rgba(255,255,255,1)';
        canvas.font = "20px 'courier new'";
        _drawDialogSectionText(canvas,section);
    })
};

return renderer;