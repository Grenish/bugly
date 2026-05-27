export function Header() {
  return (
    <box justifyContent="center" alignItems="center">
      <box flexDirection="column" justifyContent="center" gap={1} alignItems="center">
        <box flexDirection="row" justifyContent="center" gap={1}>
          <ascii-font font="tiny" text="bug" color="gray" />
          <ascii-font font="tiny" text="ly" />
        </box>
      </box>
    </box>
  );
}
