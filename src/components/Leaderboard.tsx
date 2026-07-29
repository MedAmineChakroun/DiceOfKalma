import { getLeaderboard, LeaderboardEntry } from "../game/leaderboard";
import { useMemo } from "react";
import "./Leaderboard.css";

interface Props {
  onBack: () => void;
}

export default function Leaderboard({ onBack }: Props) {
  const entries = useMemo(() => getLeaderboard(), []);

  return (
    <div className="leaderboard-screen">
      <div className="cartoon-panel leaderboard-panel bounce-in">
        <h2 className="cartoon-subtitle leaderboard-title">Leaderboard</h2>

        {entries.length === 0 ? (
          <p className="leaderboard-empty">
            No runs recorded yet. Be the first!
          </p>
        ) : (
          <div className="leaderboard-table-wrap">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Lvl</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry: LeaderboardEntry, i) => (
                  <tr
                    key={`${entry.name}-${entry.date}`}
                    className={i < 3 ? `rank-${i + 1}` : ""}
                  >
                    <td>{i + 1}</td>
                    <td className="lb-name">{entry.name}</td>
                    <td>{entry.level}</td>
                    <td>{entry.score.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button type="button" className="primary" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}
