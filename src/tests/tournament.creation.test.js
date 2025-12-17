import test from "node:test";
import assert from "node:assert";

import { createTournament, addPlayer, startTournament } from "../tournament.ts";

test("Un tournoi doit avoir un nom", () => {
  assert.throws(
    () => createTournament({}),
    /name is required/
  );
});

test("Un tournoi a par défaut un nombre minimum et maximum de joueurs (3 et 16)", () => {
  const tournament = createTournament({
    name: "Default tournament"
  });
  assert.equal(tournament.minPlayers, 3);
  assert.equal(tournament.maxPlayers, 16);
});

test("Un tournoi peut avoir un nombre minimum et maximum de joueurs personnalisés", () => {
  const tournament = createTournament({
    name: "Summer tournament",
    minPlayers: 5,
    maxPlayers: 10
  });
  assert.equal(tournament.minPlayers, 5);
  assert.equal(tournament.maxPlayers, 10);
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

test("Un tournoi démarre à 0 joueur, puis peut être démarré dès 3 joueurs inscrits", () => {
  const tournoi = createTournament({ name: "Tournoi à inscription progressive" });
  // Créé avec 0 joueur
  assert.equal(tournoi.players.length, 0);
  // Impossible de démarrer avec moins de 3 joueurs
  assert.throws(() => startTournament(tournoi), /not enough players/);
  // Ajout de 3 joueurs
  addPlayer(tournoi, { name: "A" });
  addPlayer(tournoi, { name: "B" });
  addPlayer(tournoi, { name: "C" });
  // Peut démarrer
  startTournament(tournoi);
  assert.equal(tournoi.status, "STARTED");
});