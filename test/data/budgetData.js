module.exports = {
  user: [
    { username: 'testuser@email.com', password: '$2b$10$XHXEA7Wmlc4bnyDUyDMND.HIoMZZv6yOW5C6rhyCKZSeK/KBdMxIO', app_access: true }
  ],
  account: [
    { name: 'Checking', active: true, user_id: 1 },
    { name: 'Savings', active: true, user_id: 1 }
  ],
  category: [
    { name: 'Rent', active: true, user_id: 1 },
    { name: 'Groceries', active: true, user_id: 1 }
  ],
  transaction: [
    { date: "2023-05-01 12:01:22", notes: 'Rent', amount: 1000, cleared: true, user_id: 1, category_id: 1, account_id: 1 },
    { date: "2023-04-01 12:01:22", notes: 'Coles', amount: 100, cleared: true, user_id: 1, category_id: 2, account_id: 1 }
  ],
  budget: [
    { amount: 1000, date: 2023-05-01, category_id: 1 },
    { amount: 400, date: 2023-05-01, category_id: 2 }
  ]
}
