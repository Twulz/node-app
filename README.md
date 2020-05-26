# node-app
Node Server

## Endpoints

### General Endpoints

#### GET /

##### Response
```json
{
    "success": true,
    "response": "Hello World Success!"
}
```

### Auth Endpoints

#### POST /login

##### Body
```json
{
	"username": "user@email.com",
	"password": "some_string"
}
```

##### Response
```json
{
    "success": true,
    "response": "Authentication successful!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1OTAzMDIwMzMsImV4cCI6MTU5MDM4ODQzM30.Pzff-bwkd5WqZZ-oE7PhKqlmH82JkVGkxxJI0YyFApU"
}
```

#### POST /register

##### Body
```json
{
	"username": "user@email.com",
	"password": "some_string"
}
```

##### Response
```json
{
    "success": true,
    "response": "User created!"
}
```

### Budget Endpoints

#### GET /api/budget/transactions/

##### Response
```json
{
    "success": true,
    "transactions": [
        {
            "date": "date",
            "amount": "decimal",
            "notes": "string",
            "cleared": "boolean",
            "category_id": "integer",
            "category_name": "string",
            "account_id": "integer",
            "account_name": "integer"
        }
    ]
}
```

#### POST /api/budget/transaction/

##### Body
```json
{
	"transaction": {
        "date": "date",
        "amount": "decimal",
        "notes": "string",
        "cleared": "boolean",
        "category_id": "integer",
        "account_id": "integer",
        "payee_id": "integer"
    }
}
```

##### Response
```json
{
    "success": true,
    "transaction_id": "integer"
}
```

#### GET /api/budget/accounts/

##### Response
```json
{
    "success": true,
    "accounts": [
        {
            "account_id": "integer",
            "account_name": "string",
            "active": "boolean"
        }
    ]
}
```

#### POST /api/budget/account/

##### Body
```json
{
    "account_name": "some_string"
}
```

##### Response
```json
{
    "success": true,
    "account_id": "integer"
}
```

#### GET /api/budget/categories/

##### Response
```json
{
    "success": true,
    "categories": [
        {
            "category_id": "integer",
            "category_name": "string"
        }
    ]
}
```

#### POST /api/budget/category/

##### Body
```json
{
    "category_name": "some_string"
}
```

##### Response
```json
{
    "success": true,
    "category_id": "integer"
}
```