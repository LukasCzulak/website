export function ParsedText({ text }) {
  if (!text) return null;

  const parts = text.split(
    /(<red>.*?<\/red>|<purple>.*?<\/purple>|<green>.*?<\/green>|<blue>.*?<\/blue>)/g,
  );

  const renderWithNewlines = (str) => {
    const normalizedStr = str.replace(/\\n/g, "\n");

    return normalizedStr.split("\n").map((line, i, arr) => (
      <span key={i}>
        {line}
        {i !== arr.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith("<red>") && part.endsWith("</red>")) {
          const innerText = part.replace("<red>", "").replace("</red>", "");
          return (
            <span key={index} style={{ color: "red" }}>
              {renderWithNewlines(innerText)}
            </span>
          );
        }

        if (part.startsWith("<purple>") && part.endsWith("</purple>")) {
          const innerText = part
            .replace("<purple>", "")
            .replace("</purple>", "");
          return (
            <span key={index} style={{ color: "purple" }}>
              {renderWithNewlines(innerText)}
            </span>
          );
        }

        if (part.startsWith("<green>") && part.endsWith("</green>")) {
          const innerText = part.replace("<green>", "").replace("</green>", "");
          return (
            <span key={index} style={{ color: "green" }}>
              {renderWithNewlines(innerText)}
            </span>
          );
        }

        if (part.startsWith("<blue>") && part.endsWith("</blue>")) {
          const innerText = part.replace("<blue>", "").replace("</blue>", "");
          return (
            <span key={index} style={{ color: "blue" }}>
              {renderWithNewlines(innerText)}
            </span>
          );
        }

        return <span key={index}>{renderWithNewlines(part)}</span>;
      })}
    </span>
  );
}
