define([
  'scripts/core/event-bus',
  'css!./less/notifications',
], function (eventBus) {
  'use strict';

  var notificationController = [
    '$scope', '$timeout', 'notification-service',
    function ($scope, $timeout, notificationService) {
      $scope.unreadCounter = 0;
      $scope.notifications = notificationService.getAll();

      $scope.onClick = function (notification) {
	notification.seen = true;
	if (notification.onClick) {
	  notification.onClick();
	  $scope.showNotificaionList = false;
	}
      };

      $scope.removeNotification = function (notification) {
	notificationService.rem(notification);
      };

      $scope.removeAll = function (notification) {
	_.forEach($scope.notifications, $scope.removeNotification);
      };

      $scope.readAll = function (notification) {
	_.forEach($scope.notifications, function (notification) {
	  notification.seen = true;
	});
      };

      eventBus.vent.on('notification:new', function (notification) {
	$scope.$apply();
      });
      eventBus.vent.on('notification:rem', function (notification) {
	if (!$scope.$$phase) { $scope.$apply(); }
      });
      eventBus.vent.on('notification:seen', function (notification) {
	if (!$scope.$$phase) { $scope.$apply(); }
      });

      $scope.$watch('showNotificaionList', function (newVal, oldVal, $scope) {
	if (!newVal && oldVal) {
	  /* The notification list was just hidden -- 
	   * mark all notifications as seen
	   */
	  $timeout(function () {
	    $scope.$apply(function () {
	      $scope.readAll();
	    });
	  }, 0);
	}
      });

      $scope.$watch('notifications', function (newVal, oldVal, $scope) {
	var total = $scope.notifications.length;
        var seen = _.filter($scope.notifications, { seen: true }).length;

	$scope.unreadCounter = total - seen;
      }, true);
    }
  ];

  function initModule(extModule) {
    extModule.controller('notification-ui', notificationController);

    extModule.directive('cawNotifications', function () {
      return {
	restrict: 'E',
	replace: true,
	templateUrl: 'extensions/hpsw/notifications/1.00/notifications.html'
      };
    });
  }

  var runModule = [
    'mastheadService', 'notification-service',
    function (mastheadService, notificationService) {
      mastheadService.forNotifications(function (domElement) {
	$(domElement).append($('<caw-notifications>'));
      });
    }
  ];

  return {
    init: initModule,
    run: runModule,
  };
});
