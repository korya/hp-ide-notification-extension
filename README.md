# Notification extension for HP web-based Pronq IDE

The extension provides a very simple facebook-like notifications.
The implementation is really very basic: no message types, no aggregation of messages...

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

## API

The extensions provides `angular` service `notification-service` with following signature:
 - `getAll` get the list of current notifications
 - `find` find notification by its id
 - `add` add a new notification (the notification is marked as unseen)
 - `rem` remove a notification
 - `setSeen` mark a notification as seen
