importScripts('input.js','data.js')

if(typeof(com)==="undefined"){
    com = {};
}

if(typeof(com.manatee) === "undefined"){
    com.manatee = {};
}

if(typeof(com.manatee.dialog) === "undefined"){
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
        _dialogs:{},
        passageId:null,
        sectionId:"default",
        registerDialog: function(name,dialogLocation){
            console.log("Registering dialog '" + name + "': " + dialogLocation)
            com.manatee.dialog._dialogs[name] = dialogLocation;
        },
        isInDialog: function(){
            return com.manatee.dialog.currentDialog!=null;
        },
        _loadDialog: function(dialogName){
            console.log("Locating dialog " + dialogName)
            var dialogLocation = com.manatee.dialog._dialogs[dialogName];
            console.log("Dialog is located at " + dialogLocation)
            var dialogScript = com.manatee.data.loadText(dialogLocation);
            console.log("Executing script: " + dialogScript)
            var dialog = eval(dialogScript)[0];
            dialog.id = dialogName;
            return dialog;
        },
        show: function(dialogName, target){
            var dialog = com.manatee.dialog._loadDialog(dialogName);
            if(dialog===undefined){
                console.log("No dialog named " + dialogName);
            }else{
                if(dialog.sections===undefined) {
                    dialog.sections = {
                        "default":com.manatee.dialog._defaultSection
                    };
                }

                if(dialog.startPassage===undefined){
                    dialog.startPassage = Object.keys(dialog.passages)[0];
                }
                if(dialog.startSection===undefined){
                    dialog.startSection = Object.keys(dialog.sections)[0];
                }
                com.manatee.dialog.passageId = dialog.startPassage;
                com.manatee.dialog.sectionId = dialog.startSection;
                dialog.target = target;
                com.manatee.dialog.currentDialog = dialog;
            }
        },
        prompt: function(promptText){
            com.manatee.dialog._promptMessage = promptText;
            com.manatee.dialog.show("prompt");
        },
        close: function(){
            if(com.manatee.dialog.currentDialog.onEnd !== undefined){
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
            if(selectedOptionIndex!==null){
                selectedOption = section.options[selectedOptionIndex];
            }

            if(com.manatee.input.wasKeyJustPressed(27) && dialog.escapable){
                com.manatee.dialog.close();
            }
            
            if(com.manatee.input.wasKeyJustPressed(13) || com.manatee.input.wasKeyJustPressed(32)){
                var optionId = selectedOption===undefined?null:selectedOption.id
                console.log("Selected option " + optionId + " for " + dialog.id)
                com.manatee.dialog.getCurrentPassage().onSelect(dialog, optionId);
            }
            
            if(selectedOption!==undefined){
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
                    if(passageSection.getText===undefined){
                        console.log("Passage Section get text is undefined..., using default, it is " + passageSection.getText);
                        passageSection.getText = com.manatee.dialog._defaultGetText;
                    }
                    console.log("Getting section text for " + sectionId + " of " + com.manatee.dialog.passageId);
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

