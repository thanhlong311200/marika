module.exports = {
  post: {
    tags: ['Profile user cancel subscription'],
    summary: "Cancel subscription profile (by User)",
    operationId: 'cancelSubscription',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              refreshToken: {
                type: 'string',
                description: "If cookies not set Refresh Token, you need seed your refreshToken for cancel subscription ",
                example: "321382725ba385deb7f2f0c1f0fj..."
              },
            },
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Cancel subscription success",
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
                  type: 'number',
                  description: "Number subscription cancelled",
                  example: 1
                },
                message: {
                  type: "string",
                  description: "response message",
                  example: "The request was executed successfully"
                },
              }
            }
          }
        }
      },
      '400': {
        description: "Cancel subscription Fail !",
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
        description: "Invalid fields",
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
    },
  },
}
