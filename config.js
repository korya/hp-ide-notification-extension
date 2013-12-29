define({
  author: 'hpsw',
  id: 'notifications',
  version: 1.00,
  description: 'Application notification service',
  moduleLoaders:[
    {
      id: 'notification-service',
      main: 'notification-service',
      dependencies: [
      ]
    },
    {
      id: 'notification-ui',
      main: 'notification-ui',
      dependencies: [
	'masthead',
      ]
    },
  ]
});
