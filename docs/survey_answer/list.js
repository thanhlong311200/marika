const moment = require("moment");
module.exports = {
  get: {
    tags: ["Survey Answer"],
    summary: "get list survey (by User & Admin)",
    operationId: "GetListSurvey",
    parameters: [
      {
        name: 'status',
        in: 'query',
        description: "status survey",
        schema: {
          type: 'number',
        }
      },
      {
        name: 'pageNumber',
        in: 'query',
        description: "page number pagination",
        schema: {
          type: 'number',
          default: 0,
        }
      },
      {
        name: 'itemsPerPage',
        in: 'query',
        description: "items per Page pagination",
        schema: {
          type: 'number',
          default: 10,
        }
      },],
    responses: {
      200: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        description: "Survey id",
                        example: "61bce58ad69ba1db79507032",
                      },
                      name: {
                        type: "string",
                        description: "Name of the survey",
                        example: "health",
                      },
                      status: {
                        type: "number",
                        description: "Status of the survey",
                        example: "1",
                      },
                      startDate: {
                        type: "string",
                        description: "Start time of the survey",
                        example: moment().format("YYYY-MM-DD"),
                      },
                      endDate: {
                        type: "string",
                        description: "End time of the survey",
                        example: moment().add(7, 'day').format("YYYY-MM-DD"),
                      },
                      questions: {
                        type: "array",
                        description: "Question of the survey",
                        example: [
                          {
                            question:
                              "tell us why you’re here. select the two goals that are most relevant to you",
                            options: [
                              "build body confidence, self-esteem and body image",
                              "manage emotional eating, binge eating or disordered eating",
                            ],
                            numberOfAnswers: 1,
                          },
                          {
                            question:
                              "when it comes to planning your weekly meals, which sounds most like you?",
                            options: [
                              "I’m a big eater",
                              "I’m a big gourmand",
                              "I’m a big foodie",
                            ],
                            numberOfAnswers: 2,
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      404: {
        description: "Get survey Fail!",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error404",
            },
          },
        },
      },
    },
  },
};
