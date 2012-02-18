$(function(){

  var template = 
    '<svg class="wire" xmlns="http://www.w3.org/2000/svg" version="1.1" style="position:absolute;left:<%= svgX() %>px;top:<%= svgY() %>px;width:<%= svgW() %>px;height:<%= svgH() %>px;">'+
      '<path class="wire-shadow" d="<%= svgPathShadow() %>" />'+
      '<path class="wire" d="<%= svgPath() %>" stroke="<%= color() %>" />'+
    '</svg>';

  Iframework.EdgeView = Backbone.View.extend({
    tagName: "div",
    className: "edge",
    template: _.template(template),
    positions: {},
    initialize: function () {
      this.render();
    },
    render: function () {
      this.calcPositions();
      // Don't use .toJSON() because using .source and .target Node
      this.$el.html(this.template(this));
      // if (this.model) {
      //   // Port insides
      //   this.model.source.view.$("div.port-out span.hole-"+this.model.get("source")[1]).css("background-color", this.model.get("color"));
      //   this.model.target.view.$("div.port-in span.hole-"+this.model.get("target")[1]).css("background-color", this.model.get("color"));
      // } else {
      if (!this.model) {
        // While dragging to connect
        this.$el.addClass("preview");
      }
      return this;
    },
    redraw: function () {
      this.calcPositions();
      this.$("svg").css({
        "left": this.svgX(),
        "top": this.svgY(),
        "width": this.svgW(),
        "height": this.svgH()
      });
      this.$("svg path.wire").attr("d", this.svgPath() );
      this.$("svg path.wire-shadow").attr("d", this.svgPathShadow() );
    },
    remove: function () {
      this.$el.remove();
    },
    setPositions: function (_positions) {
      this.positions = _positions;
    },
    calcPositions: function () {
      if (this.model) {
        // Connected edge
        var sourceName = this.model.get("source")[1];
        var targetName = this.model.get("target")[1];
        this.positions.fromX = this.model.source.view.portOffsetLeft('out', sourceName);
        this.positions.fromY = this.model.source.view.portOffsetTop('out', sourceName);
        this.positions.toX = this.model.target.view.portOffsetLeft('in', targetName);
        this.positions.toY = this.model.target.view.portOffsetTop('in', targetName);
      }
    },
    svgX: function () {
      return Math.min(this.positions.toX, this.positions.fromX) - 50;
    },
    svgY: function () {
      return Math.min(this.positions.toY, this.positions.fromY) - 25;
    },
    svgW: function () {
      return Math.abs(this.positions.toX - this.positions.fromX) + 100;
    },
    svgH: function () {
      return Math.abs(this.positions.toY - this.positions.fromY) + 50;
    },
    svgPath: function () {
      var fromX = this.positions.fromX - this.svgX();
      var fromY = this.positions.fromY - this.svgY();
      var toX = this.positions.toX - this.svgX();
      var toY = this.positions.toY - this.svgY();
      return "M "+ fromX +" "+ fromY +
        " L "+ (fromX+15) +" "+ fromY +
        " C "+ (fromX+50) +" "+ fromY +" "+ (toX-50) +" "+ toY +" "+ (toX-15) +" "+ toY +
        " L "+ toX +" "+ toY;
    },
    svgPathShadow: function () {
      // Same as svgPath() but y+1
      var fromX = this.positions.fromX - this.svgX();
      var fromY = this.positions.fromY - this.svgY() + 1;
      var toX = this.positions.toX - this.svgX();
      var toY = this.positions.toY - this.svgY() + 1;
      return "M "+ fromX +" "+ fromY +
        " L "+ (fromX+15) +" "+ fromY +
        " C "+ (fromX+50) +" "+ fromY +" "+ (toX-50) +" "+ toY +" "+ (toX-15) +" "+ toY +
        " L "+ toX +" "+ toY;
    },
    color: function () {
      if (this._color) {
        return this._color;
      }
      if (this.model) {
        // Connected
        return this._color = Iframework.getWireColor();
      } else {
        // Preview
        return Iframework.wireColors[Iframework.wireColorIndex];
      }
    },
    label: function () {
      return this.model.get("source")[0] +":"+ this.model.get("source")[1] + 
        '<span class="wiresymbol" style="color:' + this._color + '">&rarr;</span>' + 
        this.model.get("target")[0] +":"+ this.model.get("target")[1];
    }

  });

});