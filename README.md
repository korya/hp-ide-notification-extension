# Notification extension for HP Pronq IDE

The extension provides a very simple facebook-like notification service.
The implementation is really very basic: no message types, no aggregation of messages.
Just a list of notifications, new ones are marked as unseen;
after the notification is shown it is marked as seen, but yet remains in the list.
It is possible to clear the notification list.

## Install

Fast and easy way:
```shell
$ cd <IDE source>
$ curl -s https://raw.github.com/korya/hp-ide-git-extension/master/install.sh | sh
```

Otherwise, use the steps below.

#### Manual installation

We will use [jsontool](https://github.com/trentm/json) in order to modify
`JSON`-formatted configuration files, so first make sure it's installed:

```shell
$ npm install -g jsontool
```

Now clone the extension into your tree:

```shell
$ cd <IDE source>
$ git submodule add \
    https://github.com/korya/hp-ide-notification-extension.git \
    app/extensions/hpsw/notifications/1.00
```

Tell the server to load the extension by adding the following line to
`server/file-system/extensions/manifest.json`:

```shell
  json -I -f server/file-system/extensions/manifest.json \
    -E 'this.defaultExtension.push({"id":"notifications","version":1,"author":"hpsw"})'
```

In current implementattion, in addition to the installation of the extension,
you have to apply a patch, that reserves a space for notification icon by
putting a placeholder for it. To apply the patch:
```javascript
$ cd <IDE source>
$ patch -p1 <app/extensions/hpsw/notifications/1.00/patch.d/00-notification-placeholder.diff
```

## API

The extensions provides `angular` service `notification-service` with following signature:
 - `getAll` get the list of current notifications
 - `find` find notification by its id
 - `add` add a new notification (the notification is marked as unseen)
 - `rem` remove a notification
 - `setSeen` mark a notification as seen

## Example

The extension is used in
[Code Review extension](https://github.com/korya/hp-ide-code-review-extension).
For example look [here](https://github.com/korya/hp-ide-code-review-extension).
