import { CopyButton } from "@/components/copy-button";

export const INSTALL_COMMAND = "cargo build --release -p velyr-cli";

export function InstallSnippet() {
  return (
    <div className="install">
      <span className="label install-label">Build from source</span>
      <div className="install-row">
        <code>
          <span aria-hidden="true" className="install-prompt">
            ${" "}
          </span>
          {INSTALL_COMMAND}
        </code>
        <CopyButton text={INSTALL_COMMAND} label="Copy build command" />
      </div>
      <p className="install-note">
        Produces the <code>velyr</code> binary in <code>target/release</code>. Prebuilt binaries are on GitHub Releases; there is no install script yet.
      </p>
    </div>
  );
}
