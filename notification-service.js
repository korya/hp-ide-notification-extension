define([
  'scripts/core/event-bus',
], function (eventBus) {
  'use strict';

  var _notifications = [];
  var _uniqueId = 0;

  function Notification(id, image, message, onClick) {
    /* XXX Every instance has to be unique */
    this._id = _uniqueId++;
    this.id = id;
    this.image = image;
    this.message = message;
    this.onClick = onClick;
    this.date = new Date();
    this.seen = false;
  }

  function _getMatchObject(obj) {
    if (typeof obj === 'string')
      return { id: obj };

    if (typeof obj !== 'object') return;

    if (obj instanceof Notification)
      return { id: obj.id, _id:obj._id };

    if (typeof obj.id === 'string')
      return { id: obj.id };
    if (typeof obj._id === 'string')
      return { id: obj._id };
  }

  function getAllNotifications() {
    return _notifications;
  }

  function findNotification(obj) {
    var match = _getMatchObject(obj);

    return _.find(_notifications, match);
  }

  function addNotification(params) {
    var notification = new Notification(params.id, params.image, params.message,
      params.onClick);

    _notifications.push(notification);
    eventBus.vent.trigger('notification:new', notification);
    return notification;
  }

  function remNotification(obj) {
    var match = _getMatchObject(obj);
    var idx = _.findIndex(_notifications, match);

    if (idx < 0) {
      console.error('Cannot find a notification for', match);
      return;
    }

    var notification = _notifications[idx];
    eventBus.vent.trigger('notification:rem', notification);
    _notifications.splice(idx, 1);
  }

  function setNotificationSeen(obj) {
    var notification = findNotification(obj);

    if (!notification) {
      console.error('Cannot find a notification for', {obj:obj});
      return;
    }

    notification.seen = true;
    eventBus.vent.trigger('notification:seen', notification);
    return notification;
  }

  var notificationService = {
    getAll: getAllNotifications,
    find: findNotification,
    add: addNotification,
    rem: remNotification,
    setSeen: setNotificationSeen,
  };

  return {
    factorys: {
      'notification-service': function () {
	return notificationService;
      },
    },
  };
});
