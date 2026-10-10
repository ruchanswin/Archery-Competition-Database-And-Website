import express, {
  type ErrorRequestHandler,
  type RequestHandler,
} from "express";
import helmet from "helmet";
import path from "node:path";
import {
  getArcherDetails,
  listArchers,
  listCompetitions,
} from "./archeryRepository.js";

const app = express();
const viewsDirectory = path.resolve(process.cwd(), "views");
const publicDirectory = path.resolve(process.cwd(), "public");

app.set("view engine", "ejs");
app.set("views", viewsDirectory);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "https://cdn.jsdelivr.net"],
        fontSrc: ["'self'", "https://cdn.jsdelivr.net", "data:"],
        imgSrc: ["'self'", "data:"],
      },
    },
  }),
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(publicDirectory));

app.get("/", async (_request, response) => {
  response.render("archer", {
    competitions: await listCompetitions(),
    archer: null,
    error: null,
    archerId: "",
    selectedCompetitionId: "",
  });
});

app.post("/archer", async (request, response) => {
  const archerIdValue = String(request.body.archerId ?? "");
  const competitionIdValue = String(request.body.competitionId ?? "");
  const archerId = Number(archerIdValue);
  const competitionId = Number(competitionIdValue);
  if (
    !Number.isSafeInteger(archerId) ||
    archerId < 1 ||
    !Number.isSafeInteger(competitionId) ||
    competitionId < 1
  ) {
    response.status(400).render("archer", {
      competitions: await listCompetitions(),
      archer: null,
      error: "Enter a valid archer ID and choose a competition.",
      archerId: archerIdValue,
      selectedCompetitionId: competitionIdValue,
    });
    return;
  }

  const [competitions, archer] = await Promise.all([
    listCompetitions(),
    getArcherDetails(archerId, competitionId),
  ]);
  response
    .status(archer ? 200 : 404)
    .render("archer", {
      competitions,
      archer,
      archerId: archerIdValue,
      selectedCompetitionId: competitionIdValue,
      error: archer
        ? null
        : "No archer was found for that ID and competition.",
    });
});

app.get("/records", (_request, response) => {
  response.render("records");
});

app.get("/recorder", (_request, response) => {
  response.render("recorder");
});

app.get("/api/competitions", async (_request, response) => {
  response.json(await listCompetitions());
});

app.get("/api/archers", async (_request, response) => {
  response.json(await listArchers());
});

app.get("/api/archers/:archerId", (async (request, response) => {
  const archerId = Number(request.params.archerId);
  const competitionId = Number(request.query.competitionId);
  if (
    !Number.isSafeInteger(archerId) ||
    archerId < 1 ||
    !Number.isSafeInteger(competitionId) ||
    competitionId < 1
  ) {
    response.status(400).json({
      error: "archerId and competitionId must be positive integers.",
    });
    return;
  }

  const archer = await getArcherDetails(archerId, competitionId);
  if (!archer) {
    response.status(404).json({ error: "Archer not found." });
    return;
  }

  response.json(archer);
}) satisfies RequestHandler);

app.use((_request, response) => {
  response.status(404).render("error", {
    message: "The page you requested could not be found.",
  });
});

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error("Request failed:", error);
  if (response.headersSent) {
    return;
  }

  response.status(500).render("error", {
    message: "The request could not be completed. Check the server configuration and try again.",
  });
};

app.use(errorHandler);

export default app;
