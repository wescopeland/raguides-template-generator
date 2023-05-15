import React, { ReactElement, useState } from "react";
import cc from "classcat";
import {
  buildAuthorization,
  GameExtendedAchievementEntity,
  getGameExtended,
} from "@retroachievements/api";

function App(): ReactElement {
  const [userName, setUserName] = useState("");
  const [webApiKey, setWebApiKey] = useState("");
  const [gameId, setGameId] = useState("");
  const [formState, setFormState] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [apiCallResult, setApiCallResult] = useState<string | null>(null);

  const handleSubmit = async () => {
    setFormState("loading");

    const authorization = buildAuthorization({ userName, webApiKey });

    const gameExtended = await getGameExtended(authorization, { gameId });
    const markdown = buildMarkdown(gameExtended.achievements);

    setApiCallResult(markdown);
    console.log(markdown);
    setFormState("success");
  };

  const isSubmitDisabled =
    !userName || !webApiKey || !gameId || formState === "loading";

  if (apiCallResult) {
    return (
      <div className="bg-neutral-100 p-10 max-h-screen overflow-scroll">
        <pre>{apiCallResult}</pre>
      </div>
    );
  }

  return (
    <div className="p-20 border shadow-xl border-gray-50 rounded-xl flex flex-col gap-y-2">
      {formState === "error" && (
        <p className="text-red-600">
          Something went wrong. Check your API key.
        </p>
      )}

      <p className="mb-4">Generate RAGuide Achievement Blocks</p>

      <input
        className="p-2 border border-neutral-300 rounded"
        placeholder="Your RA Username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />

      <input
        className="p-2 border border-neutral-300 rounded"
        placeholder="Your RA Web API Key"
        type="password"
        value={webApiKey}
        onChange={(e) => setWebApiKey(e.target.value)}
      />

      <input
        className="p-2 border border-neutral-300 rounded"
        placeholder="RA Game ID"
        type="number"
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
      />

      <button
        className={cc([
          "mt-4 p-4 bg-slate-500 rounded-lg  transition active:scale-95",
          isSubmitDisabled
            ? "bg-neutral-300 text-neutral-400"
            : "bg-yellow-500 text-black",
        ])}
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
      >
        {formState === "loading" ? "Loading..." : "Generate"}
      </button>
    </div>
  );
}

const buildMarkdown = (
  achievements: Record<number, GameExtendedAchievementEntity>
) => {
  let markdown = "";

  for (const achievement of Object.values(achievements)) {
    markdown += `
<img align="left" width="72" height="72" src="https://media.retroachievements.org/Badge/${
      achievement.badgeName
    }">

\`\`\`
${achievement.title} [${achievement.points} ${
      achievement.points === 1 ? "Point" : "Points"
    }]
${achievement.description}
\`\`\`

    `;
  }

  return markdown;
};

export default App;
