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
                            "id": "fight",
                            "text": "Sally forth!"
                        }]
                }
            },
            onSelect: function(dialog, selectedOption) {
                if (selectedOption === "fight") {
                    console.log("About to start battle...");
                    com.manatee.battle.start([dialog.target]);
                    com.manatee.dialog.close();
                }else if (selectedOption === "no") {
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
            onSelect: function() {
                com.manatee.dialog.close();
            }
        }
    },
    onEnd: function() {
        console.log("Conversation Done")
    }
}]