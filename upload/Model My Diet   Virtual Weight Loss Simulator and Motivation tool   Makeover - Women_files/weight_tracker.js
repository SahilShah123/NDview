(function() {
  var WeightTracker, WeightTrackerController, WeightTrackerView,
    __hasProp = {}.hasOwnProperty;

  WeightTracker = function(data) {
    var convertWeight, findWeight, formatDate, goal, loadData, on_, sortedDates, units, weights;
    on_ = false;
    weights = {};
    goal = 120;
    units = 'imperial';
    loadData = function(data) {
      weights = data.weights;
      goal = data.goal;
      on_ = data.on;
      if (data.units != null) {
        return units = data.units;
      }
    };
    if (typeof data !== "undefined") {
      loadData(data);
    }
    formatDate = function(date) {
      if (typeof date === "string") {
        date = new Date(date);
      }
      if (typeof date.getFullYear === "function" && typeof date.getMonth === "function" && typeof date.getDate === "function") {
        return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
      }
      return "";
    };
    sortedDates = function() {
      var date;
      return ((function() {
        var _results;
        _results = [];
        for (date in weights) {
          _results.push(date);
        }
        return _results;
      })()).sort(function(a, b) {
        return new Date(a) > new Date(b);
      });
    };
    findWeight = function(operation) {
      var dates;
      dates = sortedDates();
      if (dates.length > 0) {
        return weights[operation(dates)];
      }
      return 160;
    };
    convertWeight = function(newUnits, weight) {
      if (newUnits === 'metric') {
        return Math.round(weight * 10 / 2.2) / 10;
      }
      if (newUnits === 'imperial') {
        return Math.round(weight * 2.2);
      }
    };
    return {
      data: function() {
        return {
          weights: weights,
          goal: goal,
          on: on_
        };
      },
      save: function() {
        return $.cookie("weight-tracker", JSON.stringify(this.data()));
      },
      load: function() {
        if ($.cookie("weight-tracker") != null) {
          data = JSON.parse($.cookie("weight-tracker"));
          return loadData(data);
        }
      },
      start: function(weight) {
        var dates;
        dates = sortedDates();
        if (typeof weight !== "undefined") {
          if (dates.length > 0) {
            weights[dates[0]] = weight;
          } else {
            this.track(new Date() - 1, weight);
          }
        }
        if (dates.length > 0) {
          return weights[dates[0]];
        }
        return 160;
      },
      units: function(value) {
        var date, weight;
        if ((value != null) && value !== units) {
          units = value;
          for (date in weights) {
            if (!__hasProp.call(weights, date)) continue;
            weight = weights[date];
            weights[date] = convertWeight(units, weight);
          }
        }
        return units;
      },
      goal: function(weight) {
        if (weight != null) {
          goal = weight;
        }
        return goal;
      },
      track: function(date, weight) {
        return weights[formatDate(date)] = weight;
      },
      history: function(date) {
        return weights[formatDate(date)];
      },
      current: function() {
        return findWeight(function(dates) {
          return dates[dates.length - 1];
        });
      },
      heaviest: function() {
        var date, weight;
        return Math.max.apply(null, (function() {
          var _results;
          _results = [];
          for (date in weights) {
            weight = weights[date];
            _results.push(weight);
          }
          return _results;
        })());
      },
      isOn: function() {
        return on_;
      },
      on: function() {
        return on_ = true;
      },
      off: function() {
        return on_ = false;
      }
    };
  };

  WeightTrackerView = function() {
    var trackerRoot;
    trackerRoot = "http://tracker-generator.herokuapp.com";
    return {
      addModelUpdateListener: function(listener) {
        $("#update_model").click(function() {
          return listener();
        });
        return $('.unit-selection').click(function() {
          return listener();
        });
      },
      addTrackListener: function(listener) {
        return $(".track-history").click(function(eventObject) {
          return listener($(eventObject.currentTarget).val() === "on");
        });
      },
      track: function(value) {
        if (typeof value !== "undefined") {
          if (value === true) {
            $(".track-history[value=\"on\"]").addClass("active");
            $(".track-history[value=\"off\"]").removeClass("active");
          } else {
            $(".track-history[value=\"on\"]").removeClass("active");
            $(".track-history[value=\"off\"]").addClass("active");
          }
        }
        return $(".track-history.active").attr("value") === "on";
      },
      showWidget: function() {
        $("#weight-tracker-container").show();
        return $("#start-weight-container").show();
      },
      hideWidget: function() {
        $("#weight-tracker-container").hide();
        return $("#start-weight-container").hide();
      },
      tracker: function(options) {
        return $("#weight-tracker-image").attr("src", trackerRoot + "/generate?start=" + options.start + "&current=" + options.current + "&goal=" + options.goal + "&width=400&height=100&units=" + options.units);
      },
      start: function() {
        return parseInt($("#start").val());
      },
      current: function() {
        return parseInt($("#weight").val());
      },
      goal: function() {
        return parseInt($("#goal").val());
      },
      units: function() {
        if ($('.height-units').text() === 'ft') {
          return 'imperial';
        }
        if ($('.height-units').text() === 'm') {
          return 'metric';
        }
      }
    };
  };

  WeightTrackerController = function(tracker, view) {
    var updateTracker;
    updateTracker = function() {
      tracker.units(view.units());
      tracker.track(new Date(), view.current());
      tracker.goal(view.goal());
      view.tracker({
        start: tracker.heaviest(),
        current: tracker.current(),
        goal: tracker.goal(),
        units: tracker.units()
      });
      return tracker.save();
    };
    view.addModelUpdateListener(function() {
      return updateTracker();
    });
    view.addTrackListener(function(track) {
      if (track === true) {
        tracker.on();
        updateTracker();
        return view.showWidget();
      } else {
        view.hideWidget();
        tracker.off();
        return tracker.save();
      }
    });
    tracker.load();
    if (tracker.isOn()) {
      view.tracker({
        start: tracker.heaviest(),
        current: tracker.current(),
        goal: tracker.goal()
      });
      view.track(true);
      return view.showWidget();
    }
  };

  window.WeightTrackerController = WeightTrackerController;

  window.WeightTrackerView = WeightTrackerView;

  window.WeightTracker = WeightTracker;

}).call(this);
