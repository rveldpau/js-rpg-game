if(typeof(com)=="undefined"){
    com = {};
}

if(typeof(com.manatee) == "undefined"){
    com.manatee = {};
}

if(typeof(com.manatee.dialog) == "undefined"){
    com.manatee.dialog = {
        currentDialog:null,
        _defaultSection: {
            x:5,
            y:500,
            width:790,
            height:95,
            id:"default"
        },
        _dialogs:{
            test:{
                passages:{
                    firstPassage:{
                        sectionText:{
                            "default":"Something is strange in the state of denmark..."
                        },
                        options:[],
                        onSelect: function(selectedOption){
                            com.manatee.dialog.passageId = 'secondPassage';
                        }
                    },
                    secondPassage:{
                        sectionText:{
                            "default":"To be or not to be..."
                        },
                        options:[],
                        onSelect: function(selectedOption){
                            com.manatee.dialog.close();
                        },
                    }
                },
                onEnd: function(){
                    console.log("Done")
                }
            }
        },
        passageId:null,
        isInDialog: function(){
            return com.manatee.dialog.currentDialog!=null;
        },
        show: function(dialogName){
            var dialog = com.manatee.dialog._dialogs[dialogName];
            if(dialog.sections==undefined){
                dialog.sections = {"default":com.manatee.dialog._defaultSection};
            }
            if(dialog==undefined){
                console.log("No dialog named " + dialogName);
            }else{
                com.manatee.dialog.currentDialog = dialog;
            }
        },
        close: function(){
            com.manatee.dialog.passageId = null;
            com.manatee.dialog.currentDialog = null;
        },
        processInputs: function(){
            if(com.manatee.input.wasKeyJustPressed(13) || com.manatee.input.wasKeyJustPressed(32)){
                com.manatee.dialog.getCurrentPassage().onSelect();
            }
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
                var section = dialog.sections[sectionId];
                displaySection = new DialogDisplaySection();
                displaySection.x = section.x;
                displaySection.y = section.y;
                displaySection.width = section.width;
                displaySection.height = section.height;
                displaySection.text = passage.sectionText[sectionId];
                displaySection.options = passage.options;
                display.sections.push(displaySection);
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

