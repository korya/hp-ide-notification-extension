define([
  'scripts/core/event-bus',
  'css!./css/notifications',
], function (eventBus) {
  'use strict';

  var notificationController = [
    '$scope', '$timeout', 'notification-service',
    function ($scope, $timeout, notificationService) {
      $scope.unreadCounter = 0;
      $scope.notifications = notificationService.getAll();

      eventBus.vent.on('notification:new', function (notification) {
	$scope.$apply();
      });
      eventBus.vent.on('notification:rem', function (notification) {
	$scope.$apply();
      });
      eventBus.vent.on('notification:seen', function (notification) {
	$scope.$apply();
      });

      $scope.$watch('showNotificaionList', function (newVal, oldVal, $scope) {
	if (!newVal && oldVal) {
	  /* The notification list was just hidden -- 
	   * mark all notifications as seen
	   */
	  $timeout(function () {
	    $scope.$apply(function () {
	      _.forEach($scope.notifications, function (notification) {
		notification.seen = true;
	      });
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
	templateUrl: 'extensions/hpsw/notifications/1.00/notifications.html'
      };
    });
  }

  var runModule = [
    'mastheadService', 'notification-service',
    function (mastheadService, notificationService) {
      mastheadService.forNotifications(function (domElement) {
	var $notificationHolder = $('<caw-notifications>')
	  .addClass('notificationContainer')
	  .attr('data-ng-controller', 'notification-ui');
	$(domElement).append($notificationHolder);
      });
    }
  ];

  return {
    init: initModule,
    run: runModule,
  };
});
