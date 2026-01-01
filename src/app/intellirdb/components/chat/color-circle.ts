const COLOR_CIRCLE = (id: string, name: string): string => {
  if (name === "ADMIN") return "red";
  if (!id || id.length < 4) return "#3eac75";

  return (
    "#" +
    (id.slice(0, 3) + id.slice(-3))
      .match(/.{2}/g)!
      .map((hex) =>
        Math.min(parseInt(hex, 16), 160).toString(16).padStart(2, "0")
      )
      .join("")
  );
};

export { COLOR_CIRCLE };
