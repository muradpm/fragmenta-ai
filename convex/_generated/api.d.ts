/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as authAdapter from "../authAdapter.js";
import type * as email_invites from "../email/invites.js";
import type * as email_magiclink from "../email/magiclink.js";
import type * as email_userinvite from "../email/userinvite.js";
import type * as files from "../files.js";
import type * as forms from "../forms.js";
import type * as http from "../http.js";
import type * as invitations from "../invitations.js";
import type * as members from "../members.js";
import type * as organizations from "../organizations.js";
import type * as questions from "../questions.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  authAdapter: typeof authAdapter;
  "email/invites": typeof email_invites;
  "email/magiclink": typeof email_magiclink;
  "email/userinvite": typeof email_userinvite;
  files: typeof files;
  forms: typeof forms;
  http: typeof http;
  invitations: typeof invitations;
  members: typeof members;
  organizations: typeof organizations;
  questions: typeof questions;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
