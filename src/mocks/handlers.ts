import { rest } from "msw";

export const handlers = [
  rest.get(
    "https://dog.ceo/api/breed/:breed/images/random/12",
    (req, res, context) => {

      return res(
        context.status(200),
        context.json({
          message: ["https://images.dog.ceo/breeds/shiba/shiba-8.jpg"]
        })
      );
    }
  ),
];
