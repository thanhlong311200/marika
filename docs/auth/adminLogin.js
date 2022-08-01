module.exports = {
  post: {
    tags: ['Auth'],
    summary: "login to the system (by Admin)",
    operationId: 'AdminLogin',
    parameters: [],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              username: {
                type: 'string',
                description: "use email or username",
                example: "admin@gmail.com"
              },
              password: {
                type: "string",
                description: "The password of admin",
                example: "toor@root"
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
                description: "use email or username",
                example: "admin@gmail.com"
              },
              password: {
                type: "string",
                description: "email password or login username",
                example: "toor@root"
              }
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Login success",
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
                code: {
                  type: "string",
                  description: "response code",
                  example: "SUCCESS"
                },
                data: {
                  properties: {
                    access_token: {
                      type: "string",
                      description: "JSON Web Tokens",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    },
                    refresh_token: {
                      type: "string",
                      description: "Token use to get access token",
                      example: "82725ba385deb7f2f0c1f0fe2cbebe48a..."
                    },
                    expiration: {
                      type: "string",
                      description: "exp revoke access token",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    },
                    '_id': {
                      type: "string",
                      description: "this is userId",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    },
                  }
                },
                message: {
                  type: "string",
                  description: "response message",
                  example: "The request was executed successfully"
                },
              },
            }
          }
        }
      },
      '422': {
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error422"
            }
          }
        }
      },
    },
  }
}
