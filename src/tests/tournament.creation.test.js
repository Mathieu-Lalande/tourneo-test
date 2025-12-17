import test from "node:test";
import assert from "node:assert";

import { createTournament } from "../tournament.ts";

test("Un tournoi doit avoir un nom", () => {
  assert.throws(
    () => createTournament({}),
    /name is required/
  );
});

test("Un tournoi a un nombre minimum et maximum de joueurs", () => {
  const tournament = createTournament({
    name: "Summer tournament",
    minPlayers: 3,
    maxPlayers: 16
  });

  assert.equal(tournament.minPlayers, 3);
  assert.equal(tournament.maxPlayers, 16);
});

test("Le nombre minimum de joueurs ne peut pas dépasser le maximum", () => {
  assert.throws(
    () =>
      createTournament({
        name: "Invalid tournament",
        minPlayers: 10,
        maxPlayers: 5
      }),
    /minPlayers must be lower than maxPlayers/
  );
});
