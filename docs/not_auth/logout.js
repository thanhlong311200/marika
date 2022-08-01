module.exports = {
  post: {
    tags: ['Auth'],
    summary: "Log out (by User & Admin)",
    operationId: 'Logout',
    requestBody: {
      headers: {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MWI2NDdkMj'
      },
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              refreshToken: {
                type: 'string',
                description: "Refresh token",
                example: "86705ba1d5d6e4f1f0c5fffb2cbebe4ea44fd7abc"
              },
            }
          }
        },
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              refreshToken: {
                type: 'string',
                description: "Refresh token",
                example: "86705ba1d5d6e4f1f0c5fffb2cbebe4ea44fd7abc"
              },
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
                  description: "code",
                  example: "SUCCESS"
                },
                message: {
                  type: "string",
                  description: "message",
                  example: "Logout successful !"
                },
              },
            }
          }
        }
      },
      '401': {
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error401"
            }
          }
        },
      },
    },
  }
}
