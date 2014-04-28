importScripts('input.js')

if (typeof (com) === "undefined") {
    com = {};
}

if (typeof (com.manatee) === "undefined") {
    com.manatee = {};
}

if (typeof (com.manatee.battle) === "undefined") {
    com.manatee.battle = {
        currentBattle: null,
        isInBattle: function() {
            return com.manatee.battle.currentBattle !== null;
        },
        start: function(enemies) {
            console.log("Staring battle against " + enemies.length + " enemies");
            enemies.forEach(function(enemy){
                console.log("\tID:    " + enemy.id);
                console.log("\tLife: " + enemy.life);
                console.log("----------------------")
            })
            console.log("Enemy ID");
            com.manatee.battle.currentBattle = {
                "enemies":enemies
            };
            
            
        },
        process: function(){
            if(!com.manatee.dialog.isInDialog() && com.manatee.battle.isInBattle()){
                com.manatee.dialog.show("battle",com.manatee.battle.currentBattle);
            }
            
            
        },
        end: function() {
            Object.keys(com.manatee.battle.currentBattle.enemies).forEach(
                function(key){
                    com.manatee.game.loop.world.currentMap.remove(com.manatee.battle.currentBattle.enemies[key]);
                }
            )
            com.manatee.battle.currentBattle = null;
        },
        processInputs: function() {
        },
        getCurrentBattleDisplay: function() {
            return com.manatee.battle.currentBattle;
        }
    }
    console.log("Loaded Battle system")
}

function Battle() {
    this.enemies = [];
    this.enemiesDefeated = function() {
        var allDefeated = true;
        this.enemies.some(function(enemy) {
            if (enemy.life !== undefined && enemy.life !== 0) {
                allDefeated = false;
            }
            return true;
        });
        return allDefeated;
    }
}