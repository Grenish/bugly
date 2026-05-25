import { TextAttributes } from "@opentui/core";
import { useEffect, useState } from "react";
import { getCurrentBranch, isGitAvailable } from "../lib/check-git";
import { basename } from "path";

export function StatusBar() {
  const [isGitInit, setIsGitInit] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<string | null>(null);
  const [currentDir, setCurrentDir] = useState<string>("");

  useEffect(() => {
    const checkGit = async () => {
      const gitAvailable = await isGitAvailable();
      setIsGitInit(gitAvailable);

      if (gitAvailable) {
        const branch = await getCurrentBranch();
        setCurrentBranch(branch);
      }
    };

    checkGit();
    setCurrentDir(basename(process.cwd()));
  }, []);

  return (
    <box flexDirection="row" justifyContent="space-between">
      <box flexDirection="row" gap={1}>
        <text fg={"cyan"}>Build</text>
        <text attributes={TextAttributes.DIM} fg={"gray"}>
          {">"}
        </text>
        <text>gemini-3.1-pro</text>
      </box>
      <box flexDirection="row" gap={1}>
        {isGitInit ? (
          <text>
            
          </text>
        ) : (
          <text>
            
          </text>
        )}

        <text>{currentDir}</text>
        {isGitInit && currentBranch && (
          <>
            <text>•</text>
            <text></text>
            <text fg={"cyan"}>{currentBranch}</text>
          </>
        )}
      </box>
    </box>
  );
}
