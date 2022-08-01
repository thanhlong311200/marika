module.exports = {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      description: "JWT Authorization header using the Bearer scheme.",
      in: "header",
      scheme: "bearer",
      bearerFormat: "JWT",
    }
  },
  schemas: {
    // _id
    _id: {
      type: "string",
      description: "Id of object",
      example: "61b70e9cfd84fd885f9fade3"
    },
    // Recipe
    Recipe: {
      type: 'object',
      properties: {
        _id: {
          $ref: "#/components/schemas/_id"
        },
        name: {
          type: "string",
          description: "response code",
          example: "super greens"
        },
        ingredients: {
          type: 'array',
          description: "ingredients of recipe",
          items: {
            type: "object",
            properties: {
              size: {
                type: 'string',
                description: "size",
                example: "500g",
              },
              value: {
                type: 'string',
                description: "value of size",
                example: "lean chicken mince",
              }
            }
          },
        },
        calo: {
          type: "number",
          description: "calo of recipe",
          example: "352"
        },
        tag: {
          type: "array",
          description: "tag of recipe",
          example: ["gluten free", "egg free"]
        },
      },
    },
    // 200 success
    Success200: {
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
          example: "The request was executed successfully"
        },
      },
    },
    // 200 login success
    Login200: {
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
            _id: {
              $ref: "#/components/schemas/_id"
            },
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
            refreshToken: {
              type: "string",
              description: "Token use to get access token",
              example: "82725ba385deb7f2f0c1f0fe2cbebe48a..."
            },
            isMembership: {
              type: "boolean",
              description: "check user is membership",
              example: false
            },
            status: {
              type: "boolean",
              description: "status user",
              example: true
            },
          }
        },
        message: {
          type: "string",
          description: "response message",
          example: "The request was executed successfully"
        },
      },
    },
    // 400 bad request
    Error400: {
      type: 'object',
      properties: {
        code: {
          type: "string",
          description: "response code",
          example: "E_REQUEST"
        },
        errors: {
          type: ["array", "object", "string", "null"],
        },
        message: {
          type: "string",
          description: "response message",
          example: "Request Fail !"
        },
      },
    },
    // 401 Unauthorized
    Error401: {
      type: 'object',
      properties: {
        code: {
          type: "string",
          description: "response code",
          example: "E_PERMISSION"
        },
        errors: {
          type: ["array", "object", "string", "null"],
        },
        message: {
          type: "string",
          description: "response message",
          example: "Invalid access token permission !"
        },
      },
    },
    Error404: {
      type: 'object',
      properties: {
        code: {
          type: "string",
          description: "response type",
          example: "E_REQUEST"
        },
        message: {
          type: "string",
          description: "response message",
          example: "Not found !"
        },
      },
    },
    // 422 Unprocessable Entity
    Error422: {
      type: 'object',
      properties: {
        code: {
          type: "string",
          description: "response code",
          example: "E_VALIDATION"
        },
        errors: {
          type: ["array", "null"],
        },
        message: {
          type: "string",
          description: "response message",
          example: "Invalid field !"
        },
      },
    },
  },
};
