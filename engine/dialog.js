if(typeof(com)=="undefined"){
    com = {};
}

if(typeof(com.manatee) == "undefined"){
    com.manatee = {};
}

if(typeof(com.manatee.dialog) == "undefined"){
    com.manatee.dialog = {
        currentDialog:null,
        _promptMessage:null,
        _defaultSection: {
            x:5,
            y:500,
            width:790,
            height:95,
            id:"default"
        },
        _defaultGetOptions: function(){
            return this.options;
        },
        _defaultGetText: function(){
            return this.text;
        },
        _dialogs:{
            prompt:{
                passages:{
                    promptText:{
                        section:{
                            "default":{
                                getText: function(){
                                    return com.manatee.dialog._promptMessage;
                                }
                            }
                        },
                        onSelect: function(selectedOption){
                            com.manatee.dialog.close();
                        }
                    }
                }
            },
            menu:{
                escapable:true,
                sections:{
                    "menu":{
                        x:5,
                        y:5,
                        width:150,
                        height:150
                    },
                    "status":{
                        x:165,
                        y:5,
                        width:620,
                        height:500
                    }
                },
                passages:{
                    mainMenu:{
                        section:{
                            "menu":{
                                oneOptionPerLine: true,
                                text:null,
                                options:[{
                                    "id":"talk",
                                    "text":"Talk to",
                                    "selected":true
                                },{
                                    "id":"check",
                                    "text":"Check"
                                },{
                                    "id":"goods",
                                    "text":"Goods"
                                },{
                                    "id":"equip",
                                    "text":"Equip"
                                },{
                                    "id":"status",
                                    "text":"Status"
                                }]
                            }
                        },
                        
                        onSelect: function(selectedOption){
                            if(selectedOption=="status"){
                                com.manatee.dialog.passageId = 'status';
                            }
                            else if(selectedOption=="talk"){
                                var talkIntent = new Intent();
                                talkIntent.intentId = "talk";
                                talkIntent.object = com.manatee.game.loop.world.character;
                                com.manatee.intents.addIntent(talkIntent);
                                com.manatee.dialog.close();
                            }else if(selectedOption=="check"){
                                var interactIntent = new Intent();
                                interactIntent.intentId = "interact";
                                interactIntent.object = com.manatee.game.loop.world.character;
                                com.manatee.intents.addIntent(interactIntent);
                                com.manatee.dialog.close();
                            }else{
                                com.manatee.dialog.close();
                            }
                        }
                    },
                    status:{
                        section:{
                            "menu":{
                                oneOptionPerLine: true,
                                text:null,
                                options:[{
                                    "id":"talk",
                                    "text":"Talk to"
                                },{
                                    "id":"check",
                                    "text":"Check"
                                },{
                                    "id":"goods",
                                    "text":"Goods"
                                },{
                                    "id":"equip",
                                    "text":"Equip"
                                },{
                                    "id":"status",
                                    "text":"Status",
                                    "selected":true
                                }]
                            },
                            "status":{
                                getText: function(){
                                    return "This is a test!\nBlah\n\nBlah\n    Test";
                                },
                                preformatted:true,
                                options:[]
                            }
                        },
                        
                        onSelect: function(selectedOption){
                            com.manatee.dialog.passageId = 'menu';
                        }
                    }
                }
            },
            test:{
                passages:{
                    firstPassage:{
                        section:{
                            "default":{
                                oneOptionPerLine: true,
                                text:"Do you want to hear more?",
                                options:[{
                                    "id":"yes",
                                    "text":"Yes",
                                    "selected":true
                                },{
                                    "id":"no",
                                    "text":"No way!"
                                },{
                                    "id":"maybe",
                                    "text":"Maybe..."
                                }]
                            }
                        },
                        
                        onSelect: function(selectedOption){
                            if(selectedOption=="no"){
                                com.manatee.dialog.close();
                            }else{
                                com.manatee.dialog.passageId = 'secondPassage';
                            }
                        }
                    },
                    secondPassage:{
                        section:{
                            "default":{
                                text:"To be or not to be, that is the question, whether tis nobler in heart",
                                options:[]
                            }
                        },
                        onSelect: function(selectedOption){
                            com.manatee.dialog.close();
                        }
                    }
                },
                onEnd: function(){
                    console.log("Conversation Done")
                }
            }
        },
        passageId:null,
        sectionId:"default",
        isInDialog: function(){
            return com.manatee.dialog.currentDialog!=null;
        },
        show: function(dialogName){
            var dialog = com.manatee.dialog._dialogs[dialogName];
            
            if(dialog==undefined){
                console.log("No dialog named " + dialogName);
            }else{
                if(dialog.sections==undefined) {
                    dialog.sections = {
                        "default":com.manatee.dialog._defaultSection
                    };
                }

                if(dialog.startPassage==undefined){
                    dialog.startPassage = Object.keys(dialog.passages)[0];
                }
                if(dialog.startSection==undefined){
                    dialog.startSection = Object.keys(dialog.sections)[0];
                }
                com.manatee.dialog.passageId = dialog.startPassage;
                com.manatee.dialog.sectionId = dialog.startSection;
                com.manatee.dialog.currentDialog = dialog;
            }
        },
        prompt: function(promptText){
            com.manatee.dialog._promptMessage = promptText;
            com.manatee.dialog.show("prompt");
        },
        close: function(){
            if(com.manatee.dialog.currentDialog.onEnd != undefined){
                com.manatee.dialog.currentDialog.onEnd()
            }
            com.manatee.dialog.passageId = null;
            com.manatee.dialog.currentDialog = null;
        },
        processInputs: function(){
            var dialog = com.manatee.dialog.currentDialog;
            
            var section = com.manatee.dialog.getCurrentSection();
            var selectedOptionIndex = com.manatee.dialog.getSelectedOptionId();
            var selectedOption = undefined;
            if(selectedOptionIndex!=null){
                selectedOption = section.options[selectedOptionIndex];
            }

            if(com.manatee.input.wasKeyJustPressed(27) && dialog.escapable){
                com.manatee.dialog.close();
            }
            
            if(com.manatee.input.wasKeyJustPressed(13) || com.manatee.input.wasKeyJustPressed(32)){
                com.manatee.dialog.getCurrentPassage().onSelect(selectedOption==undefined?null:selectedOption.id);
            }
            
            if(com.manatee.input.wasKeyJustPressed(39) || com.manatee.input.wasKeyJustPressed(40)){
                selectedOption.selected = false;
                
                selectedOptionIndex++;
                if(selectedOptionIndex>=section.options.length){
                    selectedOptionIndex=0;
                }
                section.options[selectedOptionIndex].selected = true;
            }
            if(com.manatee.input.wasKeyJustPressed(37) || com.manatee.input.wasKeyJustPressed(38)){
                selectedOption.selected = false;
                
                selectedOptionIndex--;
                if(selectedOptionIndex<0){
                    selectedOptionIndex=section.options.length-1;
                }
                section.options[selectedOptionIndex].selected = true;
            }
        },
        getSelectedOptionId: function(){
            var section = com.manatee.dialog.getCurrentSection();
            if(section.options != undefined && section.options.length!=0){
                for(var currentOptionIndex = 0;currentOptionIndex<section.options.length;currentOptionIndex++){
                    if(section.options[currentOptionIndex].selected){
                        return currentOptionIndex;
                    }
                }
            }
            return null;
        },
        getCurrentSection: function(){
            var passage = com.manatee.dialog.getCurrentPassage();
            var section = passage.section[com.manatee.dialog.sectionId];
            if(section==undefined){
                com.manatee.dialog.sectionId = Object.keys(passage.section)[0];
                section = passage.section[com.manatee.dialog.sectionId];
            }
            return section;
        },
        getCurrentPassage: function(){
            var dialog = com.manatee.dialog.currentDialog;
            var passage = dialog.passages[com.manatee.dialog.passageId];
            if(passage==undefined){
                com.manatee.dialog.passageId = Object.keys(dialog.passages)[0];
                passage = dialog.passages[com.manatee.dialog.passageId];
            }
            return passage;
        },
        getCurrentDialogDisplay: function(){
            var dialog = com.manatee.dialog.currentDialog;
            if(dialog==undefined||dialog==null){
                return null;
            }
            var passage = com.manatee.dialog.getCurrentPassage();
            var display = new DialogDisplay();
            var displaySection = null;
            Object.keys(dialog.sections).forEach(function(sectionId){
                var passageSection = passage.section[sectionId];
                if(passageSection!=undefined){
                    var section = dialog.sections[sectionId];
                    displaySection = new DialogDisplaySection();
                    displaySection.x = section.x;
                    displaySection.y = section.y;
                    displaySection.width = section.width;
                    displaySection.height = section.height;
                    if(passageSection.getText==undefined){
                        passageSection.getText = com.manatee.dialog._defaultGetText;
                    }
                    displaySection.text = passageSection.getText();
                    displaySection.oneOptionPerLine = passageSection.oneOptionPerLine;
                    if(passageSection.getOptions==undefined){
                        passageSection.getOptions = com.manatee.dialog._defaultGetOptions;
                    }
                    displaySection.options = passageSection.getOptions();
                    displaySection.preformatted = passageSection.preformatted;
                    display.sections.push(displaySection);
                }
            });
            
            return display;
        }
    }
}

function DialogDisplay(){
    this.sections = [];
}

function DialogDisplaySection(){
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.text = "";
}

