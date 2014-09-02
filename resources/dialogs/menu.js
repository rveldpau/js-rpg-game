[{
    escapable: true,
    sections: {
        "menu": {
            x: 5,
            y: 5,
            width: 150,
            height: 150
        },
        "status": {
            x: 165,
            y: 5,
            width: 620,
            height: 500
        }
    },
    passages: {
        mainMenu: {
            section: {
                "menu": {
                    oneOptionPerLine: true,
                    text: null,
                    options: [{
                            "id": "talk",
                            "text": "Talk to",
                            "selected": true
                        }, {
                            "id": "check",
                            "text": "Check"
                        }, {
                            "id": "goods",
                            "text": "Goods"
                        }, {
                            "id": "equip",
                            "text": "Equip"
                        }, {
                            "id": "status",
                            "text": "Status"
                        }]
                }
            },
            onSelect: function(dialog, selectedOption) {
                if (selectedOption == "status") {
                    com.manatee.dialog.passageId = 'status';
                }
                else if (selectedOption == "talk") {
                    var talkIntent = new Intent();
                    talkIntent.intentId = "talk";
                    talkIntent.object = com.manatee.game.loop.getWorld().character;
                    com.manatee.intents.addIntent(talkIntent);
                    com.manatee.dialog.close();
                } else if (selectedOption == "check") {
                    var interactIntent = new Intent();
                    interactIntent.intentId = "interact";
                    interactIntent.object = com.manatee.game.loop.getWorld().character;
                    com.manatee.intents.addIntent(interactIntent);
                    com.manatee.dialog.close();
                } else {
                    com.manatee.dialog.close();
                }
            }
        },
        status: {
            section: {
                "menu": {
                    oneOptionPerLine: true,
                    text: null,
                    options: [{
                            "id": "talk",
                            "text": "Talk to"
                        }, {
                            "id": "check",
                            "text": "Check"
                        }, {
                            "id": "goods",
                            "text": "Goods"
                        }, {
                            "id": "equip",
                            "text": "Equip"
                        }, {
                            "id": "status",
                            "text": "Status",
                            "selected": true
                        }]
                },
                "status": {
                    getText: function() {
                        return "This is a test!\nBlah\n\nBlah\n    Test";
                    },
                    preformatted: true,
                    options: []
                }
            },
            onSelect: function(selectedOption) {
                com.manatee.dialog.passageId = 'menu';
            }
        }
    }
}]

