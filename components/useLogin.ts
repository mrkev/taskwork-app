import { Expert } from "@prisma/client";
import { useEffect, useState } from "react";

export type UserStatus = { status: "ok"; expert: Expert };
