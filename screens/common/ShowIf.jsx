export default function ({ test, children }) {
  if (test) return children;
  return null;
}
