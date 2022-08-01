module.exports = {
  put: {
    tags: ['User'],
    summary: "update profile (by Admin)",
    operationId: 'changePasswordUser',
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              oldPassword: {
                type: "string",
                description: "The old password of user",
                example: "password#A1"
              },
              password: {
                type: "string",
                description: "The new password of user and must contain 1 uppercase, 1 lowercase, 1 numbers, 1 symbols, min length 8 letter in string",
                example: "newPassword@1"
              },
              confirmPassword: {
                type: "string",
                description: "The confirm new password and 'confirmPassword' must be equal to 'password'",
                example: "newPassword@1"
              },
            }
          }
        },
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              oldPassword: {
                type: "string",
                description: "The old password of user",
                example: "password#A1"
              },
              password: {
                type: "string",
                description: "The new password of user and must contain 1 uppercase, 1 lowercase, 1 numbers, 1 symbols, min length 8 letter in string",
                example: "newPassword@1"
              },
              confirmPassword: {
                type: "string",
                description: "The confirm new password and 'confirmPassword' must be equal to 'password'",
                example: "newPassword@1"
              },
            }
          }
        },
      }
    },
    responses: {
      '200': {
        description: "Change profile success",
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
                message: {
                  type: "string",
                  description: "response message",
                  example: "Change password success !"
                },
              }
            }
          }
        }
      },
      '400': {
        description: "Change profile Fail !",
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
