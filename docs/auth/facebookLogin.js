module.exports = {
  post: {
    tags: ['Auth'],
    summary: "Facebook login",
    operationId: 'facebookLogin',
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
                example: "AQDU9nRr8xQsMQFg2QGfPPtj-vMxW057MzlOkGc77z05PSQubA1MGEVI_tr5Ru-UsJodaWjbU6eGYOnP8D9xCxeAHbUEnBCq7s4nQvlCffdX889HRuEscIAYryMy4HcFcX-MFPwqoKaEe_s5cmdlNtXIznFWhkBQQDL4fM3Rk4JAo0YfoxxIYyexGQ6ankQ2lxxoXM3xJLvgLSO_ixrrn47FgsSjjgYgWR5vFzfuUBBjAUR0xT-Mjfrfb2ycLMgxyBicIvR2LjPjyzLJzT4SanyEoDip1GTAmUej-XUuDIVDZ4n4lISXzoa5l9JAOhJLqDhRMBtmEfJO7RtjzUE62G7yAa11_EUJ-WOxD5fmhedegg69AlmDsNyiWLqbsk2SfQg"
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
                example: "AQDU9nRr8xQsMQFg2QGfPPtj-vMxW057MzlOkGc77z05PSQubA1MGEVI_tr5Ru-UsJodaWjbU6eGYOnP8D9xCxeAHbUEnBCq7s4nQvlCffdX889HRuEscIAYryMy4HcFcX-MFPwqoKaEe_s5cmdlNtXIznFWhkBQQDL4fM3Rk4JAo0YfoxxIYyexGQ6ankQ2lxxoXM3xJLvgLSO_ixrrn47FgsSjjgYgWR5vFzfuUBBjAUR0xT-Mjfrfb2ycLMgxyBicIvR2LjPjyzLJzT4SanyEoDip1GTAmUej-XUuDIVDZ4n4lISXzoa5l9JAOhJLqDhRMBtmEfJO7RtjzUE62G7yAa11_EUJ-WOxD5fmhedegg69AlmDsNyiWLqbsk2SfQg"
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
