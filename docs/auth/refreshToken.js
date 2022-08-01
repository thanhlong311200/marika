module.exports = {
  post: {
    tags: ['Auth'],
    summary: "Refresh Token (by User & Admin)",
    operationId: 'RefreshToken',
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              refreshToken: {
                type: 'string',
                description: "Refresh token",
                example: "d22d5bf685deb5a6f0c4a6af2bbebe4df71bd7abc169e40ad8d65467420c06ef28c04099"
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
                example: "83270ef6d6dce7a5f094f1f87fbebe19a212d7f2936ab10adc870466195d57bf2a921198"
              },
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Refresh success",
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
                  type: "object",
                  properties: {
                    accessToken: {
                      type: "string",
                      description: "JSON Web Tokens",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    },
                    expiration: {
                      type: "string",
                      description: "expiration time of JSON Web Tokens",
                      expiration: "2021-12-24T03:36:23+07:00"
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
      '401': {
        description: 'Invalid refresh token',
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
