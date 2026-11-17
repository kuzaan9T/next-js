export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <main>
      <h1>Welcome, {username}</h1>
    </main>
  );
}
