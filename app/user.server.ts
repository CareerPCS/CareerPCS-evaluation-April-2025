import { redirect } from "react-router";
import type { AppLoadContext } from "react-router";
import { UserSession } from "./services.server/user-session.server";
import { db, PortalCompanies, Users } from "./services.server/database.server";

export const require_clientcompany_user = async (
  request: Request,
  context: AppLoadContext,
) => {
  try {
    const database = db(context);
    const session = await UserSession(context).getSession(
      request.headers.get("cookie"),
    );
    const user_id = session.get("user_id");

    const url = new URL(request.url);
    const path = `${url.pathname}${url.search}`;
    const login_url = `/login?from=${encodeURIComponent(path)}`;

    if (user_id == null) {
      throw redirect(login_url);
    }

    const user = await database.fetch(Users.document(user_id));
    if (user.data.clientportal_company == null) {
      throw redirect("/login");
    }

    const company = await database.fetch(
      PortalCompanies.document(user.data.clientportal_company.id),
    );

    return { user: user, company: company };
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    } else {
      console.error("Error loading logged in user:", error);
      throw redirect("/login");
    }
  }
};
