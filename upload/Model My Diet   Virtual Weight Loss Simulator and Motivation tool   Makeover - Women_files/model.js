(function() {
  var MenModelController, ModelControllerBase, ModelView, QuestionnaireView, WomenModelController,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ModelView = (function() {

    function ModelView() {
      var defineGetterSetter, imageTags, tag, _i, _len;
      defineGetterSetter = function(tag) {
        var baseName, getterName, setterName;
        baseName = tag.replace(/-/g, "_").camelize();
        getterName = "get" + baseName;
        setterName = "set" + baseName;
        ModelView.prototype[getterName] = function() {
          return $("#" + tag).attr("src");
        };
        return ModelView.prototype[setterName] = function(value) {
          return $("#" + tag).attr("src", value);
        };
      };
      imageTags = ["current-image", "current-customize-image", "goal-image"];
      for (_i = 0, _len = imageTags.length; _i < _len; _i++) {
        tag = imageTags[_i];
        defineGetterSetter(tag);
      }
    }

    return ModelView;

  })();

  QuestionnaireView = (function() {

    function QuestionnaireView() {}

    QuestionnaireView.prototype.addVisualAdjustmentListener = function(listener) {
      return $(".model-config.model-visual_adjustment.btn").click(function(e) {
        var value;
        value = $(e.currentTarget).attr("value");
        return listener(value);
      });
    };

    QuestionnaireView.prototype.addUnitsListener = function(listener) {
      var _this = this;
      $(".model-config.unit-selection.metric").click(function(e) {
        return listener('metric');
      });
      return $(".model-config.unit-selection.imperial").click(function(e) {
        return listener('imperial');
      });
    };

    QuestionnaireView.prototype.visualAdjustment = function(value) {
      if (typeof value !== "undefined") {
        $("#visual_adjustment").val(value);
      }
      return $("#visual_adjustment").val();
    };

    QuestionnaireView.prototype.units = function(units) {
      $("#height").html($("#_" + units + "_height").html());
      $('.weight-units').html($("#_" + units + "_weight_units").html());
      return $('.height-units').html($("#_" + units + "_height_units").html());
    };

    QuestionnaireView.prototype.weight = function(weight) {
      if (weight != null) {
        $('#weight').val(weight);
      }
      return $('#weight').val();
    };

    QuestionnaireView.prototype.goal = function(goal) {
      if (goal != null) {
        $('#goal').val(goal);
      }
      return $('#goal').val();
    };

    QuestionnaireView.prototype.height = function(height) {
      if (height != null) {
        $('#height').val(height);
      }
      return $('#height').val();
    };

    return QuestionnaireView;

  })();

  ModelControllerBase = (function() {

    function ModelControllerBase(gender, blurImage, defaultParameters) {
      this.view = new ModelView();
      this.questionnaireView = new QuestionnaireView();
      this.gender = gender;
      this.compositorUrl = "http://model.modelmydiet.com/" + this.gender;
      this.modelParameters = (function(gender, defaultParameters) {
        if ($.cookie(gender) === null) {
          return defaultParameters;
        } else {
          return JSON.parse($.cookie(gender));
        }
      })(this.gender, defaultParameters);
      this.views = ["front", "left", "back", "right"];
      this.currentViewIndex = 0;
      this.blurImage = blurImage;
    }

    ModelControllerBase.prototype.convertWeight = function(units, weight) {
      if (units === 'metric') {
        return Math.round(weight * 10 / 2.2) / 10;
      }
      if (units === 'imperial') {
        return Math.round(weight * 2.2);
      }
    };

    ModelControllerBase.prototype.convertHeight = function(units, height) {
      if (units === 'imperial') {
        return Math.round(height / 2.54);
      }
      if (units === 'metric') {
        return Math.round(height * 2.54);
      }
    };

    ModelControllerBase.prototype.loadUnitValues = function() {
      this.questionnaireView.units(this.modelParameters.units);
      this.questionnaireView.weight(this.modelParameters.weight);
      this.questionnaireView.goal(this.modelParameters.goal);
      return this.questionnaireView.height(this.modelParameters.height);
    };

    ModelControllerBase.prototype.loadQuestionnaire = function() {
      var _this = this;
      this.loadUnitValues();
      return this.questionnaireView.addUnitsListener(function(value) {
        if (_this.modelParameters.units !== value) {
          _this.modelParameters.weight = _this.convertWeight(value, _this.modelParameters.weight).toString();
          _this.modelParameters.goal = _this.convertWeight(value, _this.modelParameters.goal).toString();
          _this.modelParameters.height = _this.convertHeight(value, _this.modelParameters.height).toString();
          _this.modelParameters.units = value;
          return _this.loadUnitValues();
        }
      });
    };

    ModelControllerBase.prototype.saveModel = function() {
      return $.cookie(this.gender, JSON.stringify(this.modelParameters));
    };

    ModelControllerBase.prototype.updatePinItButton = function(image) {
      var a, href;
      a = $(".pinterest-button > a");
      href = a.attr("href");
      return a.attr("href", href.replace(/http%3A%2F%2Fimages.modelmydiet.com.*.jpeg/, encodeURIComponent(image)));
    };

    ModelControllerBase.prototype.loadModelImage = function() {
      var _this = this;
      this.view.setCurrentImage(this.blurImage);
      this.view.setCurrentCustomizeImage(this.blurImage);
      this.view.setGoalImage(this.blurImage);
      $("#current-customize-image").attr("src", this.blurImage);
      $.ajax({
        type: "POST",
        url: this.compositorUrl,
        data: JSON.stringify(this.modelParameters),
        contentType: "text/plain",
        dataType: "json",
        success: function(data) {
          _this.view.setCurrentImage(data.current);
          _this.view.setCurrentCustomizeImage(data.current);
          _this.view.setGoalImage(data.goal);
          return _this.updatePinItButton(data.goal);
        }
      });
      return this.saveModel();
    };

    ModelControllerBase.prototype.updateParameters = function(name, value) {
      this.modelParameters[name] = value;
      return this.loadModelImage();
    };

    ModelControllerBase.prototype.bindQuestionnaire = function() {
      var _this = this;
      $("#open_questionnaire").click(function() {
        return $("#model-tabs a[href='#questionnaire-tab']").tab("show");
      });
      $("#close_questionnaire").click(function() {
        return $("#model-tabs a[href='#model-tab']").tab("show");
      });
      $("#update_model").click(function() {
        _this.updateParameters("weight", $("#weight").attr("value"));
        return _this.updateParameters("goal", $("#goal").attr("value"));
      });
      $(".model-turn-right.btn").click(function() {
        _this.currentViewIndex++;
        _this.currentViewIndex %= _this.views.length;
        return _this.updateParameters("view", _this.views[_this.currentViewIndex]);
      });
      $(".model-turn-left.btn").click(function() {
        _this.currentViewIndex--;
        if (_this.currentViewIndex < 0) {
          _this.currentViewIndex = _this.views.length - 1;
        }
        return _this.updateParameters("view", _this.views[_this.currentViewIndex]);
      });
      $(".model-config.btn").click(function(e) {
        var property;
        property = e.currentTarget.id.replace(/_\d*$/, "");
        return _this.updateParameters(property, $(e.currentTarget).attr("value"));
      });
      return $(".model-config.select").change(function(e) {
        var property;
        property = e.target.id;
        return _this.updateParameters(property, $("#" + property + " option:selected").val());
      });
    };

    return ModelControllerBase;

  })();

  WomenModelController = (function(_super) {

    __extends(WomenModelController, _super);

    function WomenModelController() {
      WomenModelController.__super__.constructor.call(this, "women", "images/blurr2.jpg", {
        units: "imperial",
        height: "65",
        weight: "160",
        goal: "120",
        shape: "hourglass",
        bust: "small",
        visual_adjustment: "0",
        ethnicity: "CA02",
        age: "AG20",
        eyes: "EYR",
        nose: "NOS",
        lips: "LPB",
        hair_color: "HC02",
        hair_style: "HS21",
        outfit: "undergarment",
        background: "blank",
        view: "front"
      });
    }

    WomenModelController.prototype.loadQuestionnaire = function() {
      var parseOrZero,
        _this = this;
      WomenModelController.__super__.loadQuestionnaire.call(this);
      parseOrZero = function(value) {
        var result;
        result = parseInt(value, 10);
        if (isNaN(result)) {
          return 0;
        }
        return result;
      };
      $("#shape").val(this.modelParameters.shape);
      $("#bust").val(this.modelParameters.bust);
      $(".model-ethnicity[value='" + this.modelParameters.ethnicity + "']").addClass("active");
      $(".model-age[value='" + this.modelParameters.age + "']").addClass("active");
      $(".model-eyes[value='" + this.modelParameters.eyes + "']").addClass("active");
      $(".model-nose[value='" + this.modelParameters.nose + "']").addClass("active");
      $(".model-lips[value='" + this.modelParameters.lips + "']").addClass("active");
      $(".model-hair_color[value='" + this.modelParameters.hair_color + "']").addClass("active");
      $(".model-hair_style[value='" + this.modelParameters.hair_style + "']").addClass("active");
      $(".model-outfit[value='" + this.modelParameters.outfit + "']").addClass("active");
      $(".model-background[value='" + this.modelParameters.background + "']").addClass("active");
      this.questionnaireView.visualAdjustment(this.modelParameters.visual_adjustment);
      return this.questionnaireView.addVisualAdjustmentListener(function(value) {
        _this.modelParameters.visual_adjustment = (parseOrZero(_this.modelParameters.visual_adjustment) + parseOrZero(value)).toString();
        return _this.questionnaireView.visualAdjustment(_this.modelParameters.visual_adjustment);
      });
    };

    return WomenModelController;

  })(ModelControllerBase);

  MenModelController = (function(_super) {

    __extends(MenModelController, _super);

    function MenModelController() {
      MenModelController.__super__.constructor.call(this, "men", "images/m_blurr.jpg", {
        units: "imperial",
        height: "65",
        weight: "180",
        goal: "180",
        shape: "regular",
        goal_shape: "muscular",
        belly: "flat",
        ethnicity: "LA01",
        age: "AG40",
        eyes: "EYR",
        beard_style: "BS04",
        beard_color: "BC06",
        hair_color: "HC06",
        hair_style: "HS43",
        outfit: "undergarment",
        background: "blank",
        view: "front"
      });
    }

    MenModelController.prototype.loadQuestionnaire = function() {
      MenModelController.__super__.loadQuestionnaire.call(this);
      $("#shape").val(this.modelParameters.shape);
      $("#goal_shape").val(this.modelParameters.goal_shape);
      $("#belly").val(this.modelParameters.belly);
      $(".model-ethnicity[value='" + this.modelParameters.ethnicity + "']").addClass("active");
      $(".model-age[value='" + this.modelParameters.age + "']").addClass("active");
      $(".model-eyes[value='" + this.modelParameters.eyes + "']").addClass("active");
      $(".model-nose[value='" + this.modelParameters.nose + "']").addClass("active");
      $(".model-lips[value='" + this.modelParameters.lips + "']").addClass("active");
      $(".model-hair_color[value='" + this.modelParameters.hair_color + "']").addClass("active");
      $(".model-hair_style[value='" + this.modelParameters.hair_style + "']").addClass("active");
      $(".model-beard_color[value='" + this.modelParameters.beard_color + "']").addClass("active");
      $(".model-beard_style[value='" + this.modelParameters.beard_style + "']").addClass("active");
      return $(".model-background[value='" + this.modelParameters.background + "']").addClass("active");
    };

    return MenModelController;

  })(ModelControllerBase);

  window.ModelView = ModelView;

  window.WomenModelController = WomenModelController;

  window.MenModelController = MenModelController;

  window.QuestionnaireView = QuestionnaireView;

  window.ModelController = {
    createForGender: function(gender) {
      var modelController;
      modelController = void 0;
      if (gender === "women") {
        modelController = new WomenModelController();
      } else if (gender === "men") {
        modelController = new MenModelController();
      } else {
        throw "Gender must me 'women' or 'men'";
      }
      modelController.loadQuestionnaire();
      modelController.loadModelImage();
      modelController.bindQuestionnaire();
      return modelController;
    }
  };

}).call(this);
