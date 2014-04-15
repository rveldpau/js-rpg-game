[{
    passages: {
        firstPassage: {
            section: {
                "default": {
                    oneOptionPerLine: true,
                    text: "Do you want to hear more?",
                    options: [{
                            "id": "yes",
                            "text": "Yes",
                            "selected": true
                        }, {
                            "id": "no",
                            "text": "No way!"
                        }, {
                            "id": "maybe",
                            "text": "Maybe..."
                        }]
                }
            },
            onSelect: function(selectedOption) {
                if (selectedOption == "no") {
                    com.manatee.dialog.close();
                } else {
                    com.manatee.dialog.passageId = 'secondPassage';
                }
            }
        },
        secondPassage: {
            section: {
                "default": {
                    text: "To be or not to be, that is the question, whether tis nobler in heart",
                    options: []
                }
            },
            onSelect: function(selectedOption) {
                com.manatee.dialog.close();
            }
        }
    },
    onEnd: function() {
        console.log("Conversation Done")
    }
}]