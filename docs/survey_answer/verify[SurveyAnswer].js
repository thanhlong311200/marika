module.exports = {
  post: {
    tags: ["Survey Answer"],
    summary: "Verify survey answer by Otp (by User)",
    operationId: "VerifySurvey",
    requestBody: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            required: ["surveyId", "email", "otp"],
            properties: {
              surveyId: {
                type: "string",
                description: "Id of survey",
                example: "61c8bd991034f621a997418a",
              },
              email: {
                type: "email",
                description: "email of user",
                example: "guest@gmail.com",
              },
              otp: {
                type: "string",
                description: "otp code",
                example: "123456",
              },
            },
          },
        },
        "application/json": {
          schema: {
            type: "object",
            properties: {
              surveyId: {
                type: "string",
                description: "Id of survey",
                example: "61c8bd991034f621a997418a",
              },
              email: {
                type: "email",
                description: "email",
                example: "guest@gmail.com",
              },
              otp: {
                type: "string",
                description: "otp code",
                example: "123456",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Do survey done",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  description: "response code",
                  example: "SUCCESS",
                },
                message: {
                  type: "string",
                  description: "response message",
                  example: "Do survey done",
                },
              },
            },
          },
        },
      },
      400: {
        description: "Verify survey fail !",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error400",
            },
          },
        },
      },
    },
  },
};
