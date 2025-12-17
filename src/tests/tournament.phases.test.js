import test from "node:test";
import assert from "node:assert";

import {
  createTournament,
  addPlayer,
  startTournament,
  closePools
} from "../tournament.ts";

test("Les poules sont générées au démarrage du tournoi", () => {
  const tournament = createTournament({
    name: "Tournament with pools",
    minPlayers: 4,
    maxPlayers: 8,
    withPools: true
  });

  ["A", "B", "C", "D"].forEach((name, i) =>
    addPlayer(tournament, { name, phone: String(i) })
  );

  startTournament(tournament);

  assert.ok(tournament.pools);
  assert.ok(tournament.pools.length > 0);
});

test("Impossible de générer les tableaux avant la fin des poules", () => {
  const tournament = createTournament({
    name: "Blocked tournament",
    minPlayers: 4,
    maxPlayers: 8,
    withPools: true
  });

  ["A", "B", "C", "D"].forEach((name, i) =>
    addPlayer(tournament, { name, phone: String(i) })
  );

  startTournament(tournament);

  assert.throws(
    () => closePools(tournament),
    /pools not finished/
  );
});

test("La clôture des poules génère un tableau à élimination", () => {
  const tournament = createTournament({
    name: "Final tournament",
    minPlayers: 4,
    maxPlayers: 8,
    withPools: true
  });

  ["A", "B", "C", "D"].forEach((name, i) =>
    addPlayer(tournament, { name, phone: String(i) })
  );

  startTournament(tournament);

  tournament.poolsFinished = true;

  closePools(tournament);

  assert.ok(tournament.bracket);
});
