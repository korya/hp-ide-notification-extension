define([
  'scripts/core/event-bus',
  'css!./less/notifications',
], function (eventBus) {
  'use strict';

  var notificationController = [
    '$scope', 'notification-service',
    function ($scope, notificationService) {
      $scope.unreadCounter = 0;
      $scope.notifications = notificationService.getAll();

      $scope.onNotificationClick = function (notification) {
	notification.seen = true;
	if (notification.onClick) {
	  notification.onClick();
	  $scope.showNotificaionList = false;
	}
      };

      $scope.toggleNotificationList = function (notification) {
	$scope.showNotificaionList = !$scope.showNotificaionList;
	/* The notification list was just hidden --
	 * mark all notifications as seen
	 */
	if (!$scope.showNotificaionList) {
	  $scope.readAll();
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
	if (!$scope.$$phase) { $scope.$apply(); }
      });
      eventBus.vent.on('notification:rem', function (notification) {
	if (!$scope.$$phase) { $scope.$apply(); }
      });
      eventBus.vent.on('notification:seen', function (notification) {
	if (!$scope.$$phase) { $scope.$apply(); }
      });

      $scope.$watch('notifications', function (newVal, oldVal, $scope) {
	var total = $scope.notifications.length;
        var seen = _.filter($scope.notifications, { seen: true }).length;

	$scope.unreadCounter = total - seen;
      }, true);
    }
  ];

  var onOutClickDirective = [
    '$document',
    function ($document) {
      return {
	restrict: 'A',
	link: function (scope, element, attrs) {
	  $document.bind('click', function (event) {
	    if (element.find(event.target).length) return;
	    scope.$apply(function () {
	      scope.$eval(attrs.onOutClick);
	    });
	  });
	},
      };
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

    extModule.directive('onOutClick', onOutClickDirective);
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
