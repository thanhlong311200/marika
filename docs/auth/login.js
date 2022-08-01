module.exports = {
  post: {
    tags: ['Auth'],
    summary: "login to the system (by User)",
    operationId: 'userLogin',
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
                example: "member@gmail.com"
              },
              password: {
                type: "string",
                description: "The password of user",
                example: "member"
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
                example: "member@gmail.com"
              },
              password: {
                type: "string",
                description: "The password of user",
                example: "member"
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
                    userId: {
                      type: "string",
                      description: "Id of user",
                      example: "61b70e9cfd84fd885f9fade3"
                    },
                    accessToken: {
                      type: "string",
                      description: "JSON Web Tokens",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    },
                    refreshToken: {
                      type: "string",
                      description: "Token use to get access token",
                      example: "82725ba385deb7f2f0c1f0fe2cbebe48a..."
                    },
                    isMembership: {
                      type: 'boolean',
                      description: "User is membership",
                      example: ""
                    },
                    status: {
                      type: "boolean",
                      description: "Active status",
                      example: true
                    },
                    profile: {
                      type: "object",
                      description: "User info",
                      example: `
                      {
                          "myProgram": 1,
                          "showNutritional": 1,
                          "sex": "other",
                          "customField": [],
                          "createdAt": "2021-12-22T18:06:37.995Z",
                          "updatedAt": "2021-12-22T18:06:37.995Z",
                          "paymentCustomerId": "cus_Kv3rbK...."
                        }
                      `
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
      '400': {
        description: "Login Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error400"
            }
          }
        },
      },
      '500': {
        description: 'Server error'
      }
    },
  }
}
