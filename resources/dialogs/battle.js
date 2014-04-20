[{
    escapable: false,
    sections: {
        "menu": {
            x: 5,
            y: 5,
            width: 150,
            height: 150
        },
        "detail": {
            x: 160,
            y: 5,
            width: 635,
            height: 150
        }
    },
    passages: {
        mainMenu: {
            section: {
                "menu": {
                    oneOptionPerLine: true,
                    text: null,
                    options: [{
                            "id": "attack",
                            "text": "Attack",
                            "selected": true
                        }, {
                            "id": "magic",
                            "text": "PSI"
                        }, {
                            "id": "goods",
                            "text": "Goods"
                        }, {
                            "id": "run",
                            "text": "Run Away"
                        }, {
                            "id": "pray",
                            "text": "Pray"
                        }]
                }
            },
            onSelect: function(dialog, selectedOption) {
                console.log("Selected " + selectedOption);
                if(selectedOption==="run"){
                    com.manatee.battle.end();
                    com.manatee.dialog.close();
                }else if(selectedOption==="magic"){
                    com.manatee.dialog.passageId="psiSelect";
                    com.manatee.dialog.sectionId="detail";
                }
            }
        },
        psiSelect: {
            section: {
                "menu": {
                    oneOptionPerLine: true,
                    text: null,
                    options: [{
                            "id": "attack",
                            "text": "Attack"
                        }, {
                            "id": "magic",
                            "text": "PSI",
                            selected: "true"
                        }, {
                            "id": "goods",
                            "text": "Goods"
                        }, {
                            "id": "run",
                            "text": "Run Away"
                        }, {
                            "id": "pray",
                            "text": "Pray"
                        }]
                },
                "detail": {
                    oneOptionPerLine: false,
                    text: null,
                    options: [{
                            "id": "freeze",
                            "text": "Freeze",
                            selected: "true"
                        }, {
                            "id": "fire",
                            "text": "Fire"
                        }, {
                            "id": "shield",
                            "text": "Shield"
                        }]
                }
            },
            onSelect: function(dialog, selectedOption) {
                com.manatee.dialog.close();
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



