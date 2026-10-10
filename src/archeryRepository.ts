import { getDatabasePool } from "./db.js";

export interface Competition {
  id: number;
  name: string;
}

export interface Archer {
  id: number;
  name: string;
  dateOfBirth: string;
  gender: string;
  categoryName: string;
  className: string;
  divisionName: string;
  roundId: number | null;
  roundDate: string | null;
  roundName: string;
  possibleScore: number;
}

interface CompetitionRow {
  id: number;
  name: string;
}

interface ArcherRow {
  id: number;
  name: string;
  dateOfBirth: string;
  gender: string;
  categoryName: string;
  className: string;
  divisionName: string;
  roundId: number | null;
  roundDate: string | null;
  roundName: string;
  possibleScore: number;
}

interface ArcherSummaryRow {
  id: number;
  name: string;
  dateOfBirth: string;
  gender: string;
}

export async function listCompetitions(): Promise<Competition[]> {
  const { rows } = await getDatabasePool().query<CompetitionRow>(
    'SELECT "CompetitionID" AS id, "CompetitionName" AS name FROM "Competition" ORDER BY "CompetitionName"',
  );
  return rows;
}

export async function getArcherDetails(
  archerId: number,
  competitionId: number,
): Promise<Archer | null> {
  const { rows } = await getDatabasePool().query<ArcherRow>(
    `SELECT
       a."ArcherID" AS id,
       a."ArcherName" AS name,
       a."ArcherDOB" AS "dateOfBirth",
       COALESCE(a."ArcherGender", '') AS gender,
       c."CategoryName" AS "categoryName",
       cl."ClassName" AS "className",
       d."DivisionName" AS "divisionName",
       r."RoundID" AS "roundId",
       r."Date" AS "roundDate",
       dr."RoundName" AS "roundName",
       dr."PossibleScore" AS "possibleScore"
     FROM "Archer" AS a
     JOIN "ArcherCategory" AS ac
       ON ac."ArcherID" = a."ArcherID" AND ac."CompetitionID" = $1
     JOIN "Category" AS c ON c."CategoryID" = ac."CategoryID"
     JOIN "Class" AS cl ON cl."ClassID" = c."ClassID"
     JOIN "Division" AS d ON d."DivisionID" = c."DivisionID"
     JOIN "RoundCategory" AS rc ON rc."CategoryID" = c."CategoryID"
     JOIN "DefinedRound" AS dr ON dr."DefinedRoundID" = rc."DefinedRoundID"
     LEFT JOIN "Round" AS r
       ON r."ArcherCategoryID" = ac."ArcherCategoryID"
       AND r."DefinedRoundID" = rc."DefinedRoundID"
     WHERE a."ArcherID" = $2
     ORDER BY r."Date" DESC
     LIMIT 1`,
    [competitionId, archerId],
  );

  return rows[0] ?? null;
}

export async function listArchers(): Promise<
  Array<Pick<Archer, "id" | "name" | "dateOfBirth" | "gender">>
> {
  const { rows } = await getDatabasePool().query<ArcherSummaryRow>(
    `SELECT
       "ArcherID" AS id,
       "ArcherName" AS name,
       "ArcherDOB" AS "dateOfBirth",
       COALESCE("ArcherGender", '') AS gender
     FROM "Archer"
     ORDER BY "ArcherName"`,
  );
  return rows;
}
