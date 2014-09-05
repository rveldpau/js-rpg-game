importScripts('input.js','logger.js')

if (typeof (com) === "undefined") {
    com = {};
}

if (typeof (com.manatee) === "undefined") {
    com.manatee = {};
}

if (typeof (com.manatee.battle) === "undefined") {
    com.manatee.battle = (function() {
        var LOG = new Logger("battle");
        var battle = {};
        var currentBattle = null;
        battle.isInBattle = function() {
            return currentBattle !== null;
        }
        battle.start = function(enemies) {
            LOG.write("Staring battle against " + enemies.length + " enemies");
            enemies.forEach(function(enemy) {
                LOG.write("\tID:    " + enemy.id);
                LOG.write("\tLife: " + enemy.battle.life);
                LOG.write("----------------------")
            })
            LOG.write("Enemy ID");
            currentBattle = {
                "enemies": enemies
            };
        };
        battle.process = function() {
            if (!com.manatee.dialog.isInDialog() && battle.isInBattle()) {
                com.manatee.dialog.show("battle", currentBattle);
            }


        }
        battle.end = function() {
            Object.keys(currentBattle.enemies).forEach(
                    function(key) {
                        com.manatee.game.loop.getWorld().currentMap.remove(currentBattle.enemies[key]);
                    }
            )
            currentBattle = null;
        }
        battle.processInputs = function() {
        }
        battle.getCurrentBattleDisplay = function() {
            return currentBattle;
        }
        LOG.write("Loaded Battle system")
        return battle;
    })()

}

function Battle() {
    this.enemies = [];
    this.enemiesDefeated = function() {
        var allDefeated = true;
        this.enemies.some(function(enemy) {
            if (enemy.battle.life !== undefined && enemy.battle.life !== 0) {
                allDefeated = false;
            }
            return true;
        });
        return allDefeated;
    }
}