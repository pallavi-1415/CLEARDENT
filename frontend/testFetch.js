async function run() {
  try {
    const res = await fetch('https://cleardent-backend.vercel.app/api/auth/doctors/approved');
    const data = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (err) {
    console.error(err);
  }
}
run();
