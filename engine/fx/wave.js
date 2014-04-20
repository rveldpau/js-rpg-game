if (com.manatee.graphics.effects.wave === undefined) {
    wave = {};
    wave.currentOffset = 0;
    wave.currentOffsetInc = 1;
    wave.lastDrawTime = null;
    waveEffect = function(context) {
        
        var width = context.canvas.width;
        var dataLineWidth = width * 4;
        var height = context.canvas.height;
        var waveOffset = wave.currentOffset;
        var incrementer = 0.1;
        var imgData = context.getImageData(0,0,width,height);
        var imgDataArr = imgData.data;
        for(var y=0;y<height;y+=2){
            var xDifference = Math.round(Math.sin(waveOffset) * 10) * 4;
            var yOffset = y*dataLineWidth;
            
            var startingPoint = yOffset + dataLineWidth - xDifference;
            for(var x=0;x<dataLineWidth;x+=8){
                imgDataArr[yOffset+x] = imgDataArr[startingPoint + x];
                imgDataArr[yOffset+x+1] = imgDataArr[startingPoint + x+1];
                imgDataArr[yOffset+x+2] = imgDataArr[startingPoint + x+2];
                imgDataArr[yOffset+x+3] = imgDataArr[startingPoint + x+3];
            }
            waveOffset+=incrementer;
        }
        imgData.data = imgDataArr;
        context.putImageData(imgData,0,0);
        if(wave.lastDrawTime!==null){
            var diff = new Date() - wave.lastDrawTime;
            wave.currentOffset += wave.currentOffsetInc * (diff/1000);
        }else{
            wave.currentOffset += wave.currentOffsetInc;
        }
        
        wave.lastDrawTime = new Date();
        
        
    }
    
    com.manatee.graphics.effects.registerEffect("wave",waveEffect);
}

