import { TextAttributes } from "@opentui/core";
import { useEffect, useState } from "react";
import { getCurrentBranch, isGitAvailable } from "../lib/check-git";
import { basename } from "path";
import { useTheme } from "../providers/theme";

export function StatusBar() {
  const [isGitInit, setIsGitInit] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<string | null>(null);
  const [currentDir, setCurrentDir] = useState<string>("");
  const { colors } = useTheme();

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
        <text fg={colors.primary}>Build</text>
        <text attributes={TextAttributes.DIM} fg={colors.dimSeparator}>
          
        </text>
        <text>gemini-3.1-pro</text>
        <text>󰧑</text>
        <text>High</text>
      </box>
      <box flexDirection="row" gap={1}>
        {isGitInit ? <text></text> : <text></text>}

        <text>{currentDir}</text>
        {isGitInit && currentBranch && (
          <>
            <text>•</text>
            <text></text>
            <text fg={colors.primary}>{currentBranch}</text>
          </>
        )}
      </box>
    </box>
  );
}
