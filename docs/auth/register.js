module.exports = {
  post: {
    tags: ['User'],
    summary: "register (by User)",
    operationId: 'userRegister',
    parameters: [],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              username: {
                type: 'string',
                description: "The username ",
                example: "username01"
              },
              password: {
                type: "string",
                description: "The password ",
                example: "1234567890"
              }
            }
          }
        },
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              username: {
                type: 'string',
                description: "The username ",
                example: "username01"
              },
              password: {
                type: "string",
                description: "The password ",
                example: "1234567890"
              }
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Register success",
        headers: {
          "Set-Cookie": {
            description: "set token to cookies",
            type: "string",
          }
        },
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                userId: {
                  type: "string",
                  description: "Id of user",
                  example: "61bc5eae98b737d53c5ec"
                },
                access_token: {
                  type: "string",
                  description: "Json Web Token",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                },
                refresh_token: {
                  type: "string",
                  description: "Token use to get access token",
                  example: "82725ba385deb7f2f0c1f0fe2cbebe48a..."
                },
                uidToken: {
                  type: "string",
                  description: "Uid token",
                  example: "82725ba385deb7f2f0c1fe2cbe"
                },
              }
            }
          }
        },
        '422': {
          description: "Username exist !",
        },
        '400': {
          description: 'Register Fail !!!'
        },
      },
    }
  }
}
