module.exports = {
  post: {
    tags: ['Auth'],
    summary: "Google login",
    operationId: 'googleLogin',
    parameters: [],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            required: ["code"],
            properties: {
              code: {
                type: 'string',
                description: "An authorization code, which the application can exchange for an access token and a refresh token",
                example: "4/2F0AX4XfWhLoH7MLTk_JjE9f4Z3WzyEccR8LLmcoZIPH0bitpdHYo01r8swkkDFhPvQlpZa_A"
              },
            }
          }
        },
        'application/json': {
          schema: {
            type: 'object',
            required: ["code"],
            properties: {
              code: {
                type: 'string',
                description: "An authorization code, which the application can exchange for an access token and a refresh token.",
                example: "4/2F0AX4XfWhLoH7MLTk_JjE9f4Z3WzyEccR8LLmcoZIPH0bitpdHYo01r8swkkDFhPvQlpZa_A"
              },
            }
          }
        },
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
              $ref: "#/components/schemas/Login200"
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
      '401': {
        description: "Permission Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error401"
            }
          }
        },
      },
      '422': {
        description: "Invalid field",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error422"
            }
          }
        }
      },
      '500': {
        description: 'Server error'
      }
    }
  }
}
