import { FileUpload, parseFormData } from "@mjackson/form-data-parser";
import { type ActionFunctionArgs } from "react-router";
import { z, type ZodType } from "zod";
import { zfd } from "zod-form-data";

type MapParamsToFunction<Schema extends ZodType> = {
  schema?: Schema;
  action: (
    args: ActionFunctionArgs & {
      data: z.infer<Schema>;
    },
  ) => Promise<any>;
  schemaerror?: (
    args: ActionFunctionArgs & { error: Error; formdata: FormData },
  ) => Promise<any>;
};

export let actionsv1 = <T extends Record<keyof T, any>>(actions: {
  [K in keyof T]: MapParamsToFunction<T[K]>;
}) => {
  return async ({ request, context, params }: ActionFunctionArgs) => {
    let formdata = await request.formData();
    if (!formdata.has("action")) {
      throw new Error("No action provided");
    }
    let action = actions[formdata.get("action") as keyof T];
    if (!action) {
      throw new Error(`Invalid action ${formdata.get("action")}`);
    }

    let result = zfd.formData(action.schema ?? z.any()).safeParse(formdata);
    if (result.success) {
      return action.action({ request, context, params, data: result.data });
    } else {
      if (action.schemaerror) {
        return action.schemaerror({
          request: request,
          params: params,
          context: context,
          formdata: formdata,
          error: result.error,
        });
      } else {
        throw result.error;
      }
    }
  };
};

export let actions_with_upload_v1 = <T extends Record<keyof T, any>>({
  uploadHandler,
  actions,
}: {
  uploadHandler: (
    args: { file: FileUpload } & ActionFunctionArgs,
  ) => void | null | string | File | Promise<void | null | string | File>;
  actions: {
    [K in keyof T]: MapParamsToFunction<T[K]>;
  };
}) => {
  return async (args: ActionFunctionArgs) => {
    let { request, context, params } = args;

    let formdata = await parseFormData(request, (file) => {
      return uploadHandler({ file, ...args });
    });
    if (!formdata.has("action")) {
      throw new Error("No action provided");
    }
    let action = actions[formdata.get("action") as keyof T];
    if (!action) {
      throw new Error(`Invalid action ${formdata.get("action")}`);
    }

    let result = zfd.formData(action.schema ?? z.any()).safeParse(formdata);
    if (result.success) {
      return action.action({ request, context, params, data: result.data });
    } else {
      if (action.schemaerror) {
        return action.schemaerror({
          request: request,
          params: params,
          context: context,
          formdata: formdata,
          error: result.error,
        });
      } else {
        throw result.error;
      }
    }
  };
};
