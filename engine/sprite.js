function SpriteFrame(){
    this.id = null;
    this.img = null;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
}

function Sprite() {
    this.id = null;
    this.name = null;
    this.frames = [];
    //Number of milliseconds to show frame for
    this.frameDisplayTime = 100;
    //Frame displayed for
    this._currentFrameShown = 0;
    this.currentFrame = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    
    //The time elapsed since the last draw of anything...
    this.getCurrentFrame = function(timeElapsed){
        this._currentFrameShown += timeElapsed;
        if(this.frames.length==0){
            return this.frames[0];
        }
        
        if(this._currentFrameShown > this.frameDisplayTime){
            this._currentFrameShown = 0;
            this.currentFrame++;
            if(this.currentFrame>=this.frames.length){
                this.currentFrame = 0;
            }
        }
        return this.frames[this.currentFrame];
    }
}