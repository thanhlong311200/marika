module.exports = {
  post: {
    tags: ["Survey Answer"],
    summary: "create survey answer (by User)",
    operationId: "DoSurvey",
    requestBody: {
      content: {
        "multipart/form-data": {
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
                description: "email of user",
                example: "guest@gmail.com",
              },
              result: {
                type: "array",
                description: "selected answers of questions",
                items: {
                  type: "object",
                  properties: {
                    questionId: {
                      type: "string",
                      description: "id of question",
                      example: "61c8bd991034f621a997418b",
                    },
                    answer: {
                      type: "array",
                      description: "index of answer",
                      example: [1],
                      items: {
                        type: "number",
                        description: "index of answer",
                        example: 1,
                      },
                    },
                  },
                },
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
              result: {
                type: "array",
                description: "selected answers of questions",
                items: {
                  type: "object",
                  properties: {
                    questionId: {
                      type: "string",
                      description: "id of question",
                      example: "61c8bd991034f621a997418c",
                    },
                    answer: {
                      type: "array",
                      description: "index of answer",
                      example: [1],
                      items: {
                        type: "number",
                        description: "index of answer",
                        example: 1,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Do survey success",
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
                data: {
                  properties: {
                    surveyAnswerId: {
                      type: "array",
                      description: "id of surveyAnswer",
                      example: [1, 2],
                      items: {
                        type: "number",
                        description: "id of surveyAnswer",
                        example: 1,
                      }
                    },
                  },
                },
              },
            },
          },
        },
      },
      400: {
        description: "Do survey fail !",
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
