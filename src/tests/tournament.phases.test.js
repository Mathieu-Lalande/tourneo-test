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

test("Le classement final et les sous-tableaux sont générés pour 16 joueurs", () => {
  const tournament = createTournament({
    name: "Classement tournoi 16",
    minPlayers: 16,
    maxPlayers: 16,
    withPools: true
  });
  
  // Ajout de 16 joueurs
  for (let i = 1; i <= 16; i++) {
    addPlayer(tournament, { name: `P${i}`, phone: String(i) });
  }
  startTournament(tournament);
  tournament.poolsFinished = true;
  closePools(tournament);

  // Vérifie la présence des sous-tableaux
  assert.ok(tournament.subBrackets);
  assert.ok(Array.isArray(tournament.subBrackets.principal));
  assert.ok(Array.isArray(tournament.subBrackets.secondaire));
  assert.equal(tournament.subBrackets.principal.length, 8);
  assert.equal(tournament.subBrackets.secondaire.length, 8);

  // Vérifie le classement final
  assert.ok(Array.isArray(tournament.ranking));
  assert.equal(tournament.ranking.length, 16);
  assert.equal(tournament.ranking[0].name, "P1");
  assert.equal(tournament.ranking[15].name, "P16");
});