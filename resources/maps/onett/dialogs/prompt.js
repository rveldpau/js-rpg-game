[{
    passages: {
        promptText: {
            section: {
                "default": {
                    getText: function() {
                        return com.manatee.dialog._promptMessage;
                    }
                }
            },
            onSelect: function() {
                com.manatee.dialog.close();
            }
        }
    }
}]