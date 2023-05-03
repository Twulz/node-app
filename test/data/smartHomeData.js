module.exports = {
  user: [
    { username: 'testuser@email.com', password: '$2b$10$XHXEA7Wmlc4bnyDUyDMND.HIoMZZv6yOW5C6rhyCKZSeK/KBdMxIO', app_access: true }
  ],
  sensor_type: [
    { name: 'Capacitive Moisture' },
    { name: 'Resistive Moisture' }
  ],
  sensor: [
    { name: 'Cap Moisture 1', sensor_type_id: 1 },
    { name: 'Res Moisture 1', sensor_type_id: 2 }
  ]
}
