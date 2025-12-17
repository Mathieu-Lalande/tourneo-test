export interface Player {
  name: string;
  phone?: string;
}

export interface Tournament {
  name: string;
  teams: any[];
  matches: any[];
  createdAt: Date;
  minPlayers?: number;
  maxPlayers?: number;
  players: Player[];
  withPools: boolean;
  pools?: Player[][];
  poolsFinished: boolean;
  bracket?: Player[];
  status: "CREATED" | "STARTED" | "FINISHED";
  subBrackets?: Record<string, Player[]>; // ex: principal, secondaire, perdants, etc.
  ranking?: Player[];
}

export function createTournament({ name, teams = [], minPlayers, maxPlayers, withPools = false }: {
  name: string;
  teams?: any[];
  minPlayers?: number;
  maxPlayers?: number;
  withPools?: boolean;
} ): Tournament {
  if (!name) {
    throw new Error("name is required");
  }
  if (minPlayers !== undefined && maxPlayers !== undefined && minPlayers > maxPlayers) {
    throw new Error("minPlayers must be lower than maxPlayers");
  }
  return {
    name,
    teams,
    matches: [],
    createdAt: new Date(),
    minPlayers,
    maxPlayers,
    players: [],
    withPools,
    pools: undefined,
    poolsFinished: false,
    bracket: undefined,
    status: "CREATED",
  };
}

export function addPlayer(tournament: Tournament, player: Player): void {
  if (tournament.status === "STARTED") {
    throw new Error("registration closed");
  }
  if (tournament.maxPlayers !== undefined && tournament.players.length >= tournament.maxPlayers) {
    throw new Error("tournament is full");
  }
  tournament.players.push(player);
}

export function removePlayer(tournament: Tournament, playerName: string): void {
  const index = tournament.players.findIndex(p => p.name === playerName);
  if (index !== -1) {
    tournament.players.splice(index, 1);
  }
}

export function startTournament(tournament: Tournament): void {
  if (tournament.minPlayers !== undefined && tournament.players.length < tournament.minPlayers) {
    throw new Error("not enough players");
  }
  tournament.status = "STARTED";
  if (tournament.withPools) {
    // Simple pool generation: split players into 2 pools
    const mid = Math.ceil(tournament.players.length / 2);
    tournament.pools = [
      tournament.players.slice(0, mid),
      tournament.players.slice(mid)
    ];
    tournament.poolsFinished = false;
  }
}


// Génère les sous-tableaux et le classement final
export function closePools(tournament: Tournament): void {
  if (!tournament.poolsFinished) {
    throw new Error("pools not finished");
  }
  // On crée un bracket principal et secondaire si > 8 joueurs
  const players = tournament.players.slice();
  let principal: Player[] = [];
  let secondaire: Player[] = [];
  if (players.length > 8) {
    principal = players.slice(0, 8);
    secondaire = players.slice(8);
  } else {
    principal = players;
  }
  tournament.subBrackets = {
    principal,
    secondaire
  };
  // Simule un classement final basé sur la progression dans les sous-tableaux
  tournament.ranking = [
    ...principal,
    ...secondaire
  ];
  tournament.bracket = players;
  tournament.status = "FINISHED";
}
