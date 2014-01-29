# Notification extension for HP Pronq IDE

The extension provides a very simple facebook-like notification service.
The implementation is really very basic: no message types, no aggregation of messages.
Just a list of notifications, new ones are marked as unseen;
after the notification is shown it is marked as seen, but yet remains in the list.
It is possible to clear the notification list.

## Install

```shell
$ cd <IDE source>
$ git submodule add \
    https://github.com/korya/hp-ide-notification-extension.git \
    app/extensions/hpsw/notifications/1.00
```

Tell the server about to load the extension by adding the following line to
`server/file-system/extensions/manifest.json`:
```javascript
    {"id":"notifications","version":1,"author":"hpsw"}
```

In current implementattion, in addition to installation of the plugin, you have
to apply a patch, that reserves a space for notification icon by putting a
placeholder for it:
```javascript
$ cd <IDE source>
$ patch -p0 < app/extensions/hpsw/notifications/1.00/patch.d/00-notification-placeholder.diff
```

## API

The extensions provides `angular` service `notification-service` with following signature:
 - `getAll` get the list of current notifications
 - `find` find notification by its id
 - `add` add a new notification (the notification is marked as unseen)
 - `rem` remove a notification
 - `setSeen` mark a notification as seen
