var fontSize = 26;
var fontName = "Helvetica";
var marginX = 130;
var marginY = 40;

var scoreItem = cc.Sprite.extend({
    ctor:function(id, pos, x, y, rot, score){
        console.log("ADD SCORE ITEM - angle: "+rot);
        this._super();
        this.name = "score_"+id;
        this.rot = rot;
        this.score = score.toString();


        var alignment = cc.TEXT_ALIGNMENT_LEFT;

        var posX = x*screen_width;
        var posY = y*screen_height;

        var display = "Score:\n"+this.score;
        this.label = new cc.LabelTTF(display,fontName, fontSize);

        switch (pos){
            case "B":
                posY += marginY +this._getHeight()/2;
                posX += marginX;
                break;

            case "T":
                posY -= marginY + this._getHeight()/2;
                posX -= marginX;
                break;

            case "L":
                posX += marginY +this._getHeight()/2;
                posY -= marginX;
                break;

            case "R":
                posX -= marginY +this._getHeight()/2;
                posY += marginX;
                break;
        }

        this.label.textAlign = alignment;

        this.setPosition(cc.p(posX, posY));
        this.setRotation(this.rot);

        this.addChild(this.label);
    },
    updateDisplay: function (value) {
        this.score = value.toString();
        var display = "Score:\n"+this.score;
        this.label.setString(display);
    }
});

var coinItem = cc.Sprite.extend({
    ctor:function(id, pos, x, y, rot, coin){
        this._super();
        this.name = "coin_"+id;
        this.rot = rot;
        this.coin = coin;

        var posX = x*screen_width;
        var posY = y*screen_height;

        var display = "Coin:\n"+this.coin;
        this.label = new cc.LabelTTF(display,fontName, fontSize);
        var alignment = cc.TEXT_ALIGNMENT_RIGHT;

        switch (pos){
            case "B":
                posY += marginY +this._getHeight()/2;
                posX -= marginX;
                break;

            case "T":
                posY -= marginY + this._getHeight()/2;
                posX += marginX;
                break;

            case "L":
                posX += marginY +this._getHeight()/2;
                posY += marginX;
                break;

            case "R":
                posX -= marginY +this._getHeight()/2;
                posY -= marginX;
                break;
        }

        this.label.textAlign = alignment;

        this.setPosition(cc.p(posX, posY));
        this.setRotation(this.rot);

        this.addChild(this.label);
    },
    updateDisplay: function (value) {
        this.score = value.toString();
        var display = "Coin:\n"+this.score;
        this.label.setString(display);
    }
});