module.exports = {
  post: {
    tags: ['Auth'],
    summary: "Firebase login (by User)",
    operationId: 'firebaseLogin',
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            required: [
              "idToken",
            ],
            properties: {
              idToken: {
                type: 'string',
                description: "idToken of firebase when user sign in",
                example: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjcxMTQzNzFiMmU4NmY4MGM1YzYxNThmNDUzYzk0NTEyNmZlNzM5Y2MiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbWFyaWthLWRheSIsImF1ZCI6Im1hcmlrYS1kYXkiLCJhdXRoX3RpbWUiOjE2NDAyMjYxMDksInVzZXJfaWQiOiIweGRvR2JZTGZoZUtaUm92c2hjYXZSRXg2a3UyIiwic3ViIjoiMHhkb0diWUxmaGVLWlJvdnNoY2F2UkV4Nmt1MiIsImlhdCI6MTY0MDIyNjEwOSwiZXhwIjoxNjQwMjI5NzA5LCJlbWFpbCI6InR1YW5udjE5MTI5MkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidHVhbm52MTkxMjkyQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.SsUdWLwJwM2Z-8903Cr-XzFEEeGBZhlmoLCoXXech1A6kM7hqNgoHL7uxi6cBKZMkN1xfyjklR_KWEH4NHEg1r7H3y3-jzFixMnU6ir-0KLWo8OGGhxbKJxjMzTWx7Ealnun782Yzqcw5M37a33tjLxsrWtVu0wPCffqE0vvXaQtNvY-wJxsa_-Hn4W5aR9T0t-twEEzFTYbCsZkEGxtjblx_UIhTtXDzagVUhrNxeI84yy_18aiaHmfGq-Itq4daRJjOSbrTvgi6OXGU2wqLGfa4hbvTTZ9p97Ab1-TxcxdhsAq7cXbw_WuDkNKk1g3O-vAhKjctHWEQb_uxqpozg"
              }
            }
          }
        },
        'application/json': {
          schema: {
            type: 'object',
            required: [
              "idToken",
            ],
            properties: {
              idToken: {
                type: 'string',
                description: "idToken of firebase when user sign in",
                example: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjcxMTQzNzFiMmU4NmY4MGM1YzYxNThmNDUzYzk0NTEyNmZlNzM5Y2MiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbWFyaWthLWRheSIsImF1ZCI6Im1hcmlrYS1kYXkiLCJhdXRoX3RpbWUiOjE2NDAyMjYxMDksInVzZXJfaWQiOiIweGRvR2JZTGZoZUtaUm92c2hjYXZSRXg2a3UyIiwic3ViIjoiMHhkb0diWUxmaGVLWlJvdnNoY2F2UkV4Nmt1MiIsImlhdCI6MTY0MDIyNjEwOSwiZXhwIjoxNjQwMjI5NzA5LCJlbWFpbCI6InR1YW5udjE5MTI5MkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidHVhbm52MTkxMjkyQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.SsUdWLwJwM2Z-8903Cr-XzFEEeGBZhlmoLCoXXech1A6kM7hqNgoHL7uxi6cBKZMkN1xfyjklR_KWEH4NHEg1r7H3y3-jzFixMnU6ir-0KLWo8OGGhxbKJxjMzTWx7Ealnun782Yzqcw5M37a33tjLxsrWtVu0wPCffqE0vvXaQtNvY-wJxsa_-Hn4W5aR9T0t-twEEzFTYbCsZkEGxtjblx_UIhTtXDzagVUhrNxeI84yy_18aiaHmfGq-Itq4daRJjOSbrTvgi6OXGU2wqLGfa4hbvTTZ9p97Ab1-TxcxdhsAq7cXbw_WuDkNKk1g3O-vAhKjctHWEQb_uxqpozg"
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
