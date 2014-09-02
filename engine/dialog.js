importScripts('input.js', 'data.js', 'logger.js')

if (typeof (com) === "undefined") {
    com = {};
}

if (typeof (com.manatee) === "undefined") {
    com.manatee = {};
}

if (typeof (com.manatee.dialog) === "undefined") {
    com.manatee.dialog = (function() {
        var LOG = new Logger("dialog");
        var dialog = {};

        var _dialogs = {};
        var currentDialog = null;
        var currentPassageId = null;
        var currentSectionId = "default";

        var _promptMessage = null;

        var _defaultSection = {
            x: 5,
            y: 500,
            width: 790,
            height: 95,
            id: "default"
        };
        dialog._defaultGetOptions = function() {
            return this.options;
        };
        dialog._defaultGetText = function() {
            return this.text;
        };

        dialog.registerDialog = function(name, dialogLocation) {
            LOG.write("Registering dialog '" + name + "': " + dialogLocation)
            _dialogs[name] = dialogLocation;
        }
        dialog.isInDialog = function() {
            return currentDialog != null;
        }
        dialog.show = function(dialogName, target) {
            var dialog = _loadDialog(dialogName);
            if (dialog === undefined) {
                LOG.write("No dialog named " + dialogName);
            } else {
                if (dialog.sections === undefined) {
                    dialog.sections = {
                        "default": _defaultSection
                    };
                }

                if (dialog.startPassage === undefined) {
                    dialog.startPassage = Object.keys(dialog.passages)[0];
                }
                if (dialog.startSection === undefined) {
                    dialog.startSection = Object.keys(dialog.sections)[0];
                }
                currentPassageId = dialog.startPassage;
                currentSectionId = dialog.startSection;
                dialog.target = target;
                currentDialog = dialog;
            }
        }
        var _loadDialog = function(dialogName) {
            LOG.write("Locating dialog " + dialogName)
            var dialogLocation = _dialogs[dialogName];
            LOG.write("Dialog is located at " + dialogLocation)
            var dialog = com.manatee.data.loadScript(dialogLocation)[0];
            dialog.id = dialogName;
            return dialog;
        }

        dialog.showPassage = function(passageIdIn) {
            currentPassageId = passageIdIn;
        }
        dialog.showSection = function(sectionIdIn) {
            currentSectionId = sectionIdIn;
        }

        dialog.prompt = function(promptText) {
            dialog._promptMessage = promptText;
            dialog.show("prompt");
        }
        dialog.close = function() {
            if (currentDialog.onEnd !== undefined) {
                currentDialog.onEnd()
            }
            currentPassageId = null;
            currentDialog = null;
        }

        dialog.getCurrentSection = function() {
            var passage = dialog.getCurrentPassage();
            var section = passage.section[currentSectionId];
            if (section == undefined) {
                currentSectionId = Object.keys(passage.section)[0];
                section = passage.section[currentSectionId];
            }
            return section;
        }
        dialog.getCurrentPassage = function() {
            var passage = currentDialog.passages[currentPassageId];
            if (passage == undefined) {
                currentPassageId = Object.keys(currentDialog.passages)[0];
                passage = currentDialog.passages[currentPassageId];
            }
            return passage;
        }
        dialog.getSelectedOptionId = function() {
            var section = dialog.getCurrentSection();
            if (section.options != undefined && section.options.length != 0) {
                for (var currentOptionIndex = 0; currentOptionIndex < section.options.length; currentOptionIndex++) {
                    if (section.options[currentOptionIndex].selected) {
                        return currentOptionIndex;
                    }
                }
            }
            return null;
        }

        dialog.getSelectedOption = function() {
            var section = dialog.getCurrentSection();
            if (section == undefined || section.options == undefined) {
                return undefined;
            }
            return section.options[dialog.getSelectedOptionId()];
        }
        dialog.selectOption = function(newOptionIndex) {
            var section = dialog.getCurrentSection();

            dialog.getSelectedOption().selected = false;
            section.options[newOptionIndex].selected = true;
        }
        dialog.selectNextOption = function() {
            var section = dialog.getCurrentSection();
            var selectedOptionIndex = dialog.getSelectedOptionId();

            selectedOptionIndex++;
            if (selectedOptionIndex >= section.options.length) {
                selectedOptionIndex = 0;
            }
            dialog.selectOption(selectedOptionIndex);
        }
        dialog.selectPreviousOption = function() {
            var section = dialog.getCurrentSection();
            var selectedOptionIndex = dialog.getSelectedOptionId();

            selectedOptionIndex--;
            if (selectedOptionIndex < 0) {
                selectedOptionIndex = section.options.length - 1;
            }
            dialog.selectOption(selectedOptionIndex);
        }
        dialog.processSelectedOption = function() {
            var selectedOption = dialog.getSelectedOption();
            var optionId = selectedOption === undefined ? null : selectedOption.id
            LOG.write("Selected option " + optionId + " for " + currentDialog.id)
            dialog.getCurrentPassage().onSelect(currentDialog, optionId);
            LOG.write("Finished processing slected item");
        }

        dialog.processInputs = function() {
            var selectedOption = dialog.getSelectedOption();

            if (com.manatee.input.wasKeyJustPressed(27) && currentDialog.escapable) {
                dialog.close();
            }

            if (com.manatee.input.wasKeyJustPressed(13) || com.manatee.input.wasKeyJustPressed(32)) {
                dialog.processSelectedOption();
            }

            if (selectedOption !== undefined) {
                if (com.manatee.input.wasKeyJustPressed(39) || com.manatee.input.wasKeyJustPressed(40)) {
                    dialog.selectNextOption();
                }
                if (com.manatee.input.wasKeyJustPressed(37) || com.manatee.input.wasKeyJustPressed(38)) {
                    dialog.selectPreviousOption();
                }
            }
        }
        dialog.getCurrentDialogDisplay = function() {
            if (currentDialog == undefined || currentDialog == null) {
                return null;
            }

            LOG.write("Starting dialog display");

            var passage = dialog.getCurrentPassage();
            var display = new DialogDisplay();

            var displaySection = null;
            Object.keys(currentDialog.sections).forEach(function(sectionId) {
                var passageSection = passage.section[sectionId];
                if (passageSection != undefined) {
                    var section = currentDialog.sections[sectionId];
                    displaySection = new DialogDisplaySection();
                    displaySection.x = section.x;
                    displaySection.y = section.y;
                    displaySection.width = section.width;
                    displaySection.height = section.height;
                    if (passageSection.getText === undefined) {
                        LOG.write("Passage Section get text is undefined..., using default, it is " + passageSection.getText);
                        passageSection.getText = dialog._defaultGetText;
                    }
                    LOG.write("Getting section text for " + sectionId + " of " + currentPassageId);
                    displaySection.text = passageSection.getText();
                    displaySection.oneOptionPerLine = passageSection.oneOptionPerLine;
                    if (passageSection.getOptions == undefined) {
                        passageSection.getOptions = dialog._defaultGetOptions;
                    }
                    displaySection.options = passageSection.getOptions();
                    displaySection.preformatted = passageSection.preformatted;
                    display.sections.push(displaySection);
                }
            });
            LOG.write("Ending dialog display");
            return display;
        }

        return dialog;
    })()
}

function DialogDisplay() {
    this.sections = [];
}

function DialogDisplaySection() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.text = "";
}

