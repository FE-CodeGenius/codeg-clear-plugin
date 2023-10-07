import Ajv from "ajv";

export interface ClearOptions {
  files: Array<string>;
}

export const clearGlob = ["./dist"];

export const schema = {
  type: "object",
  properties: {
    paths: { type: "array" },
  },
  required: ["paths"],
};

export const validateArgs = (schema: object, data: unknown) => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid && validate.errors && validate.errors?.length > 0) {
    throw new Error(validate.errors[0].message);
  }
};
