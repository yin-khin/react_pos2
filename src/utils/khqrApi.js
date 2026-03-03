export async function createKhqrPayload({ amount, orderNo }) {
  const res = await fetch("http://localhost:3000/api/khqr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, orderNo }),
  });

  const data = await res.json();
  if (!data.ok) throw new Error(data.message || "KHQR error");
  return data.payload;
}